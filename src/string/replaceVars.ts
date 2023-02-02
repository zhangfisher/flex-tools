/**
 * 遍历str中的所有插值变量传递给callback，将callback返回的结果替换到str中对应的位置
 * @param {*} str
 * @param {Function(<变量名称>,[formatters],match[0])} callback
 * @param {Boolean} replaceAll   是否替换所有插值变量，当使用命名插值时应置为true，当使用位置插值时应置为false
 * @returns  返回替换后的字符串
 */
import { isPlainObject } from "../typecheck/isPlainObject";  

function getInterpVar(this:string,value:any,empty:string | null):string{
    let r  = value
    try{
        if(typeof(r)=="function") r = r.call(this,r)
        if(r==undefined) r = empty || ''
        return String(r)
    }catch{
        return String(r)
    }
}


const VAR_MATCHER = /\{(?<prefix>[\s\W]*)(?<name>\w*)(?<suffix>[\s\W]*)}/g
export type VarReplacer = (name:string,prefix:string,suffix:string,matched:string) => string
/**
 *   empty:  当插值变量为空(undefined|null)时的替代值，默认''，如果empty=null则整个变量均不显示包括前后缀字符
 *   lose: 当插值变量未定义时显示值，默认''
 */
export function replaceVars(text:string,vars:any,options?:{empty?:string | null}):string {
    let finalVars:any[] | Map<string,any> | Record<string,any>
    const opts = Object.assign({
        empty:null 
    },options) 
    
    if(typeof(vars)=='function') finalVars = vars.call(text)
    if(["boolean","string","number"].includes(typeof(vars))){
        finalVars= [vars]
    }else if(vars instanceof Map){
        finalVars = [...vars.entries()].reduce((pre:Record<string,any>,cur)=>{pre[cur[0]]=cur[1];return pre},{})
    }else if(Symbol.iterator in vars){
        finalVars = [...vars]
    }else if(isPlainObject(vars)){
        finalVars =vars
    }else{
        throw new TypeError("invalid vars")
    }
    if(Array.isArray(finalVars)){
        let i:number = 0
        const useVars = finalVars as any[]
        return text.replaceAll(VAR_MATCHER, (matched:string,prefix:string='',name:string='',suffix:string=''):string=>{
            if(i<useVars.length){
                // 如果empty==null,且变量值为空，则不显示
                if(opts.empty==null && useVars[i]==undefined){
                    return ''
                }else{
                    let replaced =  getInterpVar.call(text,useVars[i++],opts.empty)
                    return `${prefix}${replaced}${suffix}`
                    
                }                
            }else{ // 没有对应的插值
                return opts.empty==null ? '': `${prefix}${opts.empty}${suffix}`
            }            
        }) 
    }else if(typeof(finalVars)=='object'){
        const useVars = finalVars as Record<string,any>
        return text.replaceAll(VAR_MATCHER, (matched,prefix,name,suffix)=>{
            if(name in finalVars){
                let replaced =  getInterpVar.call(text,useVars[name],opts.empty)
                if(opts.empty==null && useVars[name]==undefined){
                    return ''
                }else{
                    return `${prefix}${replaced}${suffix}`
                }                
            }else{
                return opts.empty==null ? '': `${prefix}${opts.empty}${suffix}`
            }
        }) 
    }else{
        return text
    }    
}
  