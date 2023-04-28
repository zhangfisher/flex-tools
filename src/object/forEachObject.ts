/**
 * 
 * 深度遍历对象成员
 * 
 * 遍历过程中可以通过在在callback中返回ABORT来中止遍历
 */
import { Collection } from "../types"
import type { IForEachCallback } from "./forEachUpdateObject"
import { ObjectIteratorOptions,objectIterator } from "./objectIterator"
export { ABORT } from "../consts"
import { ABORT } from "../consts"

export type ForEachObjectOptions = ObjectIteratorOptions

export function forEachObject(obj:Collection,callback:IForEachCallback,options?:ForEachObjectOptions){
    if(typeof callback!=="function") throw new TypeError()
    const iterator = objectIterator(obj,options)
    for(const item of iterator){
        if(callback(item)==ABORT) break 
    }
} 


    // let { keys,onlyPrimitive,circularRef } = assignObject({
    //     keys:[], 
    //     onlyPrimitive:true,   
    //     circularRef:'skip'
    // },options) as Required<ForEachObjectOptions>

    // const stack:any[] = [obj]
    // const parents:Node[] = []
    // const keyOrIndexs:(number | string | symbol)[]=[]
    // let count:number = 0
    // // 记录遍历走过的对象引用
    // let stepObjects:Set<any>
    // if(circularRef!='no-check') stepObjects = new Set()
    // while (stack.length > 0) {
    //     const item = stack.pop() as any
    //     let parent = parents.pop()   
    //     let keyOrIndex = keyOrIndexs.pop() 
    //     if(isCollection(item)){
    //         let hasCircularRef = false  // 存在循环引用
    //         if(circularRef!='no-check'){
    //             if(stepObjects!.has(item)){   // 存在循环引用
    //                 if(circularRef=='error') throw new CircularRefError()      
    //                 hasCircularRef=true              
    //             }
    //             stepObjects!.add(item)
    //         }        
    //         if(!hasCircularRef){
    //             const items ='entries' in item ?  [...item.entries()] : Object.entries(item)                
    //             for (let i = items.length - 1; i >= 0; i--) {
    //                 const [k,v] = items[i]
    //                 stack.push(v); 
    //                 parents.push(item) 
    //                 keyOrIndexs.push(k) 
    //             } 
    //         }            
    //     }  
    //     count++      
    //     // 如果不是原始类型，跳过        
    //     if(onlyPrimitive && !isPrimitive(item)) continue
    //     // 不对根元素执行callback， 或者只对指定的key执行callback
    //     if(count==1 || (keys && keys.length>0 && !keys.includes(String(keyOrIndex)))) continue
    //     if (callback({ value:item,parent,keyOrIndex }) === ABORT) {
    //         break
    //     }      
    // }  
