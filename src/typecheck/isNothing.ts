import { canIterable } from "./canIterable";
import { isNumber } from "./isNumber";
import { isPlainObject } from "./isPlainObject";
/**
 * 当
 * value= null || undefined || "" || [] || {} 时返回true
 *
 * @param value
 * @return {*}
 */

export function isNothing(value:any):boolean{
    if(isNumber(value) || typeof(value)=='boolean') return false
    if(typeof(value)==="function") return false
    if(value instanceof Error) return false
    if(value==undefined || value==null) return true 
    if(Array.isArray(value) && value.length==0) return true 
    if(isPlainObject(value) && Object.keys(value).length==0) return true 
    if(typeof(value)=="string" && value.trim()=="") return true
    try{
        if(canIterable(value) && value.size==0) return true
    }catch{}
    return false
}
