import { assignObject } from './src/object/assignObject';
/**
 * 
 * 用来匹配一个字符串是否满足某种规则
 * 
 * 
 * 
 * matcher(["a"]).test("a")             // true,严格匹配
 * matcher(["a","b"]).test("a")         // true,严格匹配
 * matcher(["!a","b"]).test("a")        // false 严格匹配
 * matcher(["!a","b"]).test("x")        // false, 指定了肯定匹配和否定匹配时，!a代表不匹配a，
 * matcher(["*"])                       // 任意字符直到某个指定的字符结束
 * matcher(["**"])                      // 匹配任意字符,使用.*正则
 * matcher(["?"])                       // ?代表单个字符
 * 
 * 
 * 
 */


export interface Matcher{
    test(str:string):boolean                        // 返回是否匹配
}

export interface MatcherOptions{
    ignoreCase?:boolean
    divider?:string
    charset?:string             // 指定?匹配的有效字符集，默认值时非空字符
}

export function matcher(rules:string | (RegExp | string)[] | RegExp ,options?:MatcherOptions){
    let finalRules:[RegExp,boolean][] = []  
    if(!Array.isArray(rules)){
        rules = [rules]
    }
    let {divider,charset,ignoreCase} = assignObject({
        charset:"[^\s\n]",
        ignoreCase:false,
        divider:undefined
    },options)

    let regexFlags:string = 'g'
    if(ignoreCase) regexFlags=regexFlags+"i"

    finalRules=rules.map(rule=>{
        if(typeof rule === "string"){
            if(rule.includes("*")){            
                if(divider){// 指定分割符时*匹配到分隔符为止                
                    rule = rule.replace(/(?<!\\)\*/g,"(?<=(\\"+divider+"|^)).{1,}?(?=(\\"+divider+"|$))")
                }else{// 未指定分隔符时，*==**
                    rule = rule.replace(/(?<!\\)\*/g,"**")    
                }
                rule = rule.replace(/(?<!\\)\*\*/g,".*")    // 任意字符串              
                rule = rule.replace(/(?<!\\)\?/g,charset)   // 单个字符
            }
            return [new RegExp(rule),rule.startsWith("!")]
        }else if(rule instanceof RegExp){
            return [rule,false]
        }else{
            throw new Error("rule must be string or RegExp")
        }
    })
    // 将否定规则排在前面
    finalRules = finalRules.reduce<([RegExp, boolean])[]>((result,[rule,deny])=>{
        if(deny){
            result.unshift([rule,deny])
        }else{
            result.push([rule,deny])
        }
        return result
    },[] )

    return {
        test(str:string):boolean{
            for(const [rule,deny] of finalRules){
                let matched = rule.test(str)
                if(deny && matched){
                    return false
                }else if(!deny && matched){
                    return true
                }
            }
            return false
        }
    }

}