import { assignObject } from "../object/assignObject";
import { canIterable } from "../typecheck";
import { isNothing } from "../typecheck/isNothing";
import { isPlainObject } from "../typecheck/isPlainObject";   

function getInterpVar(this:string,value:any,{empty,delimiter=","}:ReplaceVarsOptions):string{
    let finalValue  = value
    try{
        if(typeof(finalValue)=="function") finalValue = finalValue.call(this,finalValue)
        if(isNothing(finalValue)) finalValue = empty || ''
        if(Array.isArray(finalValue)){
            return finalValue.map(v=>String(v)).join(delimiter)
        }else if(isPlainObject(finalValue)){             
            return Object.entries(finalValue as Record<string,any>).reduce((result:any[],[k,v]:[string,any]) =>{
                result.push(`${k}=${String(v)}`)
                return result
            },[] ).join(delimiter)
        }else if(canIterable(finalValue) && typeof(finalValue) != 'string'){
            return [...finalValue].map(v=>String(v)).join(delimiter)
        }else if(finalValue instanceof Error){
            return finalValue.message
        }else{
            return String(finalValue)
        }        
    }catch{
        return String(finalValue)
    }
}
 
// const VAR_MATCHER = /\{(?<prefix>[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*)(?<name>[\u4E00-\u9FA5A\w]*)(?<suffix>[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*?)\}/g

// V1 const VAR_MATCHER=/\{(?<prefix>[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*[\u4E00-\u9FA5A\w]*?[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*)(?<name>[\u4E00-\u9FA5A\w]*)(?<suffix>[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*?[\u4E00-\u9FA5A\w]*?[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*)\}/gm

// V2 const VAR_MATCHER = /\{(?<prefix>[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*?[\u4E00-\u9FA5A\w]*?[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]+)?(?<name>[\u4E00-\u9FA5A\w]*?)(?<suffix>[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]+[\u4E00-\u9FA5A\w]*?[^a-zA-Z0-9_\{\}\u4E00-\u9FA5A]*?)?\}/gm

// 使用<>包装前后缀
const VAR_MATCHER = /\{(\<(?<prefix>.*?)\>)?\s*(?<name>[\u4E00-\u9FA5A\w]*)\s*(\<(?<suffix>.*?)\>)?\}/gm

export type VarReplacer = (name:string,prefix:string,suffix:string,matched:string) => string
/**
 *   empty:  当插值变量为空(undefined|null)时的替代值，默认''，如果empty=null则整个变量均不显示包括前后缀字符
 *   delimiter: 当变量是数组或对象时使用delimiter进行连接
 *   forEach: 遍历所有插值变量
 */
export interface ReplaceVarsOptions{
    empty?:string | null
    delimiter?:string
    // 遍历所有插值变量的回调函数，必须返回[prefix,value,suffix]
    forEach?:(name:string,value:string,prefix:string,suffix:string)=>[string,string,string ]
}
export function replaceVars(text:string,vars:any,options?:ReplaceVarsOptions):string {
    let finalVars:any[] | Map<string,any> | Record<string,any>
    const opts =assignObject({
        empty:null,
        delimiter:",",               // 当变量是数组或对象是转换成字符串时的分割符号
        forEach:null
    },options)  as ReplaceVarsOptions
    
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
        finalVars =[ vars ]
    }
    if(Array.isArray(finalVars)){
        let i:number = 0
        const useVars = finalVars as any[]
        return text.replaceAll(VAR_MATCHER, function():string{
            let {prefix='',name='',suffix=''} = arguments[arguments.length-1] 

            if(i<useVars.length){
                // 如果empty==null,且变量值为空，则不显示
                if(opts.empty==null && isNothing(useVars[i])){
                    return ''
                }else{
                    let replaced =  getInterpVar.call(text,useVars[i++],opts)
                    // 如果指定了forEach则调用
                    if(typeof(opts.forEach)=='function'){
                        const r = opts.forEach(name,replaced,prefix,suffix)
                        if(Array.isArray(r) && r.length==3){                            
                            prefix=r[0]
                            replaced = r[1]
                            suffix=r[2]
                        }
                    }
                    return `${prefix}${replaced}${suffix}`
                    
                }                
            }else{ // 没有对应的插值
                return opts.empty==null ? '': `${prefix}${opts.empty}${suffix}`
            }            
        }) 
    }else if(isPlainObject(finalVars)){
        const useVars = finalVars as Record<string,any>
        return text.replaceAll(VAR_MATCHER, function():string{
            let {prefix='',name='',suffix=''} = arguments[arguments.length-1] 
            if(name in finalVars){
                let replaced =  getInterpVar.call(text,useVars[name],opts)
                if(opts.empty==null && isNothing(useVars[name])){
                    return ''
                }else{
                    // 如果指定了callback则调用
                    if(typeof(opts.forEach)=='function'){
                        const r = opts.forEach(name,replaced,prefix,suffix)
                        if(Array.isArray(r) && r.length==3){                            
                            prefix=r[0]
                            replaced = r[1]
                            suffix=r[2]
                        }
                    }
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
  