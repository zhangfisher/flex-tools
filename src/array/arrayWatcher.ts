import { assignObject } from '../object/assignObject';
/**
 * 
 * 监视对象变化
 * 
 * 
 */


export type ArrayOperation = 'add' | 'update' | 'remove'

export interface ObjectWatcherOptions{
    on: ArrayOperation | ArrayOperation[]
}

export interface ObjectWatcherModifyParams{
    propKey:string | symbol,
    value:any,
    oldValue?:any,
    operate?:ArrayOperation,    
    parent?:object
}

export type ArrayWatcherObserver = (params:ObjectWatcherModifyParams)=>void

export function arrayWatcher<T extends object=object>(obj:T,callback:ArrayWatcherObserver,options?:ObjectWatcherOptions){
    const opts = assignObject({
        on:['get','set','delete']
    },options)
    const listener = callback
    if(typeof(callback)!=='function') throw new Error("callback must be a function")
    return new Proxy(obj,{
        set(target,propKey:any, newValue, receiver) {  
            const oldValue = Reflect.get(target,propKey,receiver) 
            const result = Reflect.set(target,propKey,newValue,receiver)
            if(!Object.hasOwnProperty(propKey)){
                const isExisted = Reflect.has(target,propKey)
                if(isExisted){                    
                    listener.call(target,{
                        propKey,
                        value:newValue,
                        oldValue,
                        operate:'update',
                        parent:target
                    })
                }else{
                    listener.call(target,{
                        propKey,
                        value:newValue,
                        operate:'add',
                        parent:target
                    })
                }   
            }else if(propKey=='length'){        // 长度变化时一般是删除了某个值
                const oldLength = Reflect.get(target,propKey,receiver) 
                const newLength = parseInt(newValue)
                if(oldLength>newLength){
                    listener.call(target,{
                        propKey,
                        value:newLength,
                        operate:'remove',
                        parent:target
                    })
                }else if(oldLength<newLength){
                    listener.call(target,{
                        propKey, 
                        value:newLength,
                        operate:'add',
                        parent:target
                    })
                }
            }
            
            return result
        }
    })
    
}


let l= arrayWatcher( [1,2,3,4,5],({propKey,value,oldValue,operate})=>{
    console.log(`[${operate}]: `,propKey, ' --> ',value,oldValue ? oldValue : '')
})

l.push(6)
l[0] = 100
l.splice(1,1)
l.pop()
console.log(l)