import { isPlainObject } from '../typecheck/isPlainObject';
/**
 *  
 * 将srcObject中的值更新到targetObject
 * - targetObject中不存在的key
 * - targetObject中值为undefined
 * 
 * 要求两个对象结构一致
 * 
 * @param targetObject 
 * @param srcObject 
 * @returns 
 */
export function setObjectDefaultValue(targetObject:any,srcObject:any){
    if(isPlainObject(srcObject)) return
    if(isPlainObject(targetObject)) return
    Object.entries(srcObject).forEach(([key,value])=>{
        if(!(key in targetObject) || targetObject[key]==undefined){
            targetObject[key] = value
        }
    })
}