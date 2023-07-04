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
        while(str.indexOf(search) > -1){
            const replaceValue = typeof(replacer)=='function' ? replacer(search) : replacer
            str = str.replace(search,replaceValue)
        }        
    }else{
        let m:RegExpExecArray | null
        while ((m = search.exec(str)) !== null) {
            // 这对于避免零宽度匹配的无限循环是必要的
            if (m.index === search.lastIndex) {
                search.lastIndex++;
            }     
            const replaceValue = typeof(replacer)=='function' ? replacer(m[0],...m) : replacer
            str = str.replace(m[0],replaceValue)
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