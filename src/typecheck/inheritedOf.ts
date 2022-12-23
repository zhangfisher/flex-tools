import type { Class } from "../types"

/**
 * 判断cls是否继承自baseClass
 * @param cls
 * @param baseClass
 * @returns {boolean}
 */
export function inheritedOf(cls: Class, baseClass:Class):boolean {
    if(cls===undefined) return false
    if(cls===baseClass) return true
    if(!("__proto__" in cls)) return false
    let parent:any = (cls as any).__proto__
    while(parent!=null){
        if(parent===baseClass || parent.name===baseClass.name){
            return true
        }
        parent = parent.__proto__
    }
    return false
}
