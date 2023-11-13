/**
 * 
 * 一个简单的事件触发器
 * 
 */

import { assignObject } from "../object" 
import { TimeoutError } from '../func/timeout';
import "../string/replaceAll"

import { remove } from "../array/remove"

export interface FlexEventOptions{
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误  
    wildcard?: boolean          // 是否启用通配符订阅  
    delimiter?:string           // 当启用通配符时的事件分割符 
 }

export interface SubscribeOptions{
    objectify?: boolean                 //  当调用时返回一个对象用来退订
    count?:number                       // 触发几次
}

export interface FlexEventListener<Message=any>{
    (message:Message):void 
}


export type ForEachEventListenerCallback<Message,Events> = ({event,listenerId,listener,count,eventListeners}:{event:Events,listenerId:number,listener:FlexEventListener<Message>,count:number,eventListeners:FlexEventListenerRegistry<Message>})=>boolean | void


export interface FlexEventSubscriber{
    off():void
}


export type FlexEventListenerRegistry<M> = Map<number,[FlexEventListener<M>,number]>
export type FlexListenerRegistry<M,E> = Map<E,FlexEventListenerRegistry<M>>


/**
 * Event: 指定一个通用事件类型
 */
export class FlexEvent<Message=any,Events extends string = string,Options extends Record<string,any>= Record<string,any>>{
    // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
    private _listeners:FlexListenerRegistry<Message,Events>= new Map()
    private _options:Required<FlexEventOptions & Options> 
    // 保留最后一次触发的消息,key=事件名称,value=消息
    private _lastMessage:Record<string,any> = {}        
    static listenerSeqId:number = 0
    constructor(options:FlexEventOptions = {ignoreError:true,context:null}){
        this._options = assignObject({
            ignoreError:true,
            wildcard: true,
            delimiter:"/",
            context:null
        },options) as Required<FlexEventOptions & Options> 
    }
    get options(){return this._options}
    get delimiter(){return this._options.delimiter}
    get context(){ return this.options.context}
    get listeners(){return this._listeners}
    get retainedMessages(){return this._lastMessage}
    /**
     * 检测事件是否匹配
     * 
     * isEventMatched("a/*","x")      false   
     * isEventMatched("a/*","a/b")    true
     * isEventMatched("a/**","a/b")   true
     * isEventMatched("a/ * /*","a/x/x")   true
     * isEventMatched("a/** /c","a/b/x/x/c")   true 
     * isEventMatched("a/** /c/** /d","a/b/x/x/c/x/x/x/d")   true
     * 
     * 事件中的**代表所有层级
     * *代表一个事件名称
     * 
     * @param pattern 
     * @param event 
     */
    private isEventMatched(pattern:string,event:string):boolean{
        if(pattern == event) return true
        if(this._options.wildcard && pattern.includes("*")){
            // 由于通配符**与*冲突，所以先将**替换成一个特殊的字符
            const regex =new RegExp("^"+pattern.replaceAll("**",`__###__`).replaceAll("*","[\\w\\*]*").replaceAll("__###__",`[\\w\\\\*${this.delimiter}]*`)+"$")
            return regex.test(event)
        }else{
            return pattern == event
        }
    }
    /**
     * 订阅事件并返回一个事件订阅ID
     * 
     * 如果options.objectify = true,则返回一个侦听器对象
     * 可以在后续进行退订
     * on(event,callback)
     * on("a/*",callback)     1个*代表匹配一个事件名称
     * on("a/**",callback)    2个*代表所有层级
     * 
     * @param event 
     * @param callback 
     * @param options 
     * @returns 
     */
    on(event:Events,callback:FlexEventListener<Message>,options?:SubscribeOptions):FlexEventSubscriber | number{
        const { objectify = false,count=-1 } =Object.assign({},options) as Required<SubscribeOptions>        
        if(!this._listeners.has(event)){
            this._listeners.set(event,new Map())        
        }
        const listenerId =  ++ FlexEvent.listenerSeqId            
        const eventListeners = this._listeners.get(event) as FlexEventListenerRegistry<Message>
        eventListeners?.set(listenerId,[callback,count])        
        // 如果启用了retain,则应该马上触发最后保存的事件
        this.emitRetainEvent(event,listenerId,eventListeners)      
        if(objectify){
            return {
                off:()=>{
                    eventListeners?.delete(listenerId)
                    if(eventListeners?.size==0){
                        this._listeners.delete(event)
                    }
                }
            }
        }else{
            return listenerId
        }
    } 
    /**
     * 如果事件已经有最近触发时保留的数据，则立即触发事件将最近的数据传递给侦听器
     * @param event 
     */
    private emitRetainEvent(event:Events,listenerId:number,eventListeners:FlexEventListenerRegistry<Message>){
        //setTimeout(()=>{
            if(event in this._lastMessage){                
                this.executeListener(listenerId,eventListeners,this._lastMessage[event])   
            }else if(this.options.wildcard){      // 检查是否有通配符                                
                for(const [key] of Object.entries(this._lastMessage)){                    
                    if(this.isEventMatched(event,key) || this.isEventMatched(key,event) ){      
                        this.executeListener(listenerId,eventListeners,this._lastMessage[key])
                    }
                }
            }            
        //},0)
    }
    /**
     * 只订阅一次事件
     * @param event 
     * @param callback 
     * @param options 
     * @returns 
     */
    once(event:Events,callback:FlexEventListener<Message>,options?:SubscribeOptions){
        return this.on(event,callback,Object.assign({},options,{count:1}))        
    }  

    /**
     * 遍历所有侦听器
     *   {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
     * @param callback  ={}
     */
    private forEachListeners(callback:({event,listenerId,listener,count,eventListeners}:{event:Events,listenerId:number,listener:FlexEventListener<Message>,count:number,eventListeners:FlexEventListenerRegistry<Message>})=>boolean | void){
        // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
        let isAbort = false
        for(let [event,eventListeners] of this._listeners.entries()){
            if(isAbort) break
            for(let [listenerId,[listener,count]] of eventListeners.entries()){
                if(isAbort) break
                let r = callback({event,listenerId,listener,count,eventListeners})
                // 显式返回false时中止遍历
                isAbort = r === false
            }
        }         
    }
    /**
     * 遍历符合event事件的侦听器
     * 
     * forEachEventListeners(event,callback)
     * 
     * @param event         事件名称
     * @param callback 
     * @returns 
     */
    private forEachEventListeners(event:Events,callback:ForEachEventListenerCallback<Message,Events>){
        // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}        
        let isAbort = false        
        let matchedListeners = this.getMatchedListeners(event)           
        for(let [eventName,eventListeners] of matchedListeners){
            if(!eventListeners) continue
            for(let [listenerId,[listener,count]] of eventListeners){
                if(isAbort) break
                let r = callback({event:eventName,listenerId,listener,count,eventListeners})            
                isAbort = r === false// 显式返回false时中止遍历
            }     
        }
    } 
    /**
     * 当调用forEachListeners时，用来根据event名称从侦听器中匹配出对应的侦听器 
     * 
     * @param event 
     */
    private getMatchedListeners(event:Events):[Events,FlexEventListenerRegistry<Message> | undefined][] {
        if(this.options.wildcard){ // 启用通配符
            return [...this._listeners.entries()].filter(([eventName])=>(this.isEventMatched(eventName,event)) || this.isEventMatched(event,eventName))             
        }else{
            return [[event,this._listeners.get(event)]]   
        }
    }


    /**
     * 注销订阅
     * 
     * - 通过listenerId进行退订
     * - 直接指定一个callback并且callback严格相等
     * - 具备同一样原型链的callback的均退订
     * 
     *  let listenerId = emitter.on(event,callback)
     * 
     *  emitter.off(listenerId)              // 精确退订指定的订阅，需要自行保存订阅Id
     *  emitter.off(callback)                // 所有callback均会退订
     *  emitter.off(event,callback)          // 退订指定事件的callback均会退订 
     * 
     * @param event 
     * @param callback 
     * @returns 
     */ 
     off(listener:FlexEventListener<Message>):void;
     off(listenerId:number):void;
     off(event:Events,listener:FlexEventListener<Message>):void;
     off(){
        // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
       if(arguments.length==1){
            if(typeof(arguments[0])=='number'){// off(listenerId) 根据订阅ID退订
                this.forEachListeners(({listenerId,eventListeners,event})=>{
                    if(listenerId == arguments[0]){
                        eventListeners.delete(listenerId)
                        if(this._listeners.get(event)?.size==0) this._listeners.delete(event)
                        return false
                    }   
                })
            }else if(typeof(arguments[0])=='function'){  // off(callback) 
                let callback = arguments[0]
                this.forEachListeners(({listenerId,listener,eventListeners,event})=>{
                    if(listener == callback){
                        eventListeners.delete(listenerId) 
                        if(this._listeners.get(event)?.size==0) this._listeners.delete(event)
                    }   
                })
            }
       }else if(arguments.length==2){
            if(typeof(arguments[0])=='string' && typeof(arguments[1])=='function'){// off(event,callback)
                this.forEachEventListeners(arguments[0] as Events,({event,listenerId,listener,eventListeners})=>{
                    if(event == arguments[0] && listener ==  arguments[1] ){
                        eventListeners.delete(listenerId) 
                        if(this._listeners.get(event)?.size==0) this._listeners.delete(event)
                    }
                })
            }
       } 
    }

    /**
     * 等待某个事件触发后返回
     * @param event  一个或多个事件名称
     */
    waitFor(event:Events | Events[],timeout:number=0){        
        return new Promise<any[]>((resolve,reject)=>{
            let tmId:any,isTimeout:boolean=false
            let listenerIds:number[]=[]
            let isResolve:boolean = false
            let isListened:string[]
            let results:any[]=[]
            // 与侦听模式，即需要同时侦听到所有事件才返回
            let andMode:boolean = false
            if(timeout>0){
                tmId=setTimeout(()=>{
                    isTimeout=true
                    listenerIds.forEach(eid=>this.off(eid))
                    reject(new TimeoutError())    
                },timeout)
            }            
            const doneCallback = ()=>{
                if(isResolve) return
                clearTimeout(tmId)
                isResolve=true
                resolve(results)
            }
            let events:Events[] = []
            if(Array.isArray(event)){
                events = event
            }else if(typeof(event)=='string'){
                if(event.includes(',')){
                    events = event.split(',')  as Events[]
                    andMode=true
                }else{
                    events = [event]
                }
            }
            isListened = [...events]
            if(andMode){        
                listenerIds = events.map(ev=>{
                    return this.once(ev,(...args:any[])=>{        
                        if(isTimeout) return
                        let c = remove(isListened,ev)
                        if(c>0) results.push(...args) // 重复触发只返回一次
                        if(isListened.length==0){
                            doneCallback()
                        }
                    }) as number                    
                })            
            }else{
                listenerIds = events.map(ev=>{
                    return this.once(ev,(...args:any[])=>{     
                        if(isTimeout) return
                        results.push(...args)
                        doneCallback()
                    }) as number
                }) 
            }            
        })
    }
    clear(){
        this._lastMessage={}
        this.offAll()
    }
    offAll(event?:Events){
        if(event){
            this._listeners.delete(event)
        }else{
            this._listeners.clear()
        }        
    }
    /**
     * 返回指定事件的的所有侦听器函数
     * @param event 
     * @returns 
     */
    getListeners(event:Events):FlexEventListener<Message>[]{
        let listeners: FlexEventListener<Message>[]=[]
        this.forEachEventListeners(event,({listener})=>{
            listeners.push(listener)
        })      
        return listeners  
    }
    /**    
     * 执行侦听器函数
     * 
     * @param listenerId  侦听器ID
     * @param listeners   事件侦听器列表  
     * @param message 
     * @returns 
     */
    private executeListener(listenerId:number,listeners:FlexEventListenerRegistry<Message>,message?:Message){
        if(!listeners) return 
        const listener = listeners!.get(listenerId)
        if(!listener) return 
        try{
            if(this.context!==undefined){
                return listener[0].apply(this.context, [message!])
            }else{
                return listener[0](message!)
            }            
        }catch(e){
            if(this.options.ignoreError==false){
                throw e
            }
        }finally{
            if(listener[1]>-1){
                listener[1] = listener[1]-1
                if(listener[1]==0){
                    listeners.delete(listenerId)
                }
            }            
        }  
    }   
    private executeListeners(event:Events,message?:Message,callback?:(listenerId?:number)=>void){
        let results:any[] = []
        this.forEachEventListeners(event,({event:eventName,listenerId,eventListeners})=>{
            results.push(this.executeListener(listenerId,eventListeners,message))
            if(typeof(callback)=='function') callback(listenerId)
            if(eventListeners.size==0){
                this._listeners.delete(eventName)
            }
        })   
        return results
    }
    /**
     * 触发事件
     * 
     * emit("a/b/c")
     * 
     * @param event 
     * @param message 
     */
    emit(event:Events,message?:Message,retain?:boolean){
        if(retain){
            this._lastMessage[event] = message
        }
        return this.executeListeners(event,message)
    }
    /**
     * 异步触发事件
     * @param this 
     * @param event 
     * @param message 
     * @returns 
     */
    async emitAsync(event:Events,message?:Message,retain?:boolean){
        const listeners  = this.getListeners(event)        
        if(retain){
            this._lastMessage[event] = message
        }
        let results = await Promise.allSettled(listeners.map((listener:Function) =>{
            return listener.call(this,message)
        })) 
        // 以下处理侦听器的计数,每次递增并且在=0时清除
        this.forEachEventListeners(event,({event:eventName,listenerId,eventListeners})=>{
            let listener = eventListeners.get(listenerId)
            if(listener){
                if(listener[1]>-1){
                    listener[1]--
                    if(listener[1]==0){
                        eventListeners.delete(listenerId)
                    }
                }                
            }
            if(this._listeners.get(eventName)?.size==0){
                this._listeners.delete(eventName)
            }
            
        })
        return results.map(result=>result.status=='fulfilled' ? result.value : result.reason)
    }
}