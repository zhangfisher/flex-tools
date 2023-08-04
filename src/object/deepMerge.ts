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
    $ignoreUndefined?: boolean                                            // 忽略undefined项不进行合并
    // 声明同名项的合并策略，数组默认为unique，{}默认为append
    $merge: 'replace' | 'append' | 'unique' | ((fromValue:any,toValue:any,ctx:{key:string,from:any,to:any})=>any)      
}

function hasMergeOptions(obj:Record<string | symbol,any> | undefined | null){
    if(isPlainObject(obj)){
        return ["$merge","$ignoreUndefined"].some(key=>key in obj!)
    }else{
        return false
    }    
}
export function deepMerge(...objs:(Record<string | symbol,any> | undefined | null)[]){
    if(objs.length<2) throw new Error("deepMerge函数至少需要两个参数")
    const hasOptions = objs.length >0 ? hasMergeOptions(objs[objs.length-1]) : false
    // 读取配置参数对象
    const {$merge,$ignoreUndefined,skipKeys} = assignObject({
        skipKeys:[],
        $ignoreUndefined:true,
        $merge:"replace"
    },hasOptions ? objs[objs.length-1] : {} )   
    function deepMergeItem(fromObj:Record<string | symbol,any> | undefined | null,toObj:Record<string | symbol,any>){   
        if(!isPlainObject(fromObj)) return
        Object.entries(fromObj!).forEach(([key,fromValue]:[string,any])=>{
            let toValue:any 
            if(key in toObj){
                if(Array.isArray(fromValue) && Array.isArray(toObj[key])){
                    if($merge === 'replace' ){
                        toValue = fromValue
                    }else if($merge === 'append'){
                        toValue = [...toObj[key],...fromValue]
                    }else if($merge === 'append'){
                        toValue= [...new Set([...toObj[key],...fromValue])]
                    }else if(typeof($merge) === 'function'){
                        toValue = $merge(toObj[key],fromValue,{key,from:fromObj,to:toObj})
                    }
                    toObj[key] =$ignoreUndefined && fromValue===undefined ? toObj[key] : toValue
                }else if(isPlainObject(fromValue) && isPlainObject(toObj[key])){
                    deepMergeItem(fromValue,toObj[key])
                }else{
                    toObj[key] =$ignoreUndefined && fromValue===undefined ? toObj[key] : fromValue
                }
            }else{ 
                toObj[key] = fromValue
            }             
        })
    }
    return objs.reduce((pre,cur,index)=>{
        if(index==0) return pre || {}
        if(!isPlainObject(cur)) return pre        
        if(hasOptions && index === objs.length-1) return pre
        deepMergeItem(cur,pre || {})
        return pre
    },objs[0]) as Record<string | symbol,any>
}