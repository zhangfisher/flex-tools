/**
 * 
 * 通过路径字符串获取对象的值
 * 
 * 例:  
 *  get({a:1,b:{c:2}},'b.c')  == 2
 *  get({a:1,x:[{a:1,b:1},{a:2,b:2}]},'x[1].b')  == 2
 * 
 */

import { canIterable } from "../typecheck"
import { assignObject } from "./assignObject"


export type getByPathMatchCallback = ({value,parent,indexOrKey}:{value?:any,parent?:object | any[],indexOrKey?:string | symbol | number})=>void

export interface getByPathOptions{
    defaultValue?:any                       // 默认值
    ignoreInvalidPath?:boolean              // 忽略无效路径,返回undefine或者defaultValue，否则触发错误
    matched?: getByPathMatchCallback        // 当匹配到路径时的回调
}

const arrayRegex = /(?<name>\w*)\[\s*(?<index>\d)\s*\]/
export class InvalidPathError extends Error {}

function parseArrayPath(pathItem:string):[string,number] | undefined{
    let result = pathItem.match(arrayRegex)
    if(result){
        let {name,index} = result.groups as {name:string,index:string}
        return [name,parseInt(index)]
    }
    return undefined
}


export function get<R=any,P extends string=string>(obj:Record<string,any>,path:P,options?:getByPathOptions):R{
    const { defaultValue,matched,ignoreInvalidPath} = assignObject({
        ignoreInvalidPath:true,
        defaultValue:undefined
    },options)
    while(path.includes("][")){
        path = path.replace("][","].[") as P
    }
    let paths = path.split('.')
    let result = obj
    let matchedParent = null  // 匹配路径的父，数组或者对象
    let matchedIndexOrKey:string | symbol | number = -1     // 匹配路径的数组索引
    let isInvalidPath = false
    for(let i=0;i<paths.length;i++){
        let key = paths[i]
        if(key in result){
            matchedParent = result
            matchedIndexOrKey=key
            result = result[key]            
        }else if(key.trim().endsWith(']')){
            const match = parseArrayPath(key)
            if(match){ // xxx[index]形式匹配，用来提取数组或者可迭代对象的值
                const [ name, index] = match
                if(name in result){
                    result = result[name]
                }
                if(Array.isArray(result)){
                    matchedParent = result
                    matchedIndexOrKey = index
                    result = result[index]                    
                }else if(canIterable(result) && typeof index == 'number'){
                    matchedParent = result
                    matchedIndexOrKey = index
                    result = [...result as any][index]                    
                }else{
                    isInvalidPath = true
                    break
                }
                continue
            }
            isInvalidPath = true      
            break
        }else{   // 无效路径名称
            isInvalidPath = true        
        }
        if(result==undefined){
            if(i<paths.length) isInvalidPath = true
            break
        }
    }
    if(isInvalidPath){
        if(ignoreInvalidPath){
            result = defaultValue
        }else{
            throw new InvalidPathError()
        } 
    }    
    if(typeof(matched)=='function' && !isInvalidPath){
        matched({value:result,parent:matchedParent,indexOrKey:matchedIndexOrKey})
    }
    return result as R
}

 