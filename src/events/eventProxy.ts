
/**
 * 事件总线代理
 *
 * 引入本类的目的是为了能正确处理方法的this
 *
 *  正常情况下，我们在进行事件订阅时，callback的this一般默认会指向eventbus
 *
 *  比如 VoerkaEventbus.on(event,this.onMessage)
 *      订阅后onMessage的this是指向总线实例的，而不是当前对象的实例
 *      而我们往往需要此时的onMessage的this还是指向原来所在的类实例，但事实上是在进行事件订阅时onMessage会变化
 *   为了解决这个问题，我们需要这样
 *       VoerkaEventbus.on(event,this.onMessage.bind(this))
 *   如此就能保证事件发生时，onMessage执行时的this正确地指向当前类实例
 *
 *   但是问题随之而来，当我们需要退订该事件时,无论是
 *       VoerkaEventbus.off(event,this.onMessage.bind(this))
 *       VoerkaEventbus.off(event,this.onMessage)
 *   均是无效的，原因在于每次调用 this.onMessage.bind(this)均是生成一个新的函数，
 *   这样事实上，this.onMessage.bind(this)!==this.onMessage.bind(this)!==this.onMessage
 *   因此，上述两种退订方式均是无法生效的。
 *
 *   正确的方式应该是这样：
 *   const listener = this.onMessage.bind(this)
 *   VoerkaEventbus.on(event,listener)
 *   VoerkaEventbus.off(event,listener)
 *
 *   也就是说，如果需要退订，则需要先保存bind生成的函数，才可以在后续进行退订。
 *
 *   这样每次订阅均需要进行保存，编程体验并不好，我们需要更加方便优雅的订阅和退订方式，并且能正确保持this的指向。
 *
 *   EventEmitterProxy就是用来简化解决此类问题的
 *
 *   使用方式如下：
 *
 *      1. 创建全局事件总线代理
 *      this.globalEventbus = new EventEmitterProxy(this,VoerkaEventbus)
 *
 *      2. 订阅 ---> 订阅后 onMessage的this正确地指定当前类实例
 *      this.eventbus.on(event,this.onMessage)
 *      通过EventEmitterProxy后，会自动进行保存绑定后的函数，并确保this指向正确
 *      3. 退订  ---> 正确取消订阅
 *      this.eventbus.off(event,this.onMessage)
 *
 *     经过代理进行订阅的callback默认均绑定this
 *     如果我们在订阅时，不想改变callback的this，可以使用unbind对callback进行封装
 *     this.eventbus.on(event,unbind(onMessage))
 *     此时onMessage会保持原有的行为
 *     如果我们想在订阅时，指定callback的this，则可以
 *     this.eventbus.on(event,bind(onMessage,context))
 *     此时，onMessage的this会指向context
 *     并且在退订时，只需要this.eventbus.off(event,onMessage)即可
 *
 *    如果，明确一个订阅是不需要退订的，则建议使用forever进行包装
 *    this.eventbus.on(event,forever(onMessage))
 *    this.eventbus.on(event,forever(onMessage,context))  额外指定context
 *    为什么需要使用forever？上面说过，EventEmitterProxy事实上是帮我们自动保存订阅过的函数的引用
 *    如果一个订阅永远不需要退订，也就没有必须进行保存，forever的作业就是告诉EventEmitterProxy这个订阅不需要保存
 *
 */

import type { EventEmitter  } from './eventEmitter'

/**
 * 标记一个方法不需要指定上下文，保持原有的上下文
 */
export function unbind(callback:Function):Function{
    (callback as any).$$CONTEXT = false
    return callback
}


/**
 *
 * 为一个函数指定一个上下文对象
 *
 */
export function bind(callback:Function,context:any):Function{
    (callback as any).$$CONTEXT =new WeakRef(context)
    return callback
}

 
/**
 * 标记一个方法，代表方法永远不会取消订阅
 *
 */
export function forever(callback:Function,context:any):Function{
    (callback as any).$$FOREVER = true
    if(context!==undefined) (callback as any).$$CONTEXT =new WeakRef(context)
    return callback
}

export interface EventEmitterProxyOptions{
    scope?:any,                    // 为该事件代理指定作用域，即在事件名称前缀
    delimiter?:string                // 使用此分隔符在名称空间与事件名之间进行分离
}
export type EventEmitterProxyListeners =Record<string,Record<string,Function[]>>


export class EventEmitterProxy {
    #options:Required<EventEmitterProxyOptions>
    #context:any
    #eventEmitter:EventEmitter
    #listeners:EventEmitterProxyListeners
    constructor(context:any,eventemitter:EventEmitter,options:EventEmitterProxyOptions={}) {
        this.#options = Object.assign({
            scope:null,                             
            delimiter:"/"
        },options) as Required<EventEmitterProxyOptions>
        this.#context = new WeakRef(context)
        this.#listeners = {}                // {event:{listenerId:{},...},....}
        this.#eventEmitter = eventemitter
    }
    get scope(){return this.#options.scope}
    get options(){return this.#options}
    get context(){return this.#context.deref() }
    get eventemitter(){ return this.#eventEmitter }
    get listeners(){return this.#listeners}

    private _pushListener(event:string,listenerId:string,listener:Function){
        if(!(event in this.#listeners)){
            this.#listeners[event]={}
        }
        if(!(listenerId in this.#listeners[event])){
            this.#listeners[event][listenerId] = []
        }
        this.#listeners[event][listenerId].push(listener)
    }
    private _popListener(event:string,listenerId:string,defaultListener:Function):Function | undefined{
        let result:Function | undefined = defaultListener
        if(event in this.#listeners){
            if(listenerId in this.#listeners[event]){
                result = this.#listeners[event][listenerId].pop()
                if(this.#listeners[event][listenerId].length===0) delete this.#listeners[event][listenerId]
            }
            if(Object.keys(this.#listeners[event]).length===0) delete this.#listeners[event]
        }
        return result
    }

    emit(){
        const [event,...args] = arguments
        return this.#eventEmitter.emit(this._getScopedEvent(event),...args)
    }

    emitAsync(){
        const [event,...args] = arguments
        return this.#eventEmitter.emitAsync(this._getScopedEvent(event),...args)
    }
    /**
     * 当事件名称不包括分割时并且指定了scope时，自动添加前缀
     * @param {*} event 
     * @returns 
     */
    _getScopedEvent(event:string){
        if(event.includes(this.options.delimiter)){
            return event
        }else{
            return this.scope ? `${this.scope}${this.options.delimiter}${event}` : event
        }
    } 
    /**
     *  on(event,listener)
     *  on(event,forever(listener))               订阅后永远不会退订，这样就不需要保存绑定后的函数，可以节约一些开消，但是this也会绑定正确
     *  on(event,unbind(listener))                不进行绑定处理，保持原始函数的this。
     *  on(event,bind(listener,context))          将listener绑定到context。
     *  默认情况下，将listener的的this指向 this.obj
     *  如果listener.$$CONTEXT===false，则不进行绑定
     *  如果typeof(listener.$$CONTEXT)==="object"，则将之绑定到listener.$$CONTEXT
     *
     */
    on(){
        let [event,listener,options={objectify:true}] =  arguments
        const listenerContext = listener.$$CONTEXT
        const scopeEvent = this._getScopedEvent(event)
        if(!(listenerContext===false)) {
            // 重点！重点！重点！  每个函数均支持一个getHashId来生成唯一标识
            const listenerHashId = listener.getHashId()
            listener = (listenerContext instanceof WeakRef) ? listener.bind(listenerContext.deref()) : listener.bind(this.context)
            // 如果指定了$$FOREVER,代表需要永久订阅，也就是不需要进行退订，这样就不需要保存对订阅函数的引用
            if(!(listener.$$FOREVER===true)) {
                this._pushListener(event,listenerHashId,listener)
            }
        }
        delete listener.$$FOREVER
        delete listener.$$CONTEXT
        return this.#eventEmitter.on(scopeEvent,listener,options)
    }
    /**
     *  off(event,listener)                 退订目标对象上的事件
     *   off(event)                         退订所有事件
     */
    off(){
        let [event,listener] = arguments
        const scopeEvent = this._getScopedEvent(event)
        if(typeof(listener)=='function'){
            const bindedListener = this._popListener(event,listener.getHashId(),listener)
            delete listener.$$FOREVER
            delete listener.$$CONTEXT
            if(bindedListener) return this.#eventEmitter.off(scopeEvent,bindedListener)
        }else{//如果没有指定listener，则代表要退订该事件的所有订阅            
            // 1. 退订事件
            this.#eventEmitter.removeAllListeners(scopeEvent)
            // 2. 清除保存的订阅数据
            // 如果event参数包括通配符，则需要对保存的订阅进行匹配后清除，如event="a/*"，则所有a/xxx的事件均要清除
            if(event.includes(this.delimiter)){
                let spEvents = event.split(this.delimiter)
                // 过滤出匹配的事件名称
                let matchedEvents = Object.keys(this.#listeners).map(ev=>ev.split(this.delimiter))
                        .filter(evs=>{
                            spEvents.forEach((v,i)=>{
                                if(v==this.delimiter) evs[i] = this.delimiter
                            })
                            return evs.length==spEvents.length && evs.join()===event
                        })
                
                matchedEvents.forEach(e=>delete this.#listeners[e])
            }else{
                delete this.#listeners[event]           // 清除保存的事件订阅者引用
            }
        }        
    }

    /**
     * 
     * 退订当前代理的所有事件订阅
     * 
     * offAll()                 // {event:{listenerId:[],...},....}
     * 为什么不用this._eventemitter.removeAllListeners()?
     * 原因是本类仅仅是代理类，有可能一个eventemitter会存在多个代理类，有众多的订阅来自其他地方
     * 如果简单粗暴地removeAllListeners就可能会误伤一大片
     *
     * 比如VoerkaEventbus，
     *
     * 在A类中创建了一个aproxy = EventEmitterProxy(a,VoerkaEventbus)
     * 在B类中创建了一个bproxy =EventEmitterProxy(b,VoerkaEventbus)
     *
     * 当调用aproxy.offAll()应该是仅仅退订A实例在VoerkaEventbus中的所有订阅，而不是将VoerkaEventbus中所有的订阅全部取消
     *
     * 当然，这个offAll不会退订永远订阅的事件,因为其根本没有保存
     */
    offAll(){
        for(let [event,eventListeners] of Object.entries(this.listeners)){
            for(let listeners of Object.values(eventListeners)){
                listeners.forEach(listener=>this.#eventEmitter.removeListener(this._getScopedEvent(event),listener))
            }
        }
        this.#listeners = {}
    }
  
    /**
     * once(event,callback)
     * once(event,unbind(callback))
     * once(event,bind(callback,context))
     *
     */
    once(){
        let [event,listener,...args] =  arguments
        const listenerContext = listener.$$CONTEXT
        const scopeEvent = this._getScopedEvent(event)
        if(!(listenerContext===false)) {
            listener =  (listenerContext instanceof WeakRef) ? listener.bind(listenerContext.deref()) : listener.bind(this.context)
        }
        delete listener.$$FOREVER
        delete listener.$$CONTEXT
        return this.#eventEmitter.once(scopeEvent,listener,...args)
    }
    waitFor(){
        let [event,...args] =  arguments
        const scopeEvent = this._getScopedEvent(event)
        return this.#eventEmitter.waitFor(scopeEvent,...args)
    }

}
