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


