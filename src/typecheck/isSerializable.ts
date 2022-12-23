import { isPlainObject } from "./isPlainObject";

/**
 * 判断一个对象是否可以序列化
 * 该方法会遍历对象的所有成员，如果遇到不可序列化的成员，则返回false
 * @param {*} params 
 */
export function isSerializable(value:any):boolean {
    const typeName = typeof value;
    if( value === 'undefined' ||
        value === null ||
        typeName === 'string' ||
        typeName === 'boolean' ||
        typeName=== 'number' ) {
            return true;
        }
    if(typeName.includes("function")) return false
    if(Array.isArray(value)){
        if(value.some(item=>!isSerializable(item))) return false 
    }else if(isPlainObject(value)){
        if(Object.values(value).some(item=>!isSerializable(item))) return false
    }
    return true
}
