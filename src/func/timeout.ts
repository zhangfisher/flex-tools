
import type { AsyncFunction } from "../types";
 

export class TimeoutError extends Error {
    constructor(){
        super('TIMEOUT')
    }
}

/**
 * 包装异步函数，使之具备超时能力,当超时时会触发TIMEOUT错误
 * 当执行超过times时会触发异常
 * @param fn
 * @param options {value:<超时值>,default:<超时返回的均默认值>}
 * @return {function(): unknown}
 */
 export function timeout(fn:AsyncFunction, options:{value?:number,default?:any}={}):AsyncFunction{    
    if(options.value===0) return fn
    return async function(this:any){
        return new Promise(async (resolve,reject)=>{
            let result
            let timerId = setTimeout(()=>{
                if(options.default==undefined){
                    reject(new TimeoutError())
                }else{
                    resolve(options.default)
                }
            },options.value)
            try{
                result = await fn.call(this,...arguments) 
                resolve(result)
            }catch(e){
                if(options.default==undefined){
                    reject(new TimeoutError())
                }else{
                    resolve(options.default)
                }
            }finally{
                clearTimeout(timerId) 
            } 
        })
    }
}

