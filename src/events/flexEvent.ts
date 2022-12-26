 
/**
 * 
 * 一个简单的事件触发器
 * 
 */

 export interface FlexEventOptions{
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误  
    wildcard?: boolean          // 是否启用通配符订阅  
    delimiter?:string           // 当启用通配符时的事件分割符
 }

export interface ListenerOptions{
    objectify?: boolean                 //  当调用时返回一个对象用来
    count?:number                       // 触发几次
}

export interface FlexEventListener{
    off(): void;    
}

export type FlexEventListenerRegistry = Map<number,[Function,number]>
export type FlexListenerRegistry = Map<string,FlexEventListenerRegistry>

export class FlexEvent{
    // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
    #listeners:FlexListenerRegistry = new Map()
    #options:Required<FlexEventOptions> 
    static listenerSeqId:number = 0
    constructor(options:FlexEventOptions = {ignoreError:true,context:null}){
        this.#options = Object.assign({
            ignoreError:true,
            wildcard: true,
            delimiter:"/",
            context:null
        },options) as Required<FlexEventOptions> 
    }
    get options(){return this.#options}
    get delimiter(){return this.#options.delimiter}
    get context(){ return this.options.context}

    /**
     * 检测事件是否匹配
     * 
     * isEventMatched("a/*","x")      false   
     * isEventMatched("a/*","a/b")    true
     * isEventMatched("a/**","a/b")   true
     * isEventMatched("a/ * /*","a/x/x")   true
     * isEventMatched("a/** /c","a/b/x/x/c")   true 
     * isEventMatched("a/** /c/** /d","a/b/x/x/c/x/x/x/d")   true
     * @param onEvent 
     * @param event 
     */
    private isEventMatched(onEvent:string,event:string):boolean{
        if(this.#options.wildcard && onEvent.includes("*")){
            // 由于通配符**与*冲突，所以先将**替换成一个特殊的字符
            const regex =new RegExp("^"+onEvent.replaceAll("**",`__###__`).replaceAll("*","[\\w]*").replaceAll("__###__",`[\\w\\${this.delimiter}]*`)+"$")
            return regex.test(event)
        }else{
            return onEvent == event
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
    on(event:string,callback:Function,options?:ListenerOptions):FlexEventListener | number{
        const { objectify = false,count=-1 } =Object.assign({},options) as Required<ListenerOptions>        
        if(!this.#listeners.has(event)){
            this.#listeners.set(event,new Map())        }
        const listenerId =  ++ FlexEvent.listenerSeqId            
        const eventListeners = this.#listeners.get(event)
        eventListeners?.set(listenerId,[callback,count])        
        if(objectify){
            return {
                off:()=>{
                    eventListeners?.delete(listenerId)
                    if(eventListeners?.size==0){
                        this.#listeners.delete(event)
                    }
                }
            }
        }else{
            return listenerId
        }
    } 
    /**
     * 只订阅一次事件
     * @param event 
     * @param callback 
     * @param options 
     * @returns 
     */
    once(event:string,callback:Function,options?:ListenerOptions){
        return this.on(event,callback,Object.assign({},options,{count:1}))        
    }  

    /**
     * 遍历所有侦听器
     *   {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
     * @param callback  ={}
     */
    private forEachListeners(callback:({event,listenerId,listener,count,eventListeners}:{event:string,listenerId:number,listener:Function,count:number,eventListeners:FlexEventListenerRegistry})=>boolean | void){
        // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
        let isAbort = false
        for(let [event,eventListeners] of this.#listeners.entries()){
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
    private forEachEventListeners(event:string,callback:({event,listenerId,listener,count,eventListeners}:{event:string,listenerId:number,listener:Function,count:number,eventListeners:FlexEventListenerRegistry})=>boolean | void){
        // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}        
        let isAbort = false        
        let ls:[string,FlexEventListenerRegistry | undefined][] = this.options.wildcard ? 
                [...this.#listeners.entries()].filter(([eventName])=>this.isEventMatched(eventName,event))             //
                : [[event,this.#listeners.get(event)]]              // 精确匹配
           
        for(let [eventName,eventListeners] of ls){
            if(!eventListeners) continue
            for(let [listenerId,[listener,count]] of eventListeners){
                if(isAbort) break
                let r = callback({event:eventName,listenerId,listener,count,eventListeners})            
                isAbort = r === false// 显式返回false时中止遍历
            }     
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
    off(...args:any[]){
        // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
       if(args.length==1){
            if(typeof(args[0])=='number'){// off(listenerId) 根据订阅ID退订
                this.forEachListeners(({listenerId,eventListeners,event})=>{
                    if(listenerId == args[0]){
                        eventListeners.delete(listenerId)
                        if(this.#listeners.get(event)?.size==0) this.#listeners.delete(event)
                        return false
                    }   
                })
            }else if(typeof(args[0])=='function'){  // off(callback) 
                let callback = args[0]
                this.forEachListeners(({listenerId,listener,eventListeners,event})=>{
                    if(listener == callback){
                        eventListeners.delete(listenerId) 
                        if(this.#listeners.get(event)?.size==0) this.#listeners.delete(event)
                    }   
                })
            }
       }else if(args.length==2){
            if(typeof(args[0])=='string' && typeof(args[1])=='function'){// off(event,callback)
                this.forEachEventListeners(args[0],({event,listenerId,listener,eventListeners})=>{
                    if(event == args[0] && listener ==  args[1] ){
                        eventListeners.delete(listenerId) 
                        if(this.#listeners.get(event)?.size==0) this.#listeners.delete(event)
                    }
                })
            }
       } 
    }

    /**
     * 等待某个事件触发后返回
     * @param event 
     */
    async waitFor(event:string,timeout:number=0){        
        return new Promise<any[]>((resolve,reject)=>{
            let tm:any, eid:number
            if(timeout>0){
                tm=setTimeout(()=>{
                    this.off(eid)
                    reject(new Error("Timeout"))    
                },timeout)
            }
            eid  = this.once(event,(...args:any[])=>{
                clearTimeout(tm)
                resolve(args)
            }) as number
        })
    }

    clear(){
        this.offAll()
    }
    offAll(event?:string){
        if(event){
            this.#listeners.delete(event)
        }else{
            this.#listeners.clear()
        }        
    }
    /**
     * 返回指定事件的的所有侦听器函数
     * @param event 
     * @returns 
     */
    getListeners(event:string):Function[]{
        let listeners: Function[]=[]
        this.forEachEventListeners(event,({listener})=>{
            listeners.push(listener)
        })      
        return listeners  
    }
    /**    
     * 执行侦听器函数
     */
    private executeListener(listenerId:number,listeners:FlexEventListenerRegistry,args:any[]){
        if(!listeners) return 
        const listener = listeners!.get(listenerId)
        if(!listener) return 
        try{
            if(this.context!==undefined){
                return listener[0].apply(this.context, args)
            }else{
                return listener[0](...args)
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
    /**
     * 触发事件
     * 
     * emit("a/b/c")
     * 
     * @param event 
     * @param args 
     */
    emit(event:string,...args:any[]){
        let results:any[] = []
        this.forEachEventListeners(event,({event:eventName,listenerId,eventListeners})=>{
            results.push(this.executeListener(listenerId,eventListeners,args))
            if(eventListeners.size==0){
                this.#listeners.delete(eventName)
            }
        })   
        return results
    }
    /**
     * 异步触发事件
     * @param this 
     * @param event 
     * @param args 
     * @returns 
     */
    async emitAsync(event:string,...args:any[]){
        const listeners  = this.getListeners(event)        
        let results = await Promise.allSettled(listeners.map((listener:Function) =>listener.apply(this,args))) 
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
            if(this.#listeners.get(eventName)?.size==0){
                this.#listeners.delete(eventName)
            }
            
        })
        return results.map(result=>result.status=='fulfilled' ? result.value : result.reason)
    }
}