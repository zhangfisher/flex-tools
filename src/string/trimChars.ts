
/**
 * 移除字符串前后的字符
 * 
 * trimChars(" hello world  ") => "hello world"
 * trimChars(" \nhello world\n ") => "hello world"
 * 
 * @param {*} str 
 * @param {*} chars 
 * @returns 
 */
export function trimChars(str:string,chars:string=`"'`){
    let start = 0
    let end = str.length
    const arrChars = chars.split('')
    while(start<end && arrChars.includes(str[start])){
        start++
    }
    while(end>start && arrChars.includes(str[end-1])){
        end--
    }
    return str.substring(start,end) 
}

String.prototype.trimChars=function(this:string,chars:string){
    return trimChars(this,chars)
}

declare global {
    interface String { 
        trimChars(chars: string): string 
    }
}