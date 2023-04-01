import { isPlainObject } from "../typecheck/isPlainObject"
import { assignObject } from "./assignObject"

 
/**
 * 简单进行对象深度合并
 * 
 * 返回合并后的新的对象
 * 
 * 对lodash的merge的最大差别在于对数据进行替换与合并或去重
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @returns 合并后的对象
 */
export interface DeepMergeOptions{
    array?:'replace' | 'merge' | 'uniqueMerge',                          // 数组合并策略，0-替换，1-合并，2-去重合并
    ignoreUndefined?: boolean                                            // 忽略undefined项不进行合并
    newObject?:boolean                                                   // 是否返回新对象或者合并
}
export function deepMerge(toObj:any,formObj:any,options?:DeepMergeOptions){
    let opts = assignObject({
        array:"uniqueMerge",
        ignoreUndefined:true,
        newObject:true
    },options)
    let results:any =opts.newObject ?  Object.assign({},toObj) : toObj
    Object.entries(formObj).forEach(([key,value])=>{
        let result 
        if(key in results){
            if(value !== null){            
                if(Array.isArray(value) && Array.isArray(results[key])){
                    if(opts.array === 'replace' ){
                        result = value
                    }else if(opts.array === 'merge'){
                        result = [...(Array.isArray(results[key]) ? results[key] : []),...value]
                    }else if(opts.array === 'uniqueMerge'){
                        result= [...new Set([...(Array.isArray(results[key]) ? results[key] : []),...value])]
                    }
                }else if(isPlainObject(value) && isPlainObject(results[key])){
                    result= deepMerge(results[key],value,opts)
                }else{
                    result = value  
                }
            }else{      
                result = value                     
            }
        }else{ 
            result = value 
        }
        if(opts.ignoreUndefined){
            if(result!==undefined) results[key] = result
        }else{
            results[key] = result
        }     
    })
    return results
}