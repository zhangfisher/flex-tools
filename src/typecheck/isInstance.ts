/**
 * 
 * 判断值是否是某个类的实例
 * 
 * @param obj 
 * @returns 
 * 
 * 
 */
export function isInstance(obj:any):boolean{
    if(!(typeof(obj)=='object')) return false
    try{
        return obj.constructor.toString().startsWith('class')
    }catch{
        return false
    }    
}