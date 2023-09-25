/**
 * 简单版本的字符串替换函数replaceAll
 * 
 * 在低版本时提供replaceAll 
 * 
 * @param str 
 * @param search 
 * @param replace 
 * @returns 
 */
 export function replaceAll(str:string,search:string | RegExp,replacer:string |  ((substring: string, ...args: any[]) => string)):string{    
    if(typeof(search) === "string"){
        let i=0,index:number
        while((index=str.indexOf(search,i)) > -1){
            const replaceValue = typeof(replacer)=='function' ? replacer(search) : replacer
            let oldLen = str.length
            str = str.substring(0,index) + replaceValue + str.substring(index+search.length)
            i = index + replaceValue.length + str.length - oldLen 
        }        
    }else{
        let m:RegExpExecArray | null
        if(!search.global || !search.multiline){
            throw new Error("The search parameter must be enabled '/gm' option")
        }
        while ((m = search.exec(str)) !== null) {
            // 这对于避免零宽度匹配的无限循环是必要的
            if (m.index === search.lastIndex) {
                search.lastIndex++;
            }     
            let oldLen = str.length
            let matchLen = m[0].length
            const replaceValue = typeof(replacer)=='function' ? replacer(m[0],...m) : replacer
            str = str.substring(0,m.index) + replaceValue + str.substring(m.index+matchLen)
            search.lastIndex += str.length - oldLen 
        }
    }
    return str
}

if(!String.prototype.replaceAll){
    String.prototype.replaceAll = function (this:string,search:string | RegExp,replacer:string |  ((substring: string, ...args: any[]) => string)):string{    
        return replaceAll(this,search,replacer)
    }
}


declare global {    
    interface String {
        /**
         * Replace all instances of a substring in a string, using a regular expression or search string.
         * @param searchValue A string to search for.
         * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
         */
        replaceAll(searchValue: string | RegExp, replaceValue: string): string;

        /**
         * Replace all instances of a substring in a string, using a regular expression or search string.
         * @param searchValue A string to search for.
         * @param replacer A function that returns the replacement text.
         */
        replaceAll(searchValue: string | RegExp, replacer: (substring: string, ...args: any[]) => string): string;
    }
}


// console.log(replaceAll("a{a}{b}{c}{d}",/\{\w\}/g,(str,...args:any[])=>{    
//     return str+"///////////"
// }))