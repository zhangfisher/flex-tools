/**
 *  判断是否是异步函数
 */
export function isAsyncFunction(fn:any):fn is (...args:any[])=>Promise<any>{
    return  typeof(fn)=="function" && (
        fn.$$isAsync         // 自定义的标识
        || Object.prototype.toString.call(fn) === '[object AsyncFunction]'
        || (fn.constructor && fn.constructor.name === 'AsyncFunction')
    )
}

