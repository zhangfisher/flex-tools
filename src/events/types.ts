
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

