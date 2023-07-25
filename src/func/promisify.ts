/**
 * 
 * 封装一个任意支持callback的同步函数为异步函数
 * 
 * 
 * 
 * 
 * promiseify(fs.readFile)('package.json', 'utf8').then().catch()
 * 
 * 
 * // 比如myFunc函数的第二个参数是callback，那么可以这样使用
 * function myfunc(a,callback,options){  
 * } 
 * 
 * promisedFunc(a,options).then().catch()
 * 
 * 
 * promisedFunc = promiseify(myfunc,{
 *      buildArgs:(...args:any[],callback)=>{  // 将callback放到最后一个参数
 *          return [args[0],callback,args[1]]
 *      }
 * })
 * 
 *  如果myFunc函数的callback不是标准nodejs callback样式,签名是这样: (a,b,err,c)=>{}
 *  
 *  则需要自己实现handleCallback
 * 
 * promisedFunc = promiseify(myfunc,{
 *      buildArgs:(...args:any[],callback)=>{  // 将callback放到最后一个参数
 *          return [args[0],callback,args[1]]
 *      },
 *      parseCallback:(results:any[])=>{
 *          return [results[2],results[0],results[1],results[3]]
 *      })
 * })
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */ 

 import type { AsyncFunction } from '../types/asyncFunction';

export type BuildArgsFunction<Args> = (args:Args,callback:(...results:any[])=>void)=>any[] 

export interface PromiseifyOptions<Func extends (...args: any) => any>{
    // 处理输入参数，返回最终异步函数的入参，以及callback函数参数
    // 例：nodejs的函数一般最后一个参数是callback,如fs.readFile(path,encoding,callback)
    // buildArgs:(...args:any[])=>{
    //     return [...args,callback]   // 将参数添加到最后一个
    //}
    buildArgs?:BuildArgsFunction<Parameters<Func>>
    parseCallback?:(results:any[])=>any
}

export interface IncludeCallbackFunction {

}
 
const buildNodejsArgs = (args:any[],callback:Function)=>{
    return [...args,callback]
}
const parseNodejsCallback = (results:any[])=>{
    if(results.length===0) return undefined
    if(results.length>0 && results[0]){
        throw results[0]
    }else{
        if(results.length==2) return results[1]
        return results.slice(1)
    }
}


/**
 * 
 * 
 * @param fn  
 * @param options 
 * @returns 
 */

export function promisify<PromisedFunc extends (...args:any[])=>any = AsyncFunction>(fn:(...args:any)=>any,options?:PromiseifyOptions<PromisedFunc>){
    const { buildArgs,parseCallback } = Object.assign({
        buildArgs:buildNodejsArgs,
        parseCallback:parseNodejsCallback
    },options) as Required<PromiseifyOptions<PromisedFunc>>
    const promisifyed = function(...args:any[]){
        return new Promise<any>((resolve,reject)=>{
            let callArgs = buildArgs(args as any,(...results:any[])=>{
                try{
                    const result = parseCallback(results)
                    resolve(result)
                }catch(e){
                    reject(e)
                }
            }) 
            try{
                fn(...callArgs)
            }catch(e){
                reject(e)
            }
        })
    }
    
    return  promisifyed as PromisedFunc
}
 

// import fs from "node:fs"
// const readFile = promisify<string>(fs.readFile)

// readFile("./retry.ts").then((content)=>{
//     console.log("content:",String(content))
// })


// function sum(callback:(x:number,y:number,z:number)=>void,a:number,b:number){
//     if(a==0 && b==0) throw new Error("a and b can not be 0")
//     callback(a,b,a+b)
// }

// const promisifySum = promisify(sum,{
//     buildArgs:(args:any[],callback)=>{
//         return [callback,...args]
//     },
//     parseCallback:(results:any[])=>{
//         return results
//     }
// })

// promisifySum(1,2).then((result)=>{
//     console.log("sum result:",result)
// })  


// promisifySum(0,0).catch((e:Error)=>{
//     console.log("sum error:",e.message)
// }) 




// import fs from "node:fs"
// import path from "node:path"

// const fileExists = promisify(fs.exists,{
//     parseCallback(results) {
//         return results[0]
//     },
// })
// const readFile = promisify(fs.readFile)
// const writeFile = promisify(fs.writeFile)
// const mkdir = promisify(fs.mkdir)

// async function main(){
//     console.log("-------------------")
//     const file = path.join(__dirname,"promisify.ts")
//     console.log("promisify.ts is exists: ",await fileExists(file))
//     console.log("promisify.ts content: ",await readFile(file))
//     console.log("mkdir: ",await mkdir("dir"))

// }

// main().then(()=>{}).catch((e)=>{
//     console.log(e.stack)
// })

