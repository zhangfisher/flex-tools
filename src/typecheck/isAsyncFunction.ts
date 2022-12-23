/**
 *  判断是否是异步函数
 */
export function isAsyncFunction(fn:any):boolean{
    return fn.$$isAsync || Object.prototype.toString.call(fn) === '[object AsyncFunction]'
            || fn.constructor.name === 'AsyncFunction'
}

