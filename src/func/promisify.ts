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
 *      handleArgs:(...args:any[],callback)=>{  // 将callback放到最后一个参数
 *          return [args[0],callback,args[1]]
 *      }
 * })
 * 
 *  如果myFunc函数的callback不是标准nodejs callback样式,签名是这样: (a,b,err,c)=>{}
 *  
 *  则需要自己实现handleCallback
 * 
 * promisedFunc = promiseify(myfunc,{
 *      handleArgs:(...args:any[],callback)=>{  // 将callback放到最后一个参数
 *          return [args[0],callback,args[1]]
 *      },
 *      handleCallback:(results:any[])=>{
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


export type HandleArgsFunction<Args> = (args:Args,callback:(...results:any[])=>void)=>any[] 

export interface PromiseifyOptions<Args>{
    // 处理输入参数，返回最终异步函数的入参，以及callback函数参数
    // 例：nodejs的函数一般最后一个参数是callback,如fs.readFile(path,encoding,callback)
    // handleArgs:(...args:any[])=>{
    //     return [...args,callback]   // 将参数添加到最后一个
    //}
    handleArgs?:HandleArgsFunction<Args>
    handleCallback?:((results:any[])=>[ undefined| null | Error,...any[]])
}

export interface IncludeCallbackFunction {

}
 
const nodejsHandleArgs = (args:any[],callback:Function)=>{
    return [...args,callback]
}
const nodejsHandleCallback = (results:any[])=>{
    return [results[0],...results.slice(1)]
}


/**
 * 
 * Args: 指的是异步函数的参数类型， 不是原始函数的参数类型
 * Result: 指的是异步函数的返回值类型
 * 
 * @param fn  
 * @param options 
 * @returns 
 */
export function promisify<Result=any,Args extends any[]=any[]>(fn:(...args:any)=>any,options?:PromiseifyOptions<Args>){
    const { handleArgs,handleCallback } = Object.assign({
        handleArgs:nodejsHandleArgs,
        handleCallback:nodejsHandleCallback
    },options) as Required<PromiseifyOptions<Args>>
    return function(...args:Args){
        return new Promise<Result>((resolve,reject)=>{
            let callArgs = handleArgs(args,(...results:any[])=>{
                const [err,...rest]  = handleCallback(results)
                if(err){
                    reject(err)
                }else{
                    resolve((rest.length==1 ?  rest[0] :  rest )as Result)
                }
            }) 
            try{
                fn(...callArgs)
            }catch(e){
                reject(e)
            }
        })
    }
}




import fs from "node:fs"
const readFile = promisify<string>(fs.readFile)

readFile("./timer.ts").then((content)=>{
    console.log("content:",String(content))
})


function sum(callback:({result}:{result:number})=>void,a:number,b:number){
    console.log(`${a}+${b}=`,a+b)
    callback({result:a+b})
}

const promisifySum = promisify(sum,{
    handleArgs:(args:any[],callback)=>{
        return [callback,...args]
    },
    handleCallback:(...results:any[])=>{
        return [null,results]
    }
})

promisifySum(1,2).then((result)=>{
    console.log("sum result:",result)
}).catch(e=>{
    console.log("sum error:",e.message)
})