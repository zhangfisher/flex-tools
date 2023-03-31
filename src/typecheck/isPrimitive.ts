/**
 * 判断值是否是一个原始值类型
 * @param {*} value 
 * @returns 
 */
 export function isPrimitive(value:any):boolean {
    if(
        value==undefined 
        || value==null
        || typeof(value)=='string'
        || typeof(value)=='number'
        || typeof(value)=='boolean'
        || typeof(value)=='symbol'
        || typeof(value)=='bigint'        
    ) return true
    return false
}
