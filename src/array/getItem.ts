/**
 * 
 * 取得数组的第index个元素
 * 
 * - 支持负数索引，如-1表示倒数第一个元素
 * - 如果index超出数组范围，返回undefined
 * 
 * @param arr 
 * @param index 
 */


export function getItem<T=any>(arr:Array<T>,index:number,defaultValue?:T | undefined):T | undefined{    
    const r = index>=0?arr[index]:arr[arr.length+index]
    if(r===undefined){
        return defaultValue
    }
    return r
}
 
