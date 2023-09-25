/**
 * 
 * 使用方法与object.assign一样，差别在于
 * 
 *  Object.assign({a:1},{a:undefined}) === {a:undefined}
 * 
 *  assignObject({a:1},{a:undefined}) === {a:1}
 * 
 * 会忽略掉里面的undefined
 * 
 *  当最后一参数是数组时，会把数组里面的字段排除掉
 * 
 * 
 * // 排除c字段
 * 
 * import { exclude } from "flex-tools/object"
 * assignObject({a:1},{a:undefined,c:1},["a","b"])
 * assignObject({a:1},{a:undefined,c:1},["!a","b"])
 * assignObject({a:1},{a:undefined,c:1},/^a/])
 * 
 */

import { isPlainObject } from "../typecheck/isPlainObject";


export function assignObject<T= Record<any,any>>(target:T, ...sources: any[]): T{   
    if(sources.length === 0) return target;
    const lastArg = sources[sources.length-1] 
    const hasKeys = Array.isArray(lastArg) || (lastArg instanceof RegExp)
    const keys = hasKeys ? sources[sources.length-1] : []
    let mapSources = sources.map((source,index) =>{
        if(!isPlainObject(source) && (hasKeys && index>=sources.length-1)) return source;
        const sourceEntries = Object.entries(source)
        if(sourceEntries.some(([k,v]) =>v ===undefined)){
            return sourceEntries.reduce((result:any,[k,v])=>{
                if(v!==undefined){
                    if(keys.length>0){
                        if(keys.some()){
                        }
                    }else{
                        result[k] = v
                    }
                }
                return result
            },{})
        }else{
            return source
        }
    })
    return  Object.assign(target as any, ...mapSources);
}

 