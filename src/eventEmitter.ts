/**
 * 
 * 一个简单的事件触发器
 * 
 */

 export interface EventEmitterOptions{
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误
 }

export class EventEmitter{
    #listeners:Map<string,[Function,number][]> = new Map()
    #options:EventEmitterOptions = {ignoreError:true,context:null}
    constructor(options:EventEmitterOptions = {ignoreError:true,context:null}){
        this.#options = Object.assign({ignoreError:true,context:null},options)
    }
    get options(){return this.#options}
    get context(){ return this.options.context}
    on(event:string,callback:Function){
        if(!this.#listeners.has(event)){
            this.#listeners.set(event,[])
        }
        this.#listeners.get(event)!.splice(0,0,[callback,-1])
    }
    once(event:string,callback:Function){
        if(!this.#listeners.has(event)){
            this.#listeners.set(event,[])
        }
        this.#listeners.get(event)!.splice(0,0,[callback,1])
    }    
    off(event:string,callback:Function){
        if(!this.#listeners.has(event)) return
        let listeners = this.#listeners.get(event) || []
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
    async wait(event:string){        
        return new Promise<void>((resolve)=>{
            this.once(event,()=>{
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