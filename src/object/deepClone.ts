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
import { assignObject } from "./assignObject";

export interface CloneObjectOptions{
    deep?:boolean           // 是否深度克隆
}

export function deepClone<T=Collection>(obj:T,options?:CloneObjectOptions):T{
    const { deep } = assignObject({deep:true},options)    
    if(obj==undefined) return obj    
    if (isPrimitive(obj) || isFunction(obj)){
        return obj
    }else if(Array.isArray(obj)){        
        return obj.map((item:any) => {
            if(deep && isCollection(item)){
                return deepClone(item,{deep})
            }else{
                return item
            }
         }) as T       
    }else if(obj instanceof Set ){
        let newSet = new Set()   
        for(const item of obj.values()){
            if(deep && isCollection(item)){
                newSet.add(deepClone(item,{deep}))
            }else{
                newSet.add(item)
            }
        }
        return newSet as T
    }else if(obj instanceof Map ){
        let newMap = new Map()        
        for(const [key,value] of obj.entries()){
            if(deep && isCollection(value) ){
                newMap.set(key,deepClone(value,{deep}))
            }else{
                newMap.set(key,value)
            }
        }    
        return newMap as T 
    }else if(typeof(obj)=="object"){
        let results:any = {}
        Object.entries(obj).forEach(([key,value])=>{
            if(deep && isCollection(value)){
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
