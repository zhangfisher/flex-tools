/**
 * 从对象中排除指定的字段，返回新对象
 * 
 * omit({a:1,b:2,c:3},"a")  // == {a:1}
 * omit({a:1,b:2,c:3},["a","b"])  // == {a:1,b:2} 
 * omit({a:1,b:2,c:3},(k,v)=>{
 *      return k =='a'
 * } )  // == {a:1}
 * 
 * 
 * 
 */

import type { ItemPicker } from "./pick"


/**
 * 
 * @param source 
 * @param keys 
 * @param returnNewObject  是否返回新的对象，false代表会修改原对象
 * @returns 
 */
export function omit(source:Record<string | symbol,any>,keys:ItemPicker,returnNewObject?:boolean){
     let newObject = returnNewObject===false ? source : Object.assign({},source)      
     if(typeof(keys) == 'function'){
        Object.entries(newObject).forEach(([key,value]) =>{
            if(keys.call(source,key,value)){
                delete newObject[key]
            } 
        })
     }else{
        let fields:string[] = Array.isArray(keys) ? keys : [keys]
        fields.forEach(field =>{
            delete newObject[field]
        })
     }     
     return newObject 
 }
 