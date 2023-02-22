declare global {
    interface String { 
        trimBeginChars(chars: string,atBegin?:boolean): string 
    }
}


/**
 * 截断字符串前面的字符
 *
 *  "abc123xyz".trimBeginChars("abc") == "123xyz"
 *
 * @param chars
 * @returns {string}
 */
export function trimBeginChars(str:string,chars:string,atBeing:boolean=false){
    if(chars){
        let index =  str.indexOf(chars)
        if((atBeing && index===0) || (!atBeing && index!=-1)){
            return str.substring(chars.length)
        }
    }
    return str.valueOf()
}

String.prototype.trimBeginChars=function(this:string,chars:string,atBeing:boolean=false){
    return trimBeginChars(this,chars,atBeing)
}