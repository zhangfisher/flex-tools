import { isPlainObject } from '../typecheck/isPlainObject';
/**
 *  
 * 将srcObject中的值更新到targetObject
 * - targetObject中不存在的key
 * - targetObject中值为undefined
 * 
 * 要求两个对象结构一致
 * 
 * @param target 
 * @param src 
 * @returns 
 */
export function setObjectDefaultValue(target:any,src:any){
    if(isPlainObject(src)) return
    if(isPlainObject(target)) return
    Object.entries(src).forEach(([key,value])=>{
        if(!(key in target) || target[key]==undefined){
            target[key] = value
        }
    })
}