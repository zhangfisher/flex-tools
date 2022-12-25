import { Constructor } from '../types';
/**
 * 
 * 一个简单的事件触发器
 * 
 */

 export interface EventEmitterOptions{
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误
 }

export interface ListenerOptions{
    objectify?: boolean             //  当调用时返回一个对象用来
    count?:number                   // 触发几次
}

export interface EventEmitterListener{
    off(): void;    
}


export class EventEmitter{
    // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
    #listeners:Map<string,Map<number,[Function,number]>> = new Map()
    #options:EventEmitterOptions = {ignoreError:true,context:null}
    static listenerSeqId:number = 0
    constructor(options:EventEmitterOptions = {ignoreError:true,context:null}){
        this.#options = Object.assign({ignoreError:true,context:null},options)
    }
    get options(){return this.#options}
    get context(){ return this.options.context}
    /**
     * 订阅事件并返回一个事件订阅ID
     * 
     * 如果options.objectify = true,则返回一个侦听器对象
     * 可以在后续进行退订
     * 
     * @param event 
     * @param callback 
     * @param options 
     * @returns 
     */
    on(event:string,callback:Function,options?:ListenerOptions):EventEmitterListener | number{
        const { objectify = false,count=-1 } =Object.assign({},options) as Required<ListenerOptions>
        if(!this.#listeners.has(event)){
            this.#listeners.set(event,new Map())
        }        
        const listenerId =  ++ EventEmitter.listenerSeqId
        const events = this.#listeners.get(event)
        events?.set(listenerId,[callback,count])
        if(objectify){
            return {
                off:()=>events?.delete(listenerId)
            }
        }else{
            return listenerId
        }
    }
    /**
     * 为订阅函数增加标识Id
     * @param callback 
     */
    private addListenerId(callback:any){
        if(!("__FLEX_LISTENER_ID__" in callback)){
            callback.__FLEX_LISTENER_ID__ = []
        }
        const newId =  ++ EventEmitter.listenerSeqId
        callback.__FLEX_LISTENER_ID__.push(newId)
        return newId
    }    
    private removeListenerId(callback:any,id:number){
        if(!("__FLEX_LISTENER_ID__" in callback)){
            return 
        }
        if(Array.isArray(callback.__FLEX_LISTENER_ID__)){
            let index = callback.__FLEX_LISTENER_ID__.indefOf(id)
            callback.__FLEX_LISTENER_ID__.splice(index,1)
            if(callback.__FLEX_LISTENER_ID__.length==0) delete callback.__FLEX_LISTENER_ID__
        }        
    }
    once(event:string,callback:Function,options?:ListenerOptions){
        return this.on(event,callback,Object.assign({},options,{count:1}))        
    }    
    /**
     * 遍历所有侦听器
     * @param callback 
     */
    private forEachListeners(callback:Function){
        this.#listeners.forEach((listeners,event)=>{
            listeners.forEach(([listener,count],listenerId,eventListeners)=>{
                // 事件
                callback(event,listenerId,listener,count,eventListeners)
            })
        }) 
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
     *  emitter.off(callback,true)           // 同一个原型上的callback均会退订
     *  emitter.off(event,callback,true)     // 退订指定事件的同一个原型上的callback均会退订     
     * 
     * @param event 
     * @param callback 
     * @returns 
     */
    off(){
       if(arguments.length==1){
            if(typeof(arguments[0])=='number'){// 根据订阅ID退订

            }else if(typeof(arguments[0])=='function'){  // 退订指定的函数，函数要求==

            }
       }else if(arguments.length==2){
            if(typeof(arguments[0])=='string' && typeof(arguments[1])=='function'){// 

            }else if(typeof(arguments[0])=='function' && typeof(arguments[1])=='boolean'){  // 

            }
       }else if(arguments.length==3 && typeof(arguments[0])=='string' && typeof(arguments[1])=='function' && typeof(arguments[2])=='boolean'){

       }
        this.forEachListeners(()=>{
            if(listenerId==1){

            }
        })
        if(!this.#listeners.has(event)) return
        let listeners = this.#listeners.get(event) 
        if(listeners){

        }
        for(let i=listeners.length-1;i>=0;i--) {
            if(listeners[i][0]==callback){
                listeners.splice(i,1)
            }
        }
    }
    /**
     * 等待某个事件触发后返回
     * @param event 
     */
    async wait(event:string,timeout:number=0){        
        return new Promise<void>((resolve,reject)=>{
            let tm:any
            if(timeout>0){
                tm=setTimeout(()=>{
                    reject(new Error("Timeout"))    
                },timeout)
            }
            this.once(event,()=>{
                clearTimeout(tm)
                resolve()
            })
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
    getListeners(event:string):Function[]{
        return (this.#listeners.get(event) || []).map(listener => listener[0])
    }
    /**
     * - 对侦听器中counter值大于0的减一
     * - 如果计数器=0则移除
     * @param event 
     */
    _updateListenerCounter(event:string){
        const listeners  = this.#listeners.get(event) || []
        try{
            for(let i = listeners.length-1; i >=0 ; i--){
                const counter = listeners[i][1] 
                if(counter>0){
                    listeners[i][1]--
                    if(listeners[i][1]==0){
                        listeners.splice(i, 1)
                    }
                }            
            }
        }catch{}
    }
    emit(this:any,event:string,...args:any[]):void{
        const listeners  = this.#listeners.get(event) || []
        for(let i = listeners.length-1; i >=0 ; i--){
            const [listener,counter] = listeners[i]
            try{
                if(this.context){
                    listener.apply(this.context, args)
                }else{
                    listener(...args)
                }            
            }catch(e){
                if(this.options.ignoreError==false){
                    throw e
                }
            }             
        }
        this._updateListenerCounter(event)
    }
    async emitAsync(this:any,event:string,...args:any[]){
        const listeners  = this.getListeners(event)        
        let results = await Promise.allSettled(listeners.map((listener:Function) =>listener.apply(this,args))) 
        this._updateListenerCounter(event)
        return results
    }
}