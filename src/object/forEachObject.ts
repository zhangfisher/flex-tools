/**
 * 
 * 深度遍历对象成员
 * 
 * 遍历过程中可以通过在在callback中返回ABORT来中止遍历
 */
import { canIterable } from "../typecheck"
import { isPlainObject } from "../typecheck/isPlainObject"
import { isPrimitive } from "../typecheck/isPrimitive"
import { assignObject } from "./assignObject"
import type { IForEachCallback } from "./forEachUpdateObject"

export const ABORT = Symbol('ABORT_FOR_EACH')

export interface ForEachObjectOptions{
    keys?:string[]                              // 限定只能指定的健执行callback
    skipObject?:boolean                          // 跳过对象
    skipArray?:boolean                           // 跳过数组
    onlyPrimitive?:boolean                      // 仅遍历原始类型，如string,number,boolean,symbol,null,undefined等
}

export function forEachObject(obj:object | any[],callback:IForEachCallback,options?:ForEachObjectOptions){
    let { keys,skipObject,skipArray,onlyPrimitive } = assignObject({
        keys:[],
        skipObject:false,           // 跳过对象
        skipArray:false,            // 跳过数组
        onlyPrimitive:false,        // 仅遍历原始类型，如string,number,boolean,symbol,null,undefined等
    },options) as Required<ForEachObjectOptions>

    const stack:any[] = [obj]
    const parents:Node[] = []
    const keyOrIndexs:(number | string | symbol)[]=[]

    while (stack.length > 0) {
        const item = stack.pop() as any
        let parent = parents.pop()   
        let keyOrIndex = keyOrIndexs.pop() 
        if(canIterable(item) || isPlainObject(item)){
            const items =  Object.entries(item)
            for (let i = items.length - 1; i >= 0; i--) {
                const [k,v] = items[i]
                stack.push(v); 
                parents.push(item) 
                keyOrIndexs.push(k)
            } 
        }       
        if(skipObject && isPlainObject(item)) continue
        if(skipArray && Array.isArray(item)) continue
        if(onlyPrimitive && !isPrimitive(item)) continue
        if(keys && keys.length>0 && !keys.includes(String(keyOrIndex))) continue
        if (callback({ value:item,parent,keyOrIndex }) === ABORT) {
            break
        }         
    } 
} 

// 递归算法实现
// export function forEachObject(obj:object | any[],callback:IForEachCallback,options?:ForEachObjectOptions){
//     let isAbort = false
//     let opts = assignObject({
//         keys:[]
//     },options || {}) as Required<ForEachObjectOptions>
//     function forEachItem({value,parent,keyOrIndex}:{value:any,parent?:any[] | object | null,keyOrIndex?:string | number | null}){
//         if(isAbort) return
//         if(Array.isArray(value) || isPlainObject(value)){
//             for(let [k,v] of Object.entries(value)){
//                 try{
//                     if(forEachItem({value:v,parent:value,keyOrIndex:k})== ABORT){
//                         isAbort = true
//                         break
//                     }
//                 }catch{}   // 忽略错误
//             }
//         }else{
//             if(opts.keys.length>0){
//                 if(opts.keys.includes(String(keyOrIndex))) {
//                     return callback({value,parent,keyOrIndex})            
//                 }
//             }else{
//                 return callback({value,parent,keyOrIndex})            
//             }
//         }
//     }
//     forEachItem({value:obj,parent:null,keyOrIndex:null})
// }