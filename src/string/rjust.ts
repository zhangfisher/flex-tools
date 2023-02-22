declare global {
    interface String { 
        rjust(width:number,fillChar?:string):string 
    }
}

//输出width个字符，S右对齐，不足部分用fillChar填充，默认使用空格填充。
export function rjust(str:string,width:number,fillChar=" ") {
    return new Array(width-str.length).join(fillChar)+str
}

//输出width个字符，S右对齐，不足部分用fillChar填充，默认使用空格填充。
String.prototype.rjust=function (this:string,width:number,fillChar=" ") {
    return rjust(this,width,fillChar)
}
