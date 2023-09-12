import { assignObject } from './assignObject';
/**
 * 
 * 监视对象变化
 * 
 * 
 */


export type objectOperation = 'add' | 'update' | 'remove'

export interface ObjectWatcherOptions{
    on: objectOperation | objectOperation[]
}

export interface ObjectWatcherModifyParams{
    propKey:string | symbol,
    value:any,
    oldValue?:any,
    operate?:objectOperation,    
    parent?:object
}

export type ObjectModifyObserver = (params:ObjectWatcherModifyParams)=>void

export function objectWatcher<T extends object=object>(obj:T,callback:ObjectModifyObserver,options?:ObjectWatcherOptions){
    const opts = assignObject({
        on:['get','set','delete']
    },options)
    const listener = callback
    if(typeof(callback)!=='function') throw new Error("callback must be a function")
    return new Proxy(obj,{
        get(target, propKey:any, receiver) {
            let v =Reflect.get(target,propKey,receiver) 
            return v
        },
        set(target,propKey:any, newValue, receiver) {  
            if(!Object.hasOwnProperty(propKey)){
                const isExisted = Reflect.has(target,propKey)
                const operate = isExisted ? 'update' : 'add'
                const eventArgs:ObjectWatcherModifyParams ={
                    propKey,
                    value:newValue, 
                    operate,
                    parent:target 
                }   
                if(opts.on.includes("on")){ 
                    eventArgs.oldValue = Reflect.get(target,propKey,receiver)
                }
                listener.call(target,eventArgs)
            }else if(propKey=='length'){        // 长度变化时一般是删除了某个值
                
            }
            return Reflect.set(target,propKey,newValue,receiver)
        },
        deleteProperty(target, propKey) {
            if(opts.on.includes('remove')) {
                const oldValue = Reflect.get(target,propKey)
                listener.call(target,{
                    propKey,
                    value:oldValue,
                    operate:'remove',
                    parent:target
                })
            }
            return Reflect.deleteProperty(target, propKey);
        },
    })
    
}


let l= objectWatcher( [1,2,3,4,5],({propKey,value,oldValue,operate})=>{
    console.log(`[${operate}]: `,propKey, ' --> ',value,oldValue ? oldValue : '')
})

l.push(6)
l[0] = 100
l.splice(1,1)
l.pop()
console.log(l)