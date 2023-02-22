
declare global {
    interface String {
        firstUpper(): string;
    }
}

/**
 * 首字母大写
 * @constructor
 */
export function firstUpper(str:string) {
    return str.charAt(0).toUpperCase()+str.substring(1)
} 

String.prototype.firstUpper= function (this:string) {
    return firstUpper(this)
}
