/**
 * 
 * 深度克隆对象
 * 
 * 
 */

import { isCollection } from "../typecheck";
import { isFunction } from "../typecheck/isFunction";
import { isPrimitive } from "../typecheck/isPrimitive";
import type { Collection } from "../types";
 

export function deepClone<T=Collection>(obj:T):T{
    if(obj==undefined) return obj    
    
    // structuredClone虽然高效但不支持成员中包含函数
    // if(globalThis.structuredClone){
    //     return globalThis.structuredClone(obj)
    // }

    if (isPrimitive(obj) || isFunction(obj)){
        return obj
    }else if(Array.isArray(obj)){        
        return obj.map((item:any) => {
            if(isCollection(item)){
                return deepClone(item)
            }else{
                return item
            }
         }) as T       
    }else if(obj instanceof Set ){
        let newSet = new Set()   
        for(const item of obj.values()){
            if(isCollection(item)){
                newSet.add(deepClone(item))
            }else{
                newSet.add(item)
            }
        }
        return newSet as T
    }else if(obj instanceof Map ){
        let newMap = new Map()        
        for(const [key,value] of obj.entries()){
            if(isCollection(value) ){
                newMap.set(key,deepClone(value))
            }else{
                newMap.set(key,value)
            }
        }    
        return newMap as T 
    }else if(typeof(obj)=="object"){
        let results:any = {}
        Object.entries(obj).forEach(([key,value])=>{
            if(isCollection(value)){
                results[key] = deepClone(value)         
            }else{
                results[key] = value
            }
        })
        return results as T
    }else{
        return obj
    }    
}
