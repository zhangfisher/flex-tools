/**
 * 判断对象是否为集合:
 *   Array,Set,Map,{}
 * 
 */

import { isPlainObject } from "./isPlainObject"


export function isCollection(value:any):boolean{
    if(!value) return false
    if(Array.isArray(value)) return true
    if(value instanceof Set) return true
    if(value instanceof Map) return true
    if(isPlainObject(value)) return true 
    return false
}