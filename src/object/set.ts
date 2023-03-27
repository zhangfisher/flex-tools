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
import { get } from "./get"

export interface setByPathOptions{
    onlyUpdateUndefined?:boolean
}

export function set(obj:object,path:string,value:any,options?:setByPathOptions):object{
    const {onlyUpdateUndefined} = assignObject({
        onlyUpdateUndefined:false
    },options)
    if(!path || path.trim().length==0) return obj
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
    return obj
}