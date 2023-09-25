import { assignObject } from '../object/assignObject';
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

export class Matcher{
    rules:[RegExp,boolean][] = []
    constructor(rules:string | (RegExp | string)[] | RegExp ,options?:MatcherOptions){
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

        this.rules=rules.map(rule=>{
            if(typeof rule === "string"){
                let  deny = false
                if(rule.startsWith("!")){
                    deny = true
                    rule = rule.slice(1)
                }                

                rule = rule.replace(/(?<!\\)\?/g,charset)  
                if(rule.includes("*")){            
                    if(divider){// 指定分割符时*匹配到分隔符为止                
                        rule = rule.replace(/(?<!\\)\*\*/g,".*") 
                        rule = rule.replace(/(?<![\\\.])\*/g,"(?<=(\\"+divider+"|^)).{1,}?(?=(\\"+divider+"|$))")
                    }else{// 未指定分隔符时，*==**)   
                        rule = rule.replace(/(?<!\\)\*\*/g,".*")  
                    }                       
                }                 // 单个字符
                rule = `^${rule}$`
                return [new RegExp(rule),deny]
            }else if(rule instanceof RegExp){
                return [rule,false]
            }else{
                throw new Error("rule must be string or RegExp")
            }
        })
        // 将否定规则排在前面
        this.rules = this.rules.reduce<([RegExp, boolean])[]>((result,[rule,deny])=>{
            if(deny){
                result.unshift([rule,deny])
            }else{
                result.push([rule,deny])
            }
            return result
        },[] ) 
    }
    test(str:string):boolean{
        if(this.rules.length === 0) return true
        let hasDeny = false
        for(const [rule,deny] of this.rules){
            let matched = rule.test(str)
            if(deny){
                hasDeny = true
                if(matched) return false
            }else{
                if(matched) return true
            }
        }        
        return  hasDeny 
    }
}