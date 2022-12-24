/**
 * 
 * 深度遍历对象成员
 * 
 * 遍历过程中可以通过在在callback中返回ABORT来中止遍历
 */
import { isPlainObject } from "../typecheck/isPlainObject"
import type { IForEachCallback } from "./forEachUpdateObject"

export const ABORT = Symbol('ABORT_FOR_EACH')

export interface ForEachObjectOptions{
    keys?:string[]                              // 限定只能指定的健执行callback
}

export function forEachObject(obj:object | any[],callback:IForEachCallback,options?:ForEachObjectOptions){
    let isAbort = false
    let opts = Object.assign({
        keys:[]
    },options || {}) as Required<ForEachObjectOptions>
    function forEachItem({value,parent,keyOrIndex}:{value:any,parent?:any[] | object | null,keyOrIndex?:string | number | null}){
        if(isAbort) return
        if(Array.isArray(value) || isPlainObject(value)){
            for(let [k,v] of Object.entries(value)){
                try{
                    if(forEachItem({value:v,parent:value,keyOrIndex:k})== ABORT){
                        isAbort = true
                        break
                    }
                }catch{}   // 忽略错误
            }
        }else{
            if(opts.keys.length>0){
                if(opts.keys.includes(String(keyOrIndex))) {
                    return callback({value,parent,keyOrIndex})            
                }
            }else{
                return callback({value,parent,keyOrIndex})            
            }
        }
    }
    forEachItem({value:obj,parent:null,keyOrIndex:null})
}