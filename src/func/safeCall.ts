import { assignObject } from '../object/assignObject';
/**
 * 
 *   执行一个函数，并在出错时对错误进行捕获处理
 * 
 * 
 *   safeCall(fn,args)           // 出错时忽略并返回 undefined
 *   safeCall(fn,args,{catch:'ignore'})
 *   safeCall(fn,args,{catch:'ignore',default:0})
 *   safeCall(fn,args,{catch:'throw'})   // 出错时原样抛出错误
 *   safeCall(fn,args,(error)=>{})       // 调用函数并返回值
 *   
 */


export interface SafeCallOptions{
    // 出错时的处理方式:
    // ignore: 忽略错误，返回默认值
    // throw: 抛出错误
    catch?:'ignore'|'throw' 
    default?:any             // 出错时的默认返回值
    error?:Error             // 出错时并且catch为throw时，抛出的错误
}
export type SafeCallCatcher = (error:Error)=>any

export function safeCall(fn:Function,args?:any[]):any;
export function safeCall(fn:Function,options?:SafeCallOptions | SafeCallCatcher):any;
export function safeCall(fn:Function,args?:any[] | SafeCallOptions | SafeCallCatcher,options?:SafeCallOptions | SafeCallCatcher):any{
    let finalArgs:any[] = []
    let finalOptions:SafeCallOptions  = {}
    let catcher:SafeCallCatcher | undefined
    if(arguments.length==2){
        if(arguments[1] instanceof Array){
            finalArgs = arguments[1]
        }else{
            finalOptions = arguments[1] as SafeCallOptions 
        }
    }else if(arguments.length==3){
        finalArgs = arguments[1] || []
        finalOptions = arguments[2] || {}
    }
    if(typeof(finalOptions)=='function'){
        catcher = finalOptions
    }else{
        finalOptions = assignObject({
            catch:'ignore',
            default:undefined
        },finalOptions)
    } 
    try{
        const r = fn(...finalArgs)
        if(r instanceof Promise){            
            return new Promise<any>((resolve,reject)=>{
                r.then((v)=>{
                    resolve(v)
                }).catch((e:any)=>{
                    if(typeof(catcher)=='function'){
                        return resolve(catcher(e))
                    }
                    if(finalOptions.catch=='ignore'){
                        resolve(finalOptions.default)
                    }else if (finalOptions.catch=='throw'){
                        reject(finalOptions.error || e)
                    }
                })
            })
        }else{
            return r
        }
    }catch(error:any){
        if(typeof(catcher)=='function'){
            return catcher(error)
        }
        if(finalOptions.catch=='ignore'){
            return finalOptions.default
        }else if (finalOptions.catch=='throw'){
            throw finalOptions.error || error
        }
    }
}