/**
 *  基于FlexEvent的事件总线
 * 
 *  let bus = new FlexEventBus() 
 * 
 *  class MyModule extends FlexEventBusNode{ 
 *    constructor(){
 *      this.join(bus)
 *    }  
 *    onMessage(message:FlexEventBusMessage){
 *       // 接收消息 
 *    }
 *  }
 * 
 *  let node = new FlexEventBusNode({id:"node1"})
 *  node.join(bus)
 * 
 *  node.onMessage((message)=>{....})
 * 
 *  
 * 
 * 
 * 
 */
import { assignObject } from "../object/assignObject"
import { FlexEvent } from "./flexEvent"
import type { FlexEventListener,FlexEventOptions,FlexEventSubscriber } from "./flexEvent"


export interface FlexEventLikeError{
    code?:number
    message?:string
}
 
export enum FlexEventBusNodeEvents{
    Join    = "$node/join",                          // 节点加入到总线时
    Disjoin = "$node/disjoin"                       // 节点从总线中断开时
}

let seq = 0
export function buildFlexEventBusMessage(payload:any,meta?:FlexEventBusMessageMeta):FlexEventBusMessage{
    return {
        id: ++seq,
        meta:assignObject({
            timestamp:Date.now()
        },meta),
        payload,
    }
}

export interface FlexEventBusMessageMeta{
    timestamp?:number                    // 消息产生的时间戳
    [key:string]:any                     // 额外的元数据
}

/**
 * 为总线中的消息指定类型
 */
 export interface FlexEventBusMessage{
    from?:string                                // 消息来源=<节点的id>/<事件名称>
    id?:number                                  // 消息唯一标识用来跟踪消息时有用
    meta?:FlexEventBusMessageMeta
    error?:FlexEventLikeError | Error           // 错误信息
    payload?:any
}


export interface FlexEventBusNodeOptions{
    id?:string                                  // 为节点取一个标识，比如模块名称之类
    receiveBoradcast?:boolean                   // 是否接收广播消息
    onMessage?:FlexEventListener<FlexEventBusMessage>
}

const THIS_NODE_EVENT =  "{}/$data"          // 用来接收本节点消息的事件名称
const ALL_NODE_EVENT =  "$ALL"           // 用来发送给所有节点广播消息的事件名称

export class FlexEventBusNode{
    #options:Required<FlexEventBusNodeOptions>
    #eventbus?:FlexEventBus
    #subscribers?:FlexEventSubscriber[] = []
    constructor(options?:FlexEventBusNodeOptions){
        this.#options = assignObject({
            id:`${Date.now()}${Math.random()*1000}`,
            receiveBoradcast:true
        },options) 
    }
    get id(){return this.#options.id}

    private _onMessage(message:FlexEventBusMessage){
        if(typeof this.#options.onMessage=="function"){
            this.#options.onMessage.call(this,message)
        }else if('onMessage' in this){
            this.onMessage.call(this,message)
        }
    }
    /**
     * 接收到发送给该节点的消息时触发
     * 供子类继承
     * @param message 
     */
    onMessage(message:FlexEventBusMessage){
        
    } 
    /**
     * 连接到总线
     * @param eventbus 
     */
    join(eventbus:FlexEventBus){
        this.#eventbus = eventbus
        const onMessage = this._onMessage.bind(this) as FlexEventListener
        // 订阅发送给本节点的消息
        this.#subscribers?.push(eventbus.on(THIS_NODE_EVENT.params(this.id),onMessage ,{objectify:true}) as FlexEventSubscriber)
        // 订阅广播消息
        if(this.#options.receiveBoradcast){
            this.#subscribers?.push(eventbus.on(ALL_NODE_EVENT,onMessage,{objectify:true}) as FlexEventSubscriber)
        }
        // 触发节点加入事件,  $node/join   
        this.#eventbus?.emit(FlexEventBusNodeEvents.Join,{payload:this.id} as FlexEventBusMessage)
    }
    /**
     * 从总线中断开
     */
    disjoin(){
        // 取消订阅事件
        this.#subscribers?.forEach(subscriber=>subscriber.off())
        // 触发节点离开事件,  $node/disjoin
        this.#eventbus?.emit(FlexEventBusNodeEvents.Disjoin,{payload:this.id} as FlexEventBusMessage)
        this.#eventbus=undefined
    }     
    /**
     * 以当前节点身份向总线触发事件
     * 
     * 如node(name='device')
     * 
     * let node = new FlexEventbusNode({id:"device"})
     * node.emit("a")           // == FlexEventbus.emit("device/a")
     * @param message 
     */
    emit(event:string,payload:any,meta?:FlexEventBusMessageMeta){
        let message = buildFlexEventBusMessage(payload,meta)        
        message.from = `${this.id}${this.#eventbus?.delimiter}${event}`
        this.#eventbus?.emit(message.from,message)
    }      
    async emitAsync(event:string,payload:any,meta?:FlexEventBusMessageMeta){
        let message = buildFlexEventBusMessage(payload,meta)        
        message.meta!.from = this.id
        message.from = `${this.id}${this.#eventbus?.delimiter}${event}`     
        return this.#eventbus?.emitAsync(message.from,message)
    }

    /**
     * 向指定节点发送消息
     * @param nodeId   目标节点id
     * @param message 
     */
    send(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta){
        let message = buildFlexEventBusMessage(payload,meta)        
        message.from = this.id
        return this.#eventbus?.emit(THIS_NODE_EVENT.params(nodeId),message)
    }
    sendAsync(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta){
        let message = buildFlexEventBusMessage(payload,meta)        
        message.from = this.id
        return this.#eventbus?.emitAsync(THIS_NODE_EVENT.params(nodeId),message)
    }  
    /**
     * 只订阅一次事件
     * @param event 
     * @param listener 
     * @returns 
     */
    once(event:string,listener?:FlexEventListener<FlexEventBusMessage>){
        const delimiter = this.#eventbus?.delimiter!
        if(!event.includes(delimiter)) event = `${this.id}${delimiter}${event}`
        return this.#eventbus?.once(event,(listener ? listener : this._onMessage.bind(this)) as FlexEventListener )
    }
    /**
     * 订阅事件
     * @param event  事件名称，如果不包含分隔符，会自动加上当前节点id作为前缀
     * @param listener 
     * @returns 
     */
    on(event:string,listener?:FlexEventListener<FlexEventBusMessage>){
        const delimiter = this.#eventbus?.delimiter!
        if(!event.includes(delimiter)) event = `${this.id}${delimiter}${event}`
        return this.#eventbus?.on(event,(listener ? listener : this._onMessage.bind(this)) as FlexEventListener )
    }
    /**
     * 等待某个事件发生
     * @param event 
     * @param timeout 
     * @returns 
     */
    async waitFor(event:string,timeout?:number){
        const delimiter = this.#eventbus?.delimiter!
        if(!event.includes(delimiter)) event = `${this.id}${delimiter}${event}`
        return  this.#eventbus?.waitFor(event,timeout)
    }
    /**
     * 广播消息，所有节点都会收到该消息
     * @param message 
     * @param useAsync
     */
    boradcast(message:FlexEventBusMessage,useAsync:boolean=false){
        message.from = this.id
        if(useAsync){
            return this.#eventbus?.emitAsync(ALL_NODE_EVENT,message)
        }else{
            return this.#eventbus?.emit(ALL_NODE_EVENT,message)
        }        
    }
}
export type FlexEventBusOptions = FlexEventOptions 
/**
 * 
 * 一个简单的事件总线，每一个节点均具有唯一的ID
 * 
 */
export class FlexEventBus extends FlexEvent<FlexEventBusMessage>{
    #nodes:string[] = []
    constructor(options?:FlexEventBusOptions){
        super(options)
        this.on(FlexEventBusNodeEvents.Join,this.onNodeJoin.bind(this) as FlexEventListener)
        this.on(FlexEventBusNodeEvents.Disjoin,this.onNodeDisjoin.bind(this) as FlexEventListener)
    }
    private onNodeJoin(message:FlexEventBusMessage){
        this.#nodes.push(message.payload)
    }
    private onNodeDisjoin(message:FlexEventBusMessage){
        this.#nodes = this.#nodes.filter(node=>node!=message.payload)
    } 
    /**
     * 广播消息，所有节点都会收到该消息
     *  
     * @param message 
     * @param useAsync 
     * @returns 
     */
    broadcast(payload:any,meta?:FlexEventBusMessageMeta){        
        let message = buildFlexEventBusMessage(payload,meta)
        return this.emit(ALL_NODE_EVENT,message as FlexEventBusMessage)        
    }
    /**
     * 向指定的节点发送消息
     * @param nodeId 
     * @param message 
     */
    send(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta){
        let message = buildFlexEventBusMessage(payload,meta)
        this.emit(THIS_NODE_EVENT.params(nodeId),message)
    } 
}

 