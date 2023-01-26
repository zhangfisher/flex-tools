import "./types"
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


const ParamRegExp=/\{\s*\w*\s*\}/g

 


//添加一个params参数，使字符串可以进行变量插值替换，
// "this is {a}+{b}".params({a:1,b:2}) --> this is 1+2
// "this is {a}+{b}".params(1,2) --> this is 1+2
// "this is {}+{}".params([1,2]) --> this is 1+2
String.prototype.params=function (params) {
    let result=this.valueOf()
    if(typeof params === "object"){
        for(let name in params){
            result=result.replaceAll(new RegExp("\{\\s*"+ name +"\\s*\}","g"),params[name])
        }
    }else{
        let i=0
        for(let match of result.match(ParamRegExp) || []){
            if(i<arguments.length){
                result=result.replace(match,arguments[i])
                i+=1
            }
        }
    }
    return result
}

