import { assignObject } from "../object/assignObject";
import { canIterable } from "../typecheck";
import { isNothing } from "../typecheck/isNothing";
import { isPlainObject } from "../typecheck/isPlainObject";   
// @ts-ignore 
import replaceAll from "string.prototype.replaceall"  
replaceAll.shim()

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

// V3 使用<>包装前后缀，其中包含prefix,name,suffix三个命名捕获组
//const VAR_MATCHER = /\{(\<(?<prefix>.*?)\>)?\s*(?<name>[\u4E00-\u9FA5A\w]*)\s*(\<(?<suffix>.*?)\>)?\}/gm

// V4 由于在react-native中不支持命名捕获组，会导致出错，所以移除命名捕获组
const VAR_MATCHER = /\{(\<(.*?)\>)?\s*([\u4E00-\u9FA5A\w]*)\s*(\<(.*?)\>)?\}/gm



export type VarReplacer = (name:string,prefix:string,suffix:string,matched:string) => string
/**
 *   empty:  当插值变量为空(undefined|null)时的替代值，默认''，如果empty=null则整个变量均不显示包括前后缀字符
 *   delimiter: 当变量是数组或对象时使用delimiter进行连接
 *   forEach: 遍历所有插值变量
 */
export interface ReplaceVarsOptions{
    empty?:string | null
    default?:string                 // 如果变量不存在时的默认值
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
    
    if(typeof(vars)=='function') vars = vars.call(text)
    if(["boolean","string","number"].includes(typeof(vars))){
        finalVars= [vars]
    }else if(vars instanceof Map){
        finalVars = [...vars.entries()].reduce((pre:Record<string,any>,cur)=>{pre[cur[0]]=cur[1];return pre},{})
    }else if(Symbol.iterator in vars){
        finalVars = [...vars]
    }else if(isPlainObject(vars)){
        finalVars = vars
    }else if(vars instanceof Error){
        finalVars = [`Error:${vars.message}`]
    }else{
        finalVars =[ vars ]
    }

    // let index:number = 0
    // // {<变量名称>:<变量值>}, 如果是数组则转换为{0:<变量值>,1:<变量值>,...} 
    // const varList = Array.isArray(finalVars) ? finalVars.reduce((pre,cur,index)=>{
    //     pre[index]=cur
    //     return pre
    // },{}) : finalVars
    // // replaceAll在低版本ES中不存在，上面已经加了shim，这需要加any类型才不会报错
    // return (text as any).replaceAll(VAR_MATCHER, function():string{
    //     let prefix = arguments[2] || ''
    //     let name = arguments[3] || ''
    //     let suffix = arguments[5] || ''        
    //     if(index<varList.length){
    //         // 如果empty==null,且变量值为空，则不显示
    //         if(opts.empty==null && isNothing(varList[index][1])){
    //             return ''
    //         }else{
    //             let value =  getInterpVar.call(text,varList[index++][1],opts)
    //             // 如果指定了forEach则调用
    //             if(typeof(opts.forEach)=='function'){
    //                 const r = opts.forEach(name,value,prefix,suffix)
    //                 if(Array.isArray(r) && r.length==3){                            
    //                     prefix=r[0]
    //                     value = r[1]
    //                     suffix=r[2]
    //                 }
    //             }
    //             return `${prefix}${value}${suffix}`
                
    //         }                
    //     }else{ // 没有对应的变量时使用空值替换
    //         return opts.empty==null ? '': `${prefix}${opts.empty}${suffix}`
    //     }            
    // })  
    let i:number = 0
    return (text as any).replaceAll(VAR_MATCHER, function():string{
        let prefix = arguments[2] || ''
        let name = arguments[3] || ''
        let suffix = arguments[5] || ''
        let varValue:string = '',isEmpty:boolean=false
        if(Array.isArray(finalVars)){           // 位置插值            
            const isOverflow = i >= (finalVars as []).length
            varValue = isOverflow ? '' : getInterpVar.call(text,(finalVars as any)[i],opts)  
            isEmpty= isNothing(varValue) || isOverflow
            i++
        }else if(isPlainObject(finalVars)){         // 字典插值
            const isExists = name in (finalVars as {})
            varValue =isExists ? getInterpVar.call(text,(finalVars as any)[name],opts) : ''
            isEmpty= isNothing(varValue) || !isExists
        }
        // 如果指定了forEach则调用
        if(typeof(opts.forEach)=='function'){
            const r = opts.forEach(name,varValue,prefix,suffix)
            if(Array.isArray(r) && r.length==3){                            
                prefix=r[0]
                varValue = r[1]
                suffix=r[2]
            }
        }
        // 为空时使用empty替换
        if(isEmpty){
            if(opts.empty==null){
                varValue='';prefix='';suffix='';
            }else{
                varValue = opts.empty
            }
        }          
        return `${prefix}${varValue}${suffix}`
    }) 


}
  


// if(Array.isArray(finalVars)){           // 位置插值
//     let i:number = 0
//     const useVars = finalVars as any[]
//     // replaceAll在低版本ES中不存在，上面已经加了shim，这需要加any类型才不会报错
//     return (text as any).replaceAll(VAR_MATCHER, function():string{
//         let prefix = arguments[2] || ''
//         let name = arguments[3] || ''
//         let suffix = arguments[5] || ''
//         if(i<useVars.length){
//             // 如果empty==null,且变量值为空，则不显示
//             if(opts.empty==null && isNothing(useVars[i])){
//                 return ''
//             }else{
//                 let value =  getInterpVar.call(text,useVars[i++],opts)
//                 // 如果指定了forEach则调用
//                 if(typeof(opts.forEach)=='function'){
//                     const r = opts.forEach(name,value,prefix,suffix)
//                     if(Array.isArray(r) && r.length==3){                            
//                         prefix=r[0]
//                         value = r[1]
//                         suffix=r[2]
//                     }
//                 }
//                 return `${prefix}${value}${suffix}`
                
//             }                
//         }else{ // 没有对应的变量时使用空值替换
//             return opts.empty==null ? '': `${prefix}${opts.empty}${suffix}`
//         }            
//     }) 
// }else if(isPlainObject(finalVars)){         // 字典插值
//     const useVars = finalVars as Record<string,any>
//     return (text as any).replaceAll(VAR_MATCHER, function():string{
//         //let {prefix='',name='',suffix=''} = arguments[arguments.length-1] 
//         let prefix = arguments[2] || ''
//         let name = arguments[3] || ''
//         let suffix = arguments[5] || ''
//         if(name in finalVars){
//             let value =  getInterpVar.call(text,useVars[name],opts)
//             if(opts.empty==null && isNothing(useVars[name])){
//                 return ''
//             }else{
//                 // 如果指定了callback则调用
//                 if(typeof(opts.forEach)=='function'){
//                     const r = opts.forEach(name,value,prefix,suffix)
//                     if(Array.isArray(r) && r.length==3){                            
//                         prefix=r[0]
//                         value = r[1]
//                         suffix=r[2]
//                     }
//                 }
//                 return `${prefix}${value}${suffix}`
//             }                
//         }else{
//             return opts.empty==null ? '': `${prefix}${opts.empty}${suffix}`
//         }
//     }) 
// }else{
//     return text
// }    