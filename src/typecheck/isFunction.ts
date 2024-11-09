export function isFunction(fn:any):fn is Function{
    return fn && typeof(fn)=="function"
}