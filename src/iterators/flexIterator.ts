import { isPlainObject } from "../typecheck"
import { canIterator } from "./canIterator"
import { SKIP } from "../consts"

export type FlexIteratorOptions<Value=any,Result=Value,Parent=any> = {
    pick?:(item:Value | Parent)=>Value | Iterable<any>
    transform:(value:Value,parent?:Parent)=>Result
    // 当true时如果transform也返回一个迭代对象时，递归遍历所有可迭代对象
    recursion?:boolean
}
/**
 * 可以迭代的对象
 * 
 * const source = new FlexIterator([1,2,3,4,5])
 * for(let value of source){
 *  console.log(value)
 * }
 * Output: 1,2,3,4,5
 * 
 * const source = new FlexIterator([1,2,3,4,5],{transform:(value)=>`S-${value}`})
 * for(let value of source){
 *  console.log(value)
 * }
 * Output: S-1,S-2,S-3,S-4,S-5
 * 
 * const source = new FlexIterator([1,2,[3,4],[5,6,[7,8,[9,10]]]],{
 *  transform:(value)=>`S-${value}`
 *  recursion:true
 * })
 * for(let value of source){
 *  console.log(value) * 
 * }
 * Output: S-1,S-2,S-3,S-4,S-5,S-6,S-7,S-8,S-9,S-10
 * 
 * 
 * 
 * @types 
 *  S: 源类型
 *  R: 返回值类型
 *  P: 当前节点的父节点类型，当
 * @param nodes 
 * @param options 
 */
export class FlexIterator<Value=any,Result=Value,Parent=any> {
    options: FlexIteratorOptions<Value,Result,Parent>
    constructor(private nodes: Iterable<Value | Iterable<any>>,options?:FlexIteratorOptions<Value,Result,Parent>) {
        this.options = Object.assign({
            recursion:false
        },options)
    }  
    [Symbol.iterator](): Iterator<Result, any, undefined> {
        let value : any
        const {pick: pick,transform,recursion} = this.options
        const transformValue = typeof(transform)=='function' ? (value:any,parent?:Parent)=>transform(value,parent) : (value:any,parent?:Parent)=>value
        const pickItemValue = typeof(pick) == 'function' ? (value:Value | Parent)=>pick(value) : (value:any)=>value
        let sources:Iterator<any>[] = [this.nodes[Symbol.iterator]()]  
        let curSource = sources[sources.length-1] as Iterator<Result, any, undefined> 
        let parentValue:Value | Iterable<any> | undefined 
        return {
            next() {                
                value =  curSource.next()
                if(value.done){
                    sources.pop()
                    if(sources.length>0){
                        curSource = sources[sources.length-1]    
                        return this.next()          
                    }else{
                        return {done: true, value: undefined} 
                    }                    
                }else{
                    let itemValue  = pickItemValue(value.value)                                            
                    while(itemValue === SKIP){
                        itemValue = curSource.next()
                        if(itemValue.done){
                            return {done: true, value: undefined} 
                        }else{
                            itemValue  = pickItemValue(itemValue.value)   
                        }                        
                    } 
                    if(recursion && canIterator(itemValue)){
                        sources.push(itemValue[Symbol.iterator]())
                        curSource = sources[sources.length-1]    
                        parentValue = value.value
                        return this.next() 
                    }else if(isPlainObject(itemValue) && 'value' in itemValue && 'parent' in itemValue){  
                        sources.push(itemValue.value[Symbol.iterator]())
                        curSource = sources[sources.length-1]    
                        parentValue = itemValue.parent
                        return this.next()
                    }else{                                           
                        return {done:false,value:transformValue(itemValue,parentValue as any)}
                    }
               }
            },
            return() {
                return {done: true, value: undefined};
            }
        
        }
    }   
}

export { SKIP } from "../consts"

// const i1 = new FlexIterator([1,2,3,4,5,6,7],{
//     pick:(value)=>value % 2 ==0 ? SKIP : value,
//     transform:(value)=>`S-${value}`
// })
// for(let value of i1){
//     console.log(value)
// }

// const i1 = new FlexIterator([1,2,3,4,5],{transform:(value)=>`S-${value}`})
// for(let value of i1){
//     console.log(value)
// }
// // Output: S-1,S-2,S-3,S-4,S-5
// console.log("---")

// const i2 = new FlexIterator([1,[2,3],[4,5]],{transform:(value)=>`S-${value}`})
// for(let value of i2){
//     console.log(value)
// }

// // Output: S-1,S-2,3,S-4,5
// console.log("---")
// const i3 = new FlexIterator([1,[2,3],[4,5]],{transform:(value)=>`S-${value}`,recursion:true})
// for(let value of i3){
//     console.log(value)
// }
// // Output: S-1,S-2,S-3,S-4,S-5
// console.log("---")
// const i4 = new FlexIterator(["A","AA","AAA","AAAA","AAAAA"],{
//     pick:(value)=>String(value.length),
//     transform:(value)=>`S-${value}`
// })
// for(let value of i4){
//     console.log(value)
// }
// // Output: S-1,S-2,S-3,S-4,S-5
// console.log("---")
// const i5 = new FlexIterator([1,[2,3],[4,5]],{
//     pick:(value)=>value,
//     transform:(value,parent)=>`S-${value} (parent=${parent})`,
//     recursion:true
// })
// for(let value of i5){
//     console.log(value)
// }
// // Output: 
// // S-1 (parent=undefined)
// // S-2 (parent=2,3)
// // S-3 (parent=2,3)
// // S-4 (parent=4,5)
// // S-5 (parent=4,5)
// console.log("---")

// // Output: S-1,S-2,S-3,S-4,S-5
// console.log("---")
// const i6 = new FlexIterator([1,[2,3],[4,5]],{
//     pick:(value)=>{
//         if(Array.isArray(value)){
//             return {
//                 value,
//                 parent:`P_${value.join("_")}`
//             }
//         }else{  
//             return value    
//         }
        
//     },
//     transform:(value,parent)=>`S-${value} (parent=${parent})`,
//     recursion:true
// })
// for(let value of i6){
//     console.log(value)
// }
// // Output: 
// // S-1 (parent=undefined)
// // S-2 (parent=2,3)
// // S-3 (parent=2,3)
// // S-4 (parent=4,5)
// // S-5 (parent=4,5)
// console.log("---")