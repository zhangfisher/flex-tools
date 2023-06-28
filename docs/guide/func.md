# 函数工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/func"
```


## appleParams

包装一个函数，使得函数默认调用指定的参数。

```typescript

function add(a:number,b:number){
    return a + b;
}
let fn = appleParams(add,1,1)
fn() //   == add(1,1)
```

## timeout

包装一个异步函数，使得该函数具备执行超时功能。

```typescript
timeout(fn:AsyncFunction, options:{value?:number,default?:any}={}):AsyncFunction
```

**说明**

- `value`参数用来指定超时时间
- `default`参数用来指定当超时时默认返回的值。
- 如果没有提供`default`参数，则会触发`TimeoutError`。

## memorize

包装一个函数记住最近一次调用的结果。

```typescript
function (fn:Function,options:{hash?:((args: any[]) => string) | 'length' | boolean,expires?:number}={hash:false,expires:0}) 
```

**说明**

- `hash=false`时`memorize`无效。
- `hash=true`时，会记住最近一次调用的结果。
- `hash='length'`时，会记住最近一次调用的结构,当调用参数数量变化多端时，`memorize`失效。
- `hash=(args: any[]) => string`时，可以通过动态计算出hash值来决定`memorize`是否有效。

## noReentry

包装异步函数禁止重入。

```typescript
function (fn:Function,options?:{silence?:boolean})
```
## retry

包装异步函数使得具备出错重试功能。

```typescript
function retry(this:any,fn: Function, options:{count?:number,interval?:number,default?:any}):AsyncFunction
```

**说明**

- `count`参数指重试次数
- `interval`参数指重试间隔
- `default`指出错并重试后返回的默认值。
- 当被包装函数触发以`Signal`结尾的错误时，则代表这不是一个一错误，而是一个向上传递的信号，不需要再进行重试

**示例**

```typescript
async function getData(){
    throw new Error()
}

let fn = retry(getData,{count:3,interval:1000})



class AbortSignal extends Error{}
async function getData(){
    throw new AbortSignal()
}

let fn = retry(getData,{count:3,interval:1000})
fn()            // 触发的错误是以Signal结尾的，所以不会重试



```

## reliable

包装一个函数使之同时具备`retry`、`timeout`、`noReentry`、`memorize`等功能。

```typescript
type reliableOptions={
    timeout         : number,                            // 执行失败超时,默认为1秒
    retryCount      : number,                            // 重试次数
    retryInterval   : number,                            // 重试间隔
    noReentry       : boolean,                           // 不可重入
    memorize        :  ((args: any[]) => string) | 'length' | boolean
}
function reliable(fn:AsyncFunction,options:reliableOptions):AsyncFunction
```


## safeCall

安全执行函数并对错误进行捕获，不会抛出异常。用于执行一些函数的时候不希望抛出异常。

```typescript

export function safeCall(fn:Function,args?:any[]):any;
export function safeCall(fn:Function,options?:SafeCallOptions | SafeCallCatcher):any;
export function safeCall(fn:Function,args?:any[] | SafeCallOptions | SafeCallCatcher,options?:SafeCallOptions | SafeCallCatcher):any

safeCall(fn) // 相当于 try{fn()}catch(e){}
safeCall(fn,[1,2]) // 相当于 try{fn(1,2)}catch(e){}
safeCall(fn,{catch:'throw'}) // 相当于 try{fn()}catch(e){throw e}
safeCall(fn,{catch:'ignore'}) // 相当于 try{fn()}catch(e){}
safeCall(fn,{catch:'throw',error:new MyError()}) // 相当于 try{fn()}catch(e){throw MyError}
safeCall(fn,[1,2],{default:100}) // 相当于 try{fn(1,2)}catch(e){return 100}
safeCall(fn,{default:100}) // 相当于 try{fn()}catch(e){return 100}
safeCall(fn,(e)=>1)  //  相当于 try{fn()}catch(e){return (e)=>1}

// 支持异步函数

await safeCall(asyncFn) // 相当于 try{ await asyncFn()}catch(e){}
await safeCall(asyncFn,[1,2]) // 相当于 try{ await asyncFn(1,2)}catch(e){}
await safeCall(asyncFn,{catch:'throw'}) // 相当于 try{ await asyncFn()}catch(e){throw e}
await safeCall(asyncFn,{catch:'ignore'}) // 相当于 try{ await asyncFn()}catch(e){}
await safeCall(asyncFn,[1,2],{default:100}) // 相当于 try{ await asyncFn(1,2)}catch(e){return 100}
await safeCall(asyncFn,{default:100}) // 相当于 try{ await asyncFn()}catch(e){return 100}
await safeCall(asyncFn,(e)=>1)  //  相当于 try{ await asyncFn()}catch(e){return (e)=>1}


``` 


## promisify

用来将一个依赖回调异步函数转换为一个返回`promise`的异步函数。

类似功能的库很多，比如`util.promisify`,`pify`,`thenify`等等。

- **包装nodejs标准库的异步函数**

nodejs标准库的异步函数特点是`callback`的最后一个参数是一个回调函数，该回调函数的第一个参数是错误对象，如果没有错误则为`null`。

```typescript
import fs from "node:fs"
const readFile = promisify(fs.readFile)
readFile("./timer.ts").then((content)=>{
    console.log("content:",String(content))
})
```


- **包装任意函数**

支持包括任意异步函数。需要提供`buildArgs`和`parseCallback`两个函数来处理参数和回调。


```typescript
function sum(callback:(x:number,y:number,z:number)=>void,a:number,b:number){
    if(a==0 && b==0) throw new Error("a and b can not be 0")
    callback(a,b,a+b)
}

const promisifySum = promisify(sum,{
    buildArgs:(args:any[],callback)=>{
        return [callback,...args]
    },
    parseCallback:(results:any[])=>{
        return results
    }
})
console.log(await promisifySum(1,2)) // [ 1, 2, 3 ]

try{
    await promisifySum(0,0) 
}catch(e){
    console.log(e.message) // a and b can not be 0
}
```

- `buildArgs(args:any[],callback)`参数用来指定一个函数将异步函数的参数转换为原始函数的参数。比如上例中，sum函数的原始签名是`sum(callback:(x:number,y:number,z:number)=>void,a:number,b:number)`，但是我们希望`promisifySum`的签名是`promisifySum(a:number,b:number):Promise<[number,number,number]>`，所以需要通过`buildArgs`将`promisifySum`的参数转换为`sum`的参数。
    当没有提供`buildArgs`参数时，默认值为：

    ```typescript
        (args:any[],callback:Function)=>{
            return [...args,callback]
        }
    ```
    将`callback`放在参数的最后，这是`nodejs`标准库的异步函数的参数形式。所以当我们没有提供`buildArgs`参数时，`promisify`可以直接用来包装`nodejs`标准库的异步函数。
    而当我们要包装非`nodejs`标准库的异步函数时，需要提供`buildArgs`参数。

- `parseCallback(results:any[])`参数用来指定一个函数将原始函数的回调函数的入参转换为`promise`的返回结果。比如上例中，`sum`函数的原始回调是`callback(a,b,a+b)`，但是我们希望`promisifySum`的返回结果是`[a,b,a+b]`，所以需要通过`parseCallback`将`sum`的回调结果转换为`promisifySum`的结果。

    当没有提供`parseCallback`参数时，默认值为：

    ```typescript
        const parseNodejsCallback = (results:any[])=>{
            if(results.length===0) return undefined
            if(results.length>0 && results[0]){
                throw results[0]
            }else{
                if(results.length==2) return results[1]
                return results.slice(1)
            }
        }
    ```
    该函数用来处理`nodejs`标准库的异步函数的回调结果。

- 错误处理行为: 在`nodejs`标准库的异步函数中，如果回调函数的第一个参数不为`null`，则表示发生了错误，此时`promisify`会将该错误作为`promise`的`reject`结果。而对于非`nodejs`标准库的异步函数, 错误并不一定是通过`callback`传递，也可能是直接`throw error`。为了处理这种情况，在`parseCallback`中，当出错时是通过`throw error`抛出的，`promisify`会将该错误作为`promise`的`reject`结果。
