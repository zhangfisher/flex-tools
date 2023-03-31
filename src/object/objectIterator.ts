/**
 * 
 * 返回一个用来对对象成员进行遍历的迭代器
 * 
 * 
 * 
 */

import { CircularRefError } from "../errors";
import { isCollection } from "../typecheck/isCollection";
import { isPrimitive } from "../typecheck/isPrimitive";
import { Collection } from "../types";
import { assignObject } from "./assignObject";

export interface ObjectIteratorOptions{
    keys?:string[]                              // 限定只能指定的健执行callback
    // 仅遍历原始类型，如string,number,boolean,symbol,null,undefined等，
    // 也就是说对于数组和对象只会遍历其成员，不会遍历数组和对象本身，不会执行callback
    onlyPrimitive?:boolean     
    // 是否检测循环引用  no-check:不进行检测, error: 触发错误,  skip: 跳过 
    circularRef?: 'no-check' | 'error' | 'skip'       
}

export interface ObjectIteratorValue { 
    value?:any
    parent?:Collection| null,
    keyOrIndex?:string | symbol | number | null
}

export function objectIterator(obj:Collection,options?:ObjectIteratorOptions):Iterable<ObjectIteratorValue>{
        let { keys,onlyPrimitive,circularRef } = assignObject({
            keys:[], 
            onlyPrimitive:true,   
            circularRef:'skip'
        },options) as Required<ObjectIteratorOptions>
    
        const stack:any[] = [obj]
        const parents:Node[] = []
        const keyOrIndexs:(number | string | symbol)[]=[]
        let count:number = 0
        let curItem:any
        let parent:any
        let keyOrIndex:any  
    
        // 记录遍历走过的对象引用
        let stepObjects:Set<any>
        if(circularRef!='no-check') stepObjects = new Set() 
        
        const getNext = ():any=>{
            curItem = stack.pop() as any
            parent = parents.pop()   
            keyOrIndex = keyOrIndexs.pop() 
            if(isCollection(curItem)){
                let hasCircularRef = false  // 存在循环引用
                if(circularRef!='no-check'){
                    if(stepObjects!.has(curItem)){   // 存在循环引用
                        if(circularRef=='error') throw new CircularRefError()      
                        hasCircularRef=true              
                    }
                    stepObjects!.add(curItem)
                }        
                if(!hasCircularRef){
                    const items ='entries' in curItem ?  [...curItem.entries()] : Object.entries(curItem)                
                    for (let i = items.length - 1; i >= 0; i--) {
                        const [k,v] = items[i]
                        stack.push(v); 
                        parents.push(curItem) 
                        keyOrIndexs.push(k) 
                    } 
                }            
            }  
            count++      
            // 如果不是原始类型，跳过        
            if(
                (onlyPrimitive && !isPrimitive(curItem))
                ||count==1
                || (keys && keys.length>0 && !keys.includes(String(keyOrIndex)))
            ) {
                return getNext()
            }
            return { value:curItem,parent,keyOrIndex } 
        }
    
        return {
            [Symbol.iterator](){
                return {
                    next(){            
                        const done= stack.length==0
                        const value = getNext()
                        return { done,value }
                    }
                }
            }
        } 
    
    } 
    