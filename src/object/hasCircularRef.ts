/**
 * 检查一个对象是否存在循环引用
 */

import { isPrimitive } from "../typecheck/isPrimitive"
import { ABORT, forEachObject } from "./forEachObject"

export function hasCircularRef(obj:object):boolean {
    let refs= new Set([obj])
    let isCircular=false
    forEachObject(obj,(value)=>{
        if(isPrimitive(value)) return 
        if(refs.has(value)) {
            isCircular=true
            return  ABORT
        }else{
            refs.add(value)
        }     
    },{onlyPrimitive:false})
    return isCircular
 }



