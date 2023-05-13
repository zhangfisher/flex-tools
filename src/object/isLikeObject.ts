/**
 * 
 * 判断两个对象是否相似
 * 
 * 注意：
 * - 不进行值比较，只比较对象的键是否相同
 * - 严格比较，两个对象的键的数量和名称必须相同
 * - 非严格比较，srcObj的键的数量可以大小等于targetObj的键的数量
 * 
 * isLikeObject({a:1,b:2},{a:1,b:2}) // true
 * isLikeObject({a:1,b:2},{a:1,b:3}) // true
 * isLikeObject({a:1,b:2},{a:1}) // true
 * isLikeObject({a:1,b:2},{a:1}，{strict:true})    // true 严格比较
 *  isLikeObject({a:1,b:2},{a:1}，{strict:false})    // false 非严格比较
 * 
 */

import { assignObject } from "./assignObject";

export interface IsLikeObjectOptions{
    strict?:boolean                 // 是否严格比较
    deep?:boolean                   // 是否深度比较, 对象的值为对象时，是否递归比较
}


export function isLikeObject(obj:Record<string | number | symbol,any>,baseObj:Record<string |number | symbol,any>,options?:IsLikeObjectOptions):boolean{
    const {strict = false,deep = false} = assignObject({},options);
    if(obj === baseObj) return true;
    if(typeof(obj) !== "object" || typeof(baseObj) !== "object") return false;
    const srcKeys = Object.keys(obj);
    const baseKeys = Object.keys(baseObj);
    if(strict && srcKeys.length !== baseKeys.length) return false;
    let isLike = true
    for(const key of baseKeys){
        if(key in obj){
            if(deep && typeof(obj[key]) === "object" && typeof(baseObj[key]) === "object"){
                isLike = isLikeObject(obj[key],baseObj[key],options)
            }
            // 已经比较过的键，从srcKeys中删除
            srcKeys.splice(srcKeys.indexOf(key),1)
        }else{
            return false;
        }
    }
    // 如果srcKeys中还有剩余的键，说明srcObj的键的数量大于targetObj的键的数量
    // 则在严格比较时，返回false,在非严格比较时，返回true
    if(srcKeys.length>0 && strict) return false;
    return isLike
}