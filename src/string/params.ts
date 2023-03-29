import { isPlainObject } from "../typecheck";
import { replaceVars } from "./replaceVars";
 
declare global {
    interface String {
        params(vars:Record<string,any> | any[] | Set<any> | Map<string,any>): string;
        params(...vars: any[]): string; 
    }
}


/**
 * 
    添加一个params参数，使字符串可以进行变量插值替换，

    基本用法：

    "this is {a}+{b}".params({a:1,b:2}) --> this is 1+2
    "this is {a}+{b}".params(1,2) --> this is 1+2
    "this is {}+{}".params([1,2]) --> this is 1+2

    
    字符
    
    当插值中包含非字符时会原样保留原始字符，例如：

    "this is {(a)}{[b]}".params({a:1,b:2}) --> this is (1)[2]
    "this is {a}{,b}".params({a:1,b:2}) --> this is 1,2
    
    处理undefined与null

    如果插件变量=undefined或null，则不输出插值占位
    "this is {(a)}{[b]}".params()  --> this is  

    如果插件变量是一个函数，则会执行

 * 
 */

export function params(str:string,...args:any):string{
    let result=str.valueOf()
    let opts:Record<string,any> = {} 
    let vars = [...args]
    // 当最后一个参数是对象并且包括$delimiter,$empty,$forFach时代表是配置参数
    if(args.length>0 && isPlainObject(args[args.length-1])){
        let lastArg = args[args.length-1]
        if("$delimiter" in lastArg || "$empty" in lastArg || "$forEach" in lastArg){
            if("$delimiter" in lastArg) opts.delimiter = lastArg.$delimiter
            if("$empty" in lastArg) opts.empty = lastArg.$empty
            if("$forEach" in lastArg) opts.forEach = lastArg.$forEach
            vars.pop()
        }
    }
    try{        
        if(vars.length==1){
            return replaceVars(result,vars[0],opts)        
        }else{
            return replaceVars(result,[...vars],opts)        
        }        
    }catch(e:any){
        return result
    }    
}  

String.prototype.params = function (this:string){
    return params(this,...arguments)
} 