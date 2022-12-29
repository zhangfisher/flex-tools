/**
 *  判断是否是异步函数
 */
export function isAsyncFunction(fn:any):boolean{
    return (typeof(fn)=="function" && '$$isAsync' in fn)         // 自定义的标识
        || Object.prototype.toString.call(fn) === '[object AsyncFunction]'
        || fn.constructor.name === 'AsyncFunction'
}

