import { isPlainObject } from './isPlainObject';
/**
 * 
 * 判断是否为 Map 对象
 * 
 * 
 * 
 */




export function isLikeMap(obj:object):boolean{
    return isPlainObject(obj) || obj instanceof Map || Object.prototype.toString.call(obj) === '[object Map]' || obj instanceof WeakMap || Object.prototype.toString.call(obj) === '[object WeakMap]'
}