/**
 * 从对象中提取指定的字段
 * 
 * pick({a:1,b:2,c:3},"a")  // == {a:1}
 * pick({a:1,b:2,c:3},["a","b"])  // == {a:1,b:2} 
 * pick({a:1,b:2,c:3},(k,v)=>{
 *      return k =='a'
 * } )  // == {a:1}
 * 
 * 
 * 
 */

import { isPlainObject } from "../typecheck/isPlainObject"

export type ItemPicker = string | string[] | ((key:any,value:any) => boolean)
export function pick(source:Record<any,any>,keys:ItemPicker,defaultValues?:Record<any,any>){
    let newObject:Record<any,any> =isPlainObject(defaultValues) ? Object.assign({},defaultValues) : {}
    if(typeof(keys) == 'function'){
        Object.entries(source).forEach(([key,value]) =>{
            if(keys.call(source,key,value)){
                newObject[key] = value
            } 
        })
    }else{
        let fields:string[] = Array.isArray(keys) ? keys : [keys]
        fields.forEach(field =>{
            if((field in source) && source[field]!==undefined){
                newObject[field] =  source[field]  
            }
        })
    }
    return newObject 
}
