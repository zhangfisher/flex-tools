export function canIterator(obj:any){
    return typeof(obj)=='object' && typeof obj[Symbol.iterator] === 'function'
}
