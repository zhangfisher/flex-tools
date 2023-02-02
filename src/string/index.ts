import { replaceVars } from "./replaceVars";

export type StringInterpolationVars = string | number| number | boolean | Date | Error | null | undefined | Function

declare global {
    interface String {
        params(params: Record<string, any>): string;
        params(...args: any[]): string;
        params(args: any[]): string;
        rjust(width:number,fillChar:string):string
        ljust(width:number,fillChar:string):string
        firstUpper(): string;
        center(width: number, fillChar?: string): string;
        trimBeginChars(chars: string,atBegin?:boolean): string
        trimEndChars(chars: string,atEnd?:boolean): string 
    }
}
  
/**
 * 首字母大写
 * @constructor
 */
 String.prototype.firstUpper=function () {
    return this.charAt(0).toUpperCase()+this.substring(1)
}
//输出width个字符，S左对齐，不足部分用fillChar填充，默认使用空格填充。
String.prototype.ljust=function (width,fillChar=" ") {
    let s=this
    return s+new Array(width-s.length).join(fillChar)
}
//输出width个字符，S右对齐，不足部分用fillChar填充，默认使用空格填充。
String.prototype.rjust=function (width,fillChar=" ") {
    let s=this
    return new Array(width-s.length).join(fillChar)+s
}
//输出width个字符，S居中，不足部分用fillChar填充，默认使用空格填充。
String.prototype.center=function (width:number,fillChar=" ") {
    let s=this
    let llength=Math.floor((width-s.length)/2)
    return new Array(llength).join(fillChar)+s+new Array(width-s.length-llength).join(fillChar)
}
/**
 * 截断字符串前面的字符
 *
 *  "abc123xyz".trimBeginChars("abc") == "123xyz"
 *
 * @param chars
 * @returns {string}
 */
String.prototype.trimBeginChars=function(chars:string,atBeing:boolean=false){
    if(chars){
        let index =  this.indexOf(chars)
        if((atBeing && index===0) || (!atBeing && index!=-1)){
            return this.substring(chars.length)
        }
    }
    return this.valueOf()
}
/**
 * 截断字符串未尾的字符
 *
 * "abc123xyz".trimEndChars("xyz") == "abc123"
 *
 *
 * @param chars
 * @returns {string}
 */
String.prototype.trimEndChars=function(chars:string,atEnd:boolean=false){
    if(chars){
        let index =  this.lastIndexOf(chars)
        if((index+chars.length===this.length && atEnd) || (!atEnd && index!==-1)){
            return this.substring(0,index)
        }
    }
    return this.valueOf()
}



/**
 * 
    添加一个params参数，使字符串可以进行变量插值替换，

    基本用法：

    "this is {a}+{b}".params({a:1,b:2}) --> this is 1+2
    "this is {a}+{b}".params(1,2) --> this is 1+2
    "this is {}+{}".params([1,2]) --> this is 1+2

    
    字符
    
    当插值中包含非字符时会原样保留原始字符，例如：

    "this is {(a)}{[b]}".params({a:1,b:2}) --> this is (1)[2]
    "this is {a}{,b}".params({a:1,b:2}) --> this is 1,2
    
    处理undefined与null

    如果插件变量=undefined或null，则不输出插值占位
    "this is {(a)}{[b]}".params()  --> this is  

    如果插件变量是一个函数，则会执行

 * 
 */

export interface ParamsArgs{
    (this:string,...vars:any[]):string
    (this:string,vars:Record<string,any> | any[] | Set<any>):string
}




String.prototype.params = function (this:string,vars:Record<string,any> | any[] | Set<any>):string{
    let result=this.valueOf()
    let finalVars
    try{        
        if(arguments.length==1){
            finalVars = typeof arguments[0]=="object" ? arguments[0] : [arguments[0]]
        }else{
            finalVars = arguments
        }
        return replaceVars(this,vars)
        
    }catch{
        return result
    }
    
} as ParamsArgs

export * from "./replaceVars"