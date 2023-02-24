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
 * // 排除c字段
 * 
 * import { exclude } from "flex-tools/object"
 * assignObject({a:1},{a:undefined,c:1},{[exclude]:"c"})
 * assignObject({a:1},{a:undefined,c:1},{[exclude]:["c","a"]})
 * 
 */

import { isPlainObject } from "../typecheck/isPlainObject";

// 排除字段列表
export const exclude = Symbol("exclude");
// 只包括的字段
export const include = Symbol("include");

export function assignObject(target: object, ...sources: any[]): any{    
    let mapSources = sources.map(source =>{
        if(!isPlainObject(source)) return source;
        const sourceEntries = Object.entries(source)
        if(sourceEntries.some(([k,v]) =>v ===undefined)){
            return sourceEntries.reduce((result:any,[k,v])=>{
                if(v!==undefined) result[k] = v;
                return result
            },{})
        }else{
            return source
        }
    })
    let results = Object.assign(target,...mapSources);
    if(include in results){
        const includeFields =typeof(results[include]) === "string" ? results[include].split(",") : (Array.isArray(results[include]) ? results[include] : [results[include]])
        Object.keys(results).forEach((key:string) =>{
            if(!includeFields.includes(key)) delete results[key]
        })
        delete results[include]
    }
    if(exclude in results) {
        const excludeFields =typeof(results[exclude]) === "string" ? results[exclude].split(",") : (Array.isArray(results[exclude]) ? results[exclude] : [results[exclude]])
        excludeFields.forEach((name:string) =>delete results[name])
        delete results[exclude]
    }
    return results
}