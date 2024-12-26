/** 
* 一个简单的事件触发器 
*/
 
export interface FlexLiteEvents{

}

export interface LiteEventSubscribeOptions{
    objectify?: boolean                 //  当调用时返回一个对象用来退订
    count?:number                       // 触发几次
}
export interface LiteEventOptions{
    ignoreError?:boolean                // 执行侦听器出错时是否忽略错误
}

export interface LiteEventListener<Message=any>{
    (message:Message):void 
}


export type ForEachLiteEventListenerCallback<Events,Message> = ({event,listenerId,listener,count,eventListeners}:{event:Events,listenerId:number,listener:LiteEventListener<Message>,count:number,eventListeners:LiteEventListenerRegistry<Message>})=>boolean | void


export interface LiteEventSubscriber{
    off():void
}


export type LiteEventListenerRegistry<M> = Map<number,[LiteEventListener<M>,number]>
export type LiteListenerRegistry<E,M> = Map<E,LiteEventListenerRegistry<M>>


export class LiteEvent<
    Events extends FlexLiteEvents = Record<string,any>,
    EventNames extends keyof Events = keyof Events,
    Message = any
>{
     
    private _listeners:LiteListenerRegistry<EventNames,Message>= new Map()     // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
     
    private _lastMessage:Record<string,any> = {}                       // 保留最后一次触发的消息,key=事件名称,value=消息
    static listenerSeqId:number = 0
    options:Required<LiteEventOptions>
    constructor(options?:LiteEventOptions){
        this.options = Object.assign({
            ignoreError:false
        },options) as Required<LiteEventOptions>
     }
    get listeners(){return this._listeners}
     /**
      * 订阅事件并返回一个事件订阅ID
      * 
      * @param event 
      * @param callback 
      * @param options 
      * @returns 
      */
    on<T extends EventNames>(event:T,callback:LiteEventListener<Events[T]>,options?:LiteEventSubscribeOptions):LiteEventSubscriber | number
    on(event:'*',callback:LiteEventListener<Message>,options?:LiteEventSubscribeOptions):LiteEventSubscriber | number
    on():LiteEventSubscriber | number{
        const event = arguments[0] as EventNames
        const callback = arguments[1] as LiteEventListener<Message>
        const options = arguments[2] as LiteEventSubscribeOptions
        const { objectify=false,count=-1 } = Object.assign({},options) as Required<LiteEventSubscribeOptions>        
        if(!this._listeners.has(event)){
             this._listeners.set(event,new Map())        
        }
        const listenerId =  ++LiteEvent.listenerSeqId            
        const eventListeners = this._listeners.get(event) as LiteEventListenerRegistry<Message>
        eventListeners?.set(listenerId,[callback,count])        
        this._emitRetainEvent(event,listenerId,eventListeners)      
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
    onAny(callback:LiteEventListener<Message>,options?:LiteEventSubscribeOptions):LiteEventSubscriber | number{
        return this.on('*',callback,options)
    }
     /**
      * 如果事件已经有最近触发时保留的数据，则立即触发事件将最近的数据传递给侦听器
      * @param event 
      */
    private _emitRetainEvent(event:EventNames,listenerId:number,eventListeners:LiteEventListenerRegistry<Message>){
        if(event in this._lastMessage){
            this._executeListener(listenerId,eventListeners,this._lastMessage[event as string])   
        }        
    }
     /**
      * 只订阅一次事件
      * @param event 
      * @param callback 
      * @param options 
      * @returns 
      */
    once<T extends EventNames>(event:T,callback:LiteEventListener<Events[T]>,options?:LiteEventSubscribeOptions){
         return this.on(event,callback,Object.assign({},options,{count:1}))        
    }  
 
    /**
      * 遍历所有侦听器
      *   {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
      * @param callback  ={}
      */
    private _forEachListeners(callback:({event,listenerId,listener,count,eventListeners}:{event:EventNames,listenerId:number,listener:LiteEventListener<Message>,count:number,eventListeners:LiteEventListenerRegistry<Message>})=>boolean | void){
         // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
         let isAbort = false
         for(let [event,eventListeners] of this._listeners.entries()){
             if(isAbort) break
             for(let [listenerId,[listener,count]] of eventListeners.entries()){
                 if(isAbort) break
                 let r = callback({event,listenerId,listener,count,eventListeners})                
                 isAbort = r === false // 显式返回false时中止遍历
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
     private _forEachEventListeners(event:EventNames,callback:ForEachLiteEventListenerCallback<EventNames,Message>){
         // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}        
         let isAbort = false        
         let matchedListeners = [[event,this._listeners.get(event)]] as [EventNames,LiteEventListenerRegistry<Message> | undefined][]       
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
      off(listener:LiteEventListener<Message>):void;
      off(listenerId:number):void;
      off(event:EventNames,listener:LiteEventListener<any>):void;
      off(){
         // {"<事件名称>":{<listenerId>:[Callback,<侦听次数>]}}
        if(arguments.length==1){
             if(typeof(arguments[0])=='number'){// off(listenerId) 根据订阅ID退订
                 this._forEachListeners(({listenerId,eventListeners,event})=>{
                     if(listenerId == arguments[0]){
                         eventListeners.delete(listenerId)
                         if(this._listeners.get(event)?.size==0) this._listeners.delete(event)
                         return false
                     }   
                 })
             }else if(typeof(arguments[0])=='function'){  // off(callback) 
                 let callback = arguments[0]
                 this._forEachListeners(({listenerId,listener,eventListeners,event})=>{
                     if(listener == callback){
                         eventListeners.delete(listenerId) 
                         if(this._listeners.get(event)?.size==0) this._listeners.delete(event)
                     }   
                 })
             }
        }else if(arguments.length==2){
             if(typeof(arguments[0])=='string' && typeof(arguments[1])=='function'){// off(event,callback)
                 this._forEachEventListeners(arguments[0] as EventNames,({event,listenerId,listener,eventListeners})=>{
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
      * @param event  事件名称
      */
    waitFor(event:EventNames,timeout:number=0){        
         return new Promise<Message>((resolve,reject)=>{
             let tmId:any,isTimeout:boolean=false 
             let listenerId:number
             if(timeout>0){
                 tmId=setTimeout(()=>{
                     isTimeout=true
                     this.off(listenerId)
                     reject(new Error("Timeout"))    
                 },timeout)
             }        
            listenerId = this.once(event,(message:any)=>{     
                if(isTimeout) return
                clearTimeout(tmId) 
                resolve(message)
            }) as number
        })
    }
    offAll(event?:EventNames){
         if(event){
             this._listeners.delete(event)
         }else{
             this._listeners.clear()
         }        
     }
     /**    
      * 执行侦听器函数
      * 
      * @param listenerId  侦听器ID
      * @param listeners   事件侦听器列表  
      * @param message 
      * @returns 
      */
    private _executeListener(listenerId:number,listeners:LiteEventListenerRegistry<Message>,message?:Message){
         if(!listeners) return 
         const listener = listeners!.get(listenerId)
         if(!listener) return 
         try{
            return listener[0](message!) 
         }catch(e){
            if(!this.options.ignoreError) throw e
         }finally{
             if(listener[1]>-1){
                 listener[1] = listener[1]-1
                 if(listener[1]==0){
                     listeners.delete(listenerId)
                 }
             }            
         }  
     }   
     private _executeListeners(event:EventNames,message?:Message,callback?:(listenerId?:number)=>void){
         let results:any[] = []
         this._forEachEventListeners(event,({event:eventName,listenerId,eventListeners})=>{
             results.push(this._executeListener(listenerId,eventListeners,message))
             if(typeof(callback)=='function') callback(listenerId)
             if(eventListeners.size==0){
                 this._listeners.delete(eventName)
             }
         })   
         return results
     }
     /**
      * 触发事件
      * @param event 
      * @param message 
      */
    emit<T extends EventNames>(event:T,message?:Events[T],retain?:boolean){
        if(retain){
            this._lastMessage[event as any] = message
        }
        return this._executeListeners(event,message as any)
    }
    async emitAsync<T extends EventNames>(event:T,message?:Events[T],retain?:boolean){
        return await Promise.allSettled(this.emit(event,message,retain))
     }
 } 

 
  
//  export type VoerkaI18nEvents = {
//     log        : { level: string, message:string }       // 当有日志输出时，data={level
//     ready      : { scope:string,language:string }                        // 当默认语言第一次加载完成后触发，data={language,scope}
//     Change     : string                                                 // 当语言切换时    data=language
//     Registered : string                                                 // 当Scope注册到成功后    
//     Restore    : { scope:string,language:string }                        // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}
//     Patched    : { scope:string,language:string }                        // 当Scope加载并从本地存储中读取语言包合并到语言包时 ，data={language,scope}               
// }      
    


//  const ev = new LiteEvent<VoerkaI18nEvents>()

//  ev.on("log",({level,message})=>{
//     console.log(level,message)
//  })
//  ev.on("*",({level,message})=>{
//     console.log(level,message)
//  })
//  ev.emit("log",{level:"",message:""})