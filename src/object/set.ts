/**
 * 使用路径设置对象的值
 * 
 *     const obj = {
        a:{
            b1:{b11:1,b12:2},
            b2:{b21:1,b22:2},
            b3:[
                {b31:1,b32:2},
                {b31:1,b32:2}
            ]            
        },
        x:1,
        y:[1,2,3,4,5,{m:1,n:2}],
        z:[1,2,3,new Set([1,2,3,4,5])]
    }   

    set(obj,"a.b1.b11",100)

 */

import { assignObject } from "./assignObject"
import { get, InvalidPathError } from './get';

export interface setByPathOptions{
    onlyUpdateUndefined?:boolean            // 仅在原值为undefined时更新
    allowUpdateNullPath?:boolean            // 当路径不存在时，是否允许更新
}

export function set<P extends string = string>(obj:object,path:P,value:any,options?:setByPathOptions):object{
    const {onlyUpdateUndefined,allowUpdateNullPath} = assignObject({
        onlyUpdateUndefined:false,
        allowUpdateNullPath:true
    },options)
    if(!path || path.trim().length==0) return obj
    try{
        get(obj,path,{
            matched:({value:itemValue,parent,indexOrKey})=>{
                if(itemValue!==undefined && onlyUpdateUndefined)  return
                if(Array.isArray(parent) && typeof(indexOrKey) == "number"){
                    if(indexOrKey >= 0 && indexOrKey < parent.length ){
                        parent[indexOrKey] = value
                    }else if(indexOrKey >= parent.length){
                        parent.push(value)
                    }else{
                        throw new Error("index out of range")
                    }
                }else if(typeof(parent) == "object"){
                    (parent as any)[indexOrKey!] = value
                }
            },
            ignoreInvalidPath:false
        })
    }catch(e:any){
        // 不存在的路径
        if(e instanceof InvalidPathError){  
            if(!allowUpdateNullPath) throw e
            let keys:string[] = path.split('.')
            let curItem:any = obj
            for(let i=0;i<keys.length;i++){
                const key = keys[i]
                if(!(key in curItem)){
                    curItem[key] = i==keys.length-1 ? value : {}                   
                }
                curItem = curItem[key]
            }
        }else{
            throw e
        }
    }    
    return obj
}

 