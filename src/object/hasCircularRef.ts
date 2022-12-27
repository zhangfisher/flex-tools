/**
 * 检查一个对象是否存在循环引用
 */

export function hasCircularRef(obj:object):boolean {
    try{
        JSON.stringify(obj)
    }catch(e:any){
        if(e.message.includes("circular")){
            return true
        }
    }
    return false
 }



