import { delay } from "../async/delay"
import type { AsyncFunction} from "../types"
/**
 *  重试执行
 *   当执行fn出错(throw new Error)时尝试重试执行
 *   如果fn throw的错误类名是以Signal结尾的除外
 *   特殊情况：
 *   触发以Signal结尾的错误对象代表了传递某种信号，而不是真正的错误，因此不需要重试执行
 *   之所以有这样的考虑，是因为在些场合，我们约定当函数执行时可以通过throw new XXXSignal的方式来向上传递信号，不被视为错误
 * 
 *
 * @param fn
 * @param options
 */
 export function retry(this:any,fn: Function, options:{count?:number,interval?:number,default?:any}):AsyncFunction{
    return async function(this:any){
        let {count=1,interval=1000,default:defaultValue} = options
        let error
        for(let i=0;i<count+1;i++){
            try{
                return await fn.apply(this,arguments)
            }catch (e:any) {
                // 如果函数触发一个以Signal结尾的错误，则代表这不是一个一错误，而是一个向上传递的信号，不需要再进行重试
                if(e.constructor.name.endsWith("Signal")){
                    throw e
                }else{
                    error = e
                }
            }
            // 最后一次执行时不需要延时,如果执行没有错误也不需要执行
            if((i<count && interval>0 && error) || !error ) {
                await delay(interval)
            }
        }
        if(defaultValue==undefined && error){
            throw error
        }else{
            return defaultValue
        }
    }
}