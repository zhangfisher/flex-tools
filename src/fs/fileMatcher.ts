import path from "path"
// @ts-ignore 
import replaceAll from "string.prototype.replaceall"  
import { assignObject } from "../object/assignObject"
replaceAll.shim()

export interface FileMatcherOptions{
    base?:string
    defaultPatterns?:string[]
}

export interface IFileMatcher{
    test(file:string):boolean
    base:string
    lastMatched:string | null
    patterns:[RegExp,boolean][]
}

/**
 *  
 *  匹配指定路径或文件名称
 *  
 *  const matcher = fileMatcher([
 *    "<pattern>",          // 匹配正则表达式字符串
 *    "!<pattern>",         // 以!开头代表否定匹配
 *    /正则表达式/ 
 *  ],{
 *      base:"<指定一个基准目录，所有不是以此开头的均视为不匹配>",
 *      defaultPatterns:["<默认排除的模式>","<默认排除的模式>","<默认排除的模式>"],
 *      debug:<true/>false,是否输出调试信息,当=true时，.test()方法返回[<true/false>,pattern]      *      
 *  })
 * 
 *  matcher.test("<文件名称>") 返回true/false   
 *
 * 
 * 
 * @param {*} patterns 
 * @param {*} base          如果指定base，则所有不是以base开头的文件都排除
 * @param {*} defaultPatterns    默认的匹配模式
 */

 export function fileMatcher(patterns:string[],options?:FileMatcherOptions):IFileMatcher{
    let { base=process.cwd(),defaultPatterns=[] } = assignObject({},options)
    base =  path.normalize(base)
    if(!path.isAbsolute(base)) base = path.join(process.cwd(),base)

    //[[pattern,exclude],[pattern,false],[pattern,true]]
    let finalPatterns:[RegExp,boolean][] = []
    let inputPatterns = Array.isArray(patterns) ? patterns : (patterns ? [patterns] : [])

    // 默认排除模式
    if(defaultPatterns.length===0){        
        finalPatterns.push([/__test__\/.*/,true])
        finalPatterns.push([/.*\/.*\.test\.js$/,true])
        finalPatterns.push([/node_modules\/.*/,true])
        finalPatterns.push([/.*\/node_modules\/.*/,true])
        finalPatterns.push([/.*\/languages\/.*/,true])           // 默认排除语言文件
        finalPatterns.push([/\.babelrc/,true])
        finalPatterns.push([/babel\.config\.js/,true])
        finalPatterns.push([/package\.json$/,true])
        finalPatterns.push([/vite\.config\.js$/,true])
        finalPatterns.push([/^plugin-vue:.*/,true])    
    }

    inputPatterns.forEach(pattern=>{
        if(typeof pattern === "string"){    
            // 将**转换为.*，将?转换为[^\/]?            
            pattern = pattern.replaceAll("**",".*")
                .replaceAll("?","[^\/]?")
                .replaceAll(/(?<!\.)\*/g,"[^\/]*")   
            // 以!开头的表示排除
            if(pattern.startsWith("!")){
                finalPatterns.unshift([new RegExp(pattern.substring(1),"g"),true])
            }else{
                finalPatterns.push([new RegExp(pattern,"g"),false])
            }          
        }else{
            finalPatterns.push([pattern,false])
        }
    })

    return {        
        patterns:finalPatterns,
        lastMatched:null,           // 保存最近一次匹配的结果
        base,
        test: function(filename:string):boolean {
            let isMatched = false 
            let file =  path.normalize(filename)                         
            // 如果指定base，则文件名称必须是以base开头
            if(path.isAbsolute(file)){
                if(!file.startsWith(base)) {
                    this.lastMatched = null
                    return false
                }
                if(file==base){
                    this.lastMatched = base
                    return true
                }                                
            }else{
                file = path.join(base,file)
            }          
            if(finalPatterns.length===0){
                isMatched =true
                this.lastMatched = "*"
            }else{                
                for(const [pattern,isExclude] of finalPatterns){
                    pattern.lastIndex = 0
                    if(isExclude){      // 排除匹配
                        if(pattern.test(file)) {
                            this.lastMatched = pattern.toString()
                            return false
                        }
                    }else{                      // 匹配
                        if(pattern.test(file)){
                            if(pattern.test(file)) {
                                this.lastMatched = pattern.toString()
                                return true
                            }
                        }
                    }
                }
            }
            return  isMatched
        }
    }
}
