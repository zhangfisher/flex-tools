 

declare global {
    interface String {
        center(width: number, fillChar?: string): string; 
    }
}

//输出width个字符，S居中，不足部分用fillChar填充，默认使用空格填充。
export const center = function(str:string,width:number,fillChar=" ") {
    let s=str
    let llength=Math.floor((width-s.length)/2)
    return new Array(llength).join(fillChar)+s+new Array(width-s.length-llength).join(fillChar)
}

String.prototype.center = function (this:string,width:number,fillChar=" ") {
    return center(this,width,fillChar)
}