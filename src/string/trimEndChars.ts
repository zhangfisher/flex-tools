
declare global {
    interface String { 
        trimEndChars(chars: string,atEnd?:boolean): string  
    }
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
 export function trimEndChars(str:string,chars:string,atEnd:boolean=false){
    if(chars){
        let index =  str.lastIndexOf(chars)
        if((index+chars.length===str.length && atEnd) || (!atEnd && index!==-1)){
            return str.substring(0,index)
        }
    }
    return str.valueOf()
}

String.prototype.trimEndChars=function(this:string,chars:string,atEnd:boolean=false){
    return trimEndChars(this,chars,atEnd)
}
