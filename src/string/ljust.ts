declare global {
    interface String {
        ljust(width:number,fillChar?:string):string
    }
}

//输出width个字符，S左对齐，不足部分用fillChar填充，默认使用空格填充。
export function ljust(str:string,width:number,fillChar=" ") {
    return str + new Array(width-str.length).join(fillChar)
} 

String.prototype.ljust= function (this:string,width:number,fillChar:string=" ") {
    return ljust(this,width,fillChar)
}