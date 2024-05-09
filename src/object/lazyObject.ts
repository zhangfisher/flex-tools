/**
 * 创建一个代理对象
 * 
 * const proxy = lazyObject(()=>{
 *    return obj
 * })
 * 
 * 该代理对象会在第一次访问时调用回调函数，然后将回调函数的返回值作为代理对象
 * 后续就不再进行调用
 * 
 */


export function lazyObject<T extends object>(fn:()=>T){
    let obj:T
    const r =  new Proxy<T>({} as T,{
        get(target,key,receiver){
            if(!obj){
                obj = fn() 
            }
            return  Reflect.get(obj,key)
        },
        set(target,key,value,receiver){
            if(!obj){
                obj = fn()    
            }
            return Reflect.set(obj,key,value)
        }
    })
    return r
}

// let obj = lazyObject(()=>{
//     return {a:1,b:2}
// })

// console.log(obj.a) 

// console.log(obj.a) 
