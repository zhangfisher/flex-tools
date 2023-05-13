// 判断对象是否是一个类
export function isClass(cls:any):boolean{
    let result = false
    if (typeof(cls) === 'function' && cls.prototype) {
        try {
            cls.arguments && cls.caller;
        } catch(e) {
            result=true
        }
    }
    return result;
}
