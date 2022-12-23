import { ABORT, forEachObject, ForEachObjectOptions } from "./forEachObject"
import type { IForEachCallback } from "./forEachUpdateObject"

  
/**
 * 发现满足条件的对象成员
 * 
 * 遍历对象，对每一个成员调用matcher({value,keyOrIndex,parent})，
 * 
 * 如果matcher返回true，则返回picker({value,keyOrIndex,parent})
 * 
 * searchObject({
 *      a:1，
 *      b:{x:1,y:2}
 * },({value,keyOrIndex,parent})=>{
 *      return value==2
 * },({value,keyOrIndex,parent})=>{
 *      return keyOrIndex            // 当值=1时返回y
 *      return value                 // 当值=1时返回{x:1,y:2}
 * })
 * 
 
* 
* @param obj 
* @param callback 
* @param matchOne  仅匹配一个
*/
export type SearchObjectOptions = ForEachObjectOptions & {
    matchOne?:boolean
}
export function searchObject<T=any>(obj:any[] | object,matcher:IForEachCallback,picker?:IForEachCallback,options?:SearchObjectOptions):T | T[]{
    let result:T[] = []
    let opts =  Object.assign({matchOne:true},options || {}) as Required<SearchObjectOptions>
    const pickerFunc = (picker || (({value})=>value)) as IForEachCallback
    forEachObject(obj,({value,keyOrIndex,parent})=>{
        if(matcher({value,keyOrIndex,parent})){
            result.push(pickerFunc({value,keyOrIndex,parent}))
            return opts.matchOne ? ABORT : undefined
        }
    },opts)
    return opts.matchOne ? result[0] : result
}
