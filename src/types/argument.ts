
/**
 * 
 * 提取函数的第n个参数的类型 
 * 
 * 
function fn(a:number,b:boolean,c:string){

}


type arg1 = Argument<typeof fn,0>  == number
type arg2 = Argument<typeof fn,1>  == boolean
type arg3 = Argument<typeof fn,2>  == string
type arg3 = Argument<typeof fn,-1> == string

 */

import { LastArgument } from "./lastArgument";


export type Argument<T extends (...args:any[])=>any,index extends number> = index extends -1 ? LastArgument<T> : Parameters<T>[index]
