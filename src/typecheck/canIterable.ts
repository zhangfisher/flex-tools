/**
 * 判断指定对象是否可以迭代
 */
export function canIterable(obj:any):boolean{
    return obj != null && typeof obj[Symbol.iterator] === 'function' && typeof obj !== 'string'
}
