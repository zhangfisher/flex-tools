import isEmpty from "lodash/isEmpty" 
import isBoolean from "lodash/isBoolean";
import { isNumber } from "./isNumber";
/**
 * 当
 * value= null || undefined || "" || [] || {} 时返回true
 *
 * @param value
 * @return {*}
 */

export function isNothing(value:any):boolean{
    if(isNumber(value) || isBoolean(value)) return false
    if(typeof(value)==="function") return false
    if(value instanceof Error) return false
    if(isEmpty(value)) return true 
    return false
}
