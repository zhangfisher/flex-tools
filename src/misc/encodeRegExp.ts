import { escapeRegex } from './escapeRegex';
 
/**
 * 
 * 将正则表达式转换为字符串，并可选地用提供的变量替换占位符。
 * 
 * @param regex -  要转换的正则表达式。
 * @param vars -   可选的键值对记录，其中键是正则表达式字符串中的占位符，值是替换内容。
 * @returns  处理正则表达式并应用替换后的结果字符串。
 * 
 * @example
 * const regexStr1 = toRegexStr(/hello/);
 * console.log(regexStr1); // Output: "hello"
 * 
 * @example
 * const regexStr2 = toRegexStr(/hello \__NAME__\}/, { "__NAME__": "world" });
 * console.log(regexStr2); // Output: "hello world"
 * 
 * @example
 * const regexStr3 = toRegexStr(/foo \{var1\} and \{var2\}/, { "{var1}": "bar", "{var2}": "baz" });
 * console.log(regexStr3); // Output: "foo bar and baz"
 */
export function encodeRegExp(regex:RegExp,vars?:Record<string,string>){
    let r = regex.toString().replace(/^\/|\/$/g, "");
    if(vars && typeof(vars)==="object"){
        Object.entries(vars).forEach(([k,v])=>{
            r = r.replaceAll(k,escapeRegex(v))
        })        
    }
    return r
}