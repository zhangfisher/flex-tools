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