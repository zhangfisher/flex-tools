/**
 * 返回原生对象，即普通的JSON，不是类或实例
 */
export function isJSONObject(obj:any):boolean{
    try{
        return typeof(obj) === "object" && obj.constructor === Object
    }catch(e){
        return false
    }
}