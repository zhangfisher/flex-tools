# 指南

# 字符串

字符串增强函数均支持两个版本：

- **原型版本**：

函数被直接添加在`String.prototype`，因些需要导入就可以直接使用不需要额外导入。

```typescript
// 导入所有字符串的原型方法
import "flex-tools/string"              
// 只导入部份方法原型方法
import "flex-tools/string/params"
import "flex-tools/string/center"
import "flex-tools/string/firstUpper"
import "flex-tools/string/ljust"
import "flex-tools/string/rjust"
import "flex-tools/string/reverse"
import "flex-tools/string/trimBeginChars"
import "flex-tools/string/trimEndChars"

```
- **函数版本**

如果您不希望污染`String.prototype`,可以使用单独导入函数。

```typescript
// 导入所有字符串的原型方法
import {
    params,
    center,
    firstUpper,
    ljust,
    rjust,
    reverse,
    trimBeginChars,
    trimEndChars
} from "flex-tools/string"              
// 只导入部份方法原型方法
import { params } from "flex-tools/string/params"
import { center } from "flex-tools/string/center"
import { firstUpper } from "flex-tools/string/firstUpper"
import { ljust } from "flex-tools/string/ljust"
import { rjust } from "flex-tools/string/rjust"
import { reverse } from "flex-tools/string/reverse"
import { trimBeginChars } from "flex-tools/string/trimBeginChars"
import { trimEndChars } from "flex-tools/string/trimEndChars"
```

## params

非常强大的对字符串进行变量插值。
 
- **插值占位符**

在对字符串进行变量插值时，与一般的变量插值不同，我们还支持**指定额外的前缀和后缀修饰**，插值占位的完整格式如下：

!> `{`<前缀>变量名称<后缀>`}`

- **前缀**: 可选，使用`<前缀内容>`形式，前缀内容会原样输出
- **变量**: 可选的，普通变量字面量，如果省略，则只能使用位置插值方式进行
- **后缀**: 可选，使用`<后缀内容>`形式，前缀内容会原样输出


- **字典插值**

```typescript
"this is {a}+{b}".params({a:1,b:2})                 // == "this is 1+2"
"{a}+{b}={c}".params({a:1,b:1,c:2})                 // == "1+1=2"
"{<#>a}+{b<%>}={<<>c<>>}".params({a:1,b:1,c:2})     // == "#1+1%=<2>"
"{a}+{b}={c}".params({a:()=>1,b:()=>1,c:()=>2})     // == "1+1=2"
"{a}+{b}={c}".params({a:1,b:1,c:null},{empty:"空"}) // == "1+1=空"
"{a}+{b}={c}".params({a:undefined,b:null})          // == "+="
// 如果变量值是[],则自动使用,分割
"this is {a}+{b}".params({a:1,b:[1,2]})                 // == "this is 1+1,2"
// 如果变量值是{},则自动使用,分割
"this is {a}".params({a:{x:1,y:2}})                 // == "this is x=1,y=2"
```

- **位置插值**

```typescript
"this is {a}+{b}".params([1,2])                 // == "this is 1+2"
"{a}+{b}={c}".params([1,1,2])                 // == "1+1=2"
"{<#>a}+{b<%>}={<<>c<>>}".params([1,1,2])     // == "#1+1%=<2>"
"{a}+{b}={c}".params([()=>1,()=>1,()=>2])     // == "1+1=2"
"{a}+{b}={c}".params([1,1,null],{empty:"空"}) // == "1+1=空"
"{a}+{b}={c}".params([undefined,null])          // == "+="
"{<Line:>name}".params(12)    // =="Line:12"    
"{<file size:>size<MB>}".params(12)    // =="file size:12MB"    
```
位置插值内容除了使用`[]`形式外，还支持位置参数：

```typescript
"this is {a}+{b}".params(1,2)                 // == "this is 1+2"
"{a}+{b}={c}".params(1,1,2)                 // == "1+1=2"
"{<#>a}+{b<%>}={<<>c<>>}".params(1,1,2)     // == "#1+1%=<2>"
"{a}+{b}={c}".params(()=>1,()=>1,()=>2)     // == "1+1=2"
"{a}+{b}={c}".params(1,1,null,{empty:"空"}) // == "1+1=空"
"{a}+{b}={c}".params(undefined,null)          // == "+="
"{<Line:>name}".params(12)    // =="Line:12"    
"{<file size:>size<MB>}".params(12)    // =="file size:12MB"    
```

- **处理空值**

当插值变量为`undefined`和`null`时，默认整个插值内容均不输出。

```typescript
"My name is {name}".params()        //=="My name is "         
"My name is {<[> name <]>}".params(null)      // =="My name is "
"My name is {<[>name<]>}".params("tom")        //=="My name is [tom]"         
```

根据这个特性，就可以在进行日志输出时更加灵活地处理空值。比如:

```typescript
// 变量未定义:module=control
"{error}:{<Module=>module}{<,Line=>line}".params({error:'变量未定义',module:'control'})
// Line前的,只有有提供line变量时才会输出
// 变量未定义:module=control,Line=12
"{error}:{<Module=>module}{<,Line>=line}".params({error:'变量未定义',module:'control',line:12})
```

也可以在`params`的最后一个参数中指定`{empty:"无"}`来配置当插值变量为`undefined`和`null`时，如何处理空值。

```typescript
"My name is {name}".params({$$empty:"未知"})        //=="My name is 未知"         
"My name is {<[> name <]>}".params(null,{$$empty:"未知"})      // =="My name is [未知]"
```


- **控制参数**

`params`方法支持传入一些控制参数：

- `$$empty:string | null`: 当变量值为空时(undefined,null,[],{})显示的内容，如果为null则不显示.
- `$$delimiter:string`: 当变量值是`[]`或`{}`时，使用该分割来连接内容，默认值是`,`。如:
    ```typescript
        "{a}".params({a:[1,2]})   //=="1,2"
        "{a}".params({a:[1,2]},{$$delimiter:"_"})   //=="1_2"
        "{a}".params({a:{x:1,y:2}})   // =="x=1,y=2"
        "{a}".params({a:{x:1,y:2}},{$$delimiter:"#"})   // =="x=1#y=2"
    ```
- `$$forEach:(name:string,value:string,prefix:string,suffix:string)=>[string,string,string ]`: 提供一个函数对插值变量进行遍历
    ```typescript
        "{a}{b}{<#>c<#>}".params(
           {a:1,b:2,c:3}, 
           {
                $$forEach:(name:string,value:string,prefix:string,suffix:string):[string,string,string ]=>{
                    console.log(name,value,prefix,suffix)
                    return [prefix,value,suffix]            // 分别返回前缀，变量值，后缀
                }
           }
        ) 
        // 控制台输出： 
        // a 1 
        // b 2 
        // c 3 # # 
    ```
    利用`$$forEach`的机制，可以实现一些比较好玩的特性，比如：
    ```typescript
        import logsets from "logsets"
        const result = "{a}{b}{<#>c<#>}".params(
           {a:1,b:2,c:3}, 
           {
                $$forEach:(name:string,value:string,prefix:string,suffix:string):[string,string,string ]=>{
                    let colorizer = logsets.getColorizer("red")
                    return [prefix,colorizer(value),suffix]            // 分别返回前缀，变量值，后缀
                }
           }
        )  
        console.log(result) // 可以将插值内容输出为红色
    ```


**特别注意:**为了避免参数与插值变量冲突，约定当`params`的最后一个参数是`{$$empty,$$delimiter,$$forFach}`时代表配置参数。

## replaceVars

`replaceVars`是`String.prototype.params`的内部实现，功能一样。其函数签名如下：

> `function replaceVars(text:string,vars:any,options?:{empty?:string | null,delimiter?:string}):string` 


```typescript
console.log(replaceVars("{a}+{b}={c}",{a:1,b:1,c:2})) // Output: "1+1=2"       
```

## firstUpper

将首字母变为大写。
```typescript
    "abc".firstUpper() // ==Abc
```
## ljust

输出`width`个字符，字符左对齐，不足部分用`fillChar`填充，默认使用空格填充。

```typescript
"abc".ljust(10) // "abc       "
"abc".ljust(10,"-") // "abc-------"
```

## rjuest

输出`width`个字符，字符右对齐，不足部分用`fillChar`填充，默认使用空格填充。

```typescript
"abc".rjust(10) // "       abc"
"abc".rjust(10,"-") // "-------abc"
```

## center

输出`width`个字符，字符串居中，不足部分用`fillChar`填充，默认使用空格填充。

```typescript
"abc".rjust(7) // "  abc  "
"abc".rjust(7,"-") // "--abc--"
```

## trimBeginChars

截断字符串前面的字符

```typescript
 "abc123xyz".trimBeginChars("abc") // == "123xyz"

 // 从123开始向前截断
"abc123xyz".trimBeginChars("123") // == "xyz"
// 只截断最前的字符==123
"abc123xyz".trimBeginChars("123",true) // == "abc123xyz"
"123abc123xyz".trimBeginChars("123",true) // == "abc123xyz"


```

## trimEndChars

截断字符串未尾的字符

```typescript
"abc123xyz".trimEndChars("xyz") // == "abc123"
// 从123开始向后截断
"abc123xyz".trimEndChars("123") // == "abc"
// 只截断最后的字符
"abc123xyz".trimEndChars("123",true) // == "abc123xyz"
"abc123xyz123".trimEndChars("123",true) // == "abc123xyz"


```


## reverse

反转字符串
```typescript
"123".reverse() // == "321" 

```

# 类型检查

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/typecheck"
```

## inheritedOf

判断cls是否继承自baseClass

```typescript
inheritedOf(cls: Class, baseClass:Class):boolean 
```

## isAsyncFunction

判断一个函数是否是异步函数。

```typescript
isAsyncFunction(fn:any):boolean
```
## isClass

判断一个对象是否是一个类

```typescript
isClass(cls:any):boolean
```
## isGeneratorFunction

判断是否是一个生成器函数

```typescript
isGeneratorFunction(fn:any):boolean
```
## isInteger

判断一个字符串是否是一个整形数。isNumber无法判断字符串的形式。

```typescript
isInteger(value:any):boolean
```


## isPlainObject

判断一个对象是否是原始的对象`{}`

```typescript
isPlainObject(obj:any):boolean
```

## isNothing

判断变量是否是为空

```typescript
isNothing(value:any):boolean

isNothing("") == true
isNothing(null) == true
isNothing(undefined) == true
isNothing({}) == true
isNothing([]) == true
isNothing(new Set()) == true
isNothing(new Map()) == true
```

## isNumber

判断是否是数字，可以判断字符串内容是否是数字。

```typescript
isNumber(value:any):boolean
```

## isSerializable

判断对象是否可以被序列化
```typescript
isSerializable(value:any):boolean
```

## canIterable
判断指定对象是否可以迭代

```typescript
canIterable(obj:any):boolean
```


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

# 对象工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/object"
```


## safeParseJson

使用`JSON.parse`解决JSON字符串时，对格式的得严格的要求，比如`JSON.parse("{a:1}")`就会失败，因为JSON标准比较严格，要求键名和字符串必须使用`"..."`包起来。`safeParseJson`方法能可以更好地兼容一些非标JSON字符串。

```typescript
function safeParseJson(str:string)
```

## assignObject

与`Object.assign`一样的功能，主要差别在于：

- 对值为`undefined`的处理方式不同。
- 排除掉一些字段,`assignObject({...},{...},{[EXCLUDE]:[字段列表]})`等效于`lodash/omit`
- 只包括某些字段,`assignObject({...},{...},{[INCLUDE]:[字段列表]})`等效于`lodash/pick`

```typescript

Object.assign({a:1},{a:undefined}) // == {a:undefined})
// 由于a==undefined所有不会被合并，这样就保留了a的值
assignObject({a:1},{a:undefined}) // == {a:1})


import { EXCLUDE,INCLUDE } from "flex-tools/object"
// 排除a,b,c字段
assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[EXCLUDE]:["a", "b", "c"]}) 
// == {e:5,f:6}

// 只包含a,b,c字段
assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[INCLUDE]:["a", "b", "c"]},{a:1}) 
// == {a:1,b:2,c:3}

```

此功能在处理函数的对象参数时有用，例：

```typescript

function test(x:number,options:{a:string,b:number}){
    // 为配置参数提供默认值
    let opts = Object.assign({
        a:"x",b:1
    },options)  
    // 以上方法有个问题，如果传入的options中包含{a:undefined}，则会导致a没有默认值
    // 此时，可以就可以使用assignObject
    let opts = assignObject({
        a:"x",b:1
    },options)  
}

```

## get

类似`lodash/get`,根据路径来返回对象成员值。


```typescript
 

export interface getByPathOptions{
    defaultValue?:any                       // 默认值
    ignoreInvalidPath?:boolean              // 忽略无效路径,返回undefine或者defaultValue，否则触发错误
    matched?:  ({value,parent,indexOrKey}:{value?:any,parent?:object | any[],indexOrKey?:string | symbol | number})=>void        // 当匹配到路径时的回调
}


  const obj = {
        a:{
            b1:{b11:1,b12:2},
            b2:{b21:1,b22:2},
            b3:[
                {b31:1,b32:2},
                {b31:1,b32:2}
            ]            
        },
        x:1,
        y:[1,2,3,4,5,{m:1,n:2}],
        z:[1,2,3,new Set([1,2,3,4,5]),[1,[2,3,4,],2,4]]
    }    
   get(obj,"a.b1.b11")              // == 1
   get(obj,"a.b3[0].b31")           // == 1
   get(obj,"a.b3[1].b31")           // == 1
   get(obj,"a.b3[1].b32")           // == 2
   get(obj,"a.b3.[1].b31")          // == 1
   get(obj,"a.b3.[1].b32")          // == 2
   get(obj,"x")                     // == 1
   get(obj,"y[0]")                  // == 1
   get(obj,"y[1]")                  // == 2
   get(obj,"y[5].m")                // == 1
   get(obj,"y[5].n")                // == 2
   get(obj,"z[3].[0]")              // == 1
   get(obj,"z[3][0]")               // == 1
   get(obj,"z[4][1][1]")            // == 3
```

- `defaultValue`参数可以用来指定一个默认值，当输入一个无效的路径时返回该默认值
- 如果`ignoreInvalidPath=false`，则当输入一个无效的路径时会触发错误`InvalidPathError`，而不是返回默认值。
- 当输入路径成功匹配到时会调用`matched`函数。 以下`set`函数就是利用此回调来实现的。

## set

类似`lodash/set`,根据路径来更新对象成员值。

```typescript

interface setByPathOptions{
    onlyUpdateUndefined?:boolean
}
function set(obj:object,path:string,value:any,options?:setByPathOptions):object;

    const obj = {
        a:{
            b1:{b11:1,b12:2},
            b2:{b21:1,b22:2},
            b3:[
                {b31:1,b32:2},
                {b31:1,b32:2}
            ]            
        },
        x:1,
        y:[1,2,3,4,5,{m:1,n:2}],
        z:[1,2,3,new Set([1,2,3,4,5]),[1,[2,2,2,],2,4]]
    }        
    get(set(obj,"a.b1.b11",2),"a.b1.b11")               // == 2
    get(set(obj,"a.b3[0].b31",22),"a.b3[0].b31")        // == 22
    get(set(obj,"a.b3[1].b31",33),"a.b3[1].b31")        // == 33
    get(set(obj,"a.b3[1].b32",44),"a.b3[1].b32")        // == 44
    get(set(obj,"a.b3.[1].b31",55),"a.b3.[1].b31")      // == 55
    get(set(obj,"a.b3.[1].b32",55),"a.b3.[1].b32")      // == 55
    get(set(obj,"x",2),"x")                             // == 2
    get(set(obj,"y[0]",3),"y[0]")                       // == 3
    get(set(obj,"y[1]",4),"y[1]")                       // == 4
    get(set(obj,"y[5].m",5),"y[5].m")                   // == 5
    get(set(obj,"y[5].n",6),"y[5].n")                   // == 6

```

- 当`onlyUpdateUndefined=true`时，则仅当原始值是`undefined`时才会更新。默认值为`false`。

## deepMerge

深度合并两个对象。

```typescript
deepMerge(toObj:any,formObj:any,options:DeepMergeOptions)

interface DeepMergeOptions{
    // 数组合并策略，0-替换，1-合并，2-去重合并
    array?:'replace' | 'merge' | 'uniqueMerge',    
    // 忽略undefined项不进行合并
    ignoreUndefined?: boolean     
    // 是否返回新对象或者合并
    newObject?:boolean            
}
```

deepMerge支持以下参数:

- `array`
决定如何合并数组,与`lodash/merge`的区别在于对数组成员的合并处理机制不同,`array`参数可以指定如何对数据进行合并。
    - `array='replace'`: 替换原始数据项
    - `array='merge'`:  合并数组数据项
    - `array='noDupMerge'`:  合并数组数据项，并且进行去重
- `ignoreUndefined`
忽略掉`fromObj`中的`undefined`项。
- `newObject`
默认情况下，`deepMerge`不会改变原始值，而是生成一个新的对象。如果需要直接修改`toObj`值，则应该设置`newObject=false`。

## getPropertyNames

 获取指定对象的所有包含原型链上的所有属性列表  

 ```typescript
function getPropertyNames(obj: any)
```

## forEachObject

遍历对象成员,对每一个成员调用`callback`函数。

```typescript
forEachObject(obj:object | any[],callback:IForEachCallback,options?:ForEachObjectOptions)
interface ForEachObjectOptions{
    keys?:string[]                              // 限定只能指定的健执行callback
}
type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:any[] | object | null,keyOrIndex?:string | number | null})=>any
```

**说明:**

- 遍历过程中在`callback`中返回`ABORT`常量则中止遍历。
- `keys`参数可以用来指只对指定的键名执行`callback`


## forEachUpdateObject

深度遍历对象成员,当值满足条件时,调用`updater`函数的返回值来更新值

```typescript
type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:any[] | object | null,keyOrIndex?:string | number | null})=>any   
function forEachUpdateObject<T=any>(obj:any[] | object,filter:IForEachCallback,updater:IForEachCallback):T
```

**说明:**

- 遍历过程中在`callback`中返回`ABORT`常量则中止遍历。
- 示例：
```typescript
// 将所有字符串转换为大写
 let data ={a:1,b:2,l:[1,2,3],c:"xx"}
 forEachUpdateObject(data,({value,parent,keyOrIndex})=>{     
      return typeof(value)=="string"    // 只处理字符串值
 },({value,parent,keyOrIndex})=>{         
       return value.toUpperCase()       // 将值更新为大写
 })
```
## mapObject

映射对象值生成新的对象，不支持嵌套

```typescript
export function mapObject<T=any>(obj:Record<string,T>,callback:(value:T,key?:string)=>T,keys?:string[]){
```

**示例**
```typescript
 data = {a:1,b:2}
 mapObject(data,(k,v)=>v+1)   == {a:2,b:2}
```

## searchObject

遍历对象，对每一个成员调用`matcher`,如果`matcher`返回`true`，则返回`picker({value,keyOrIndex,parent})`

```typescript

export type SearchObjectOptions = ForEachObjectOptions & {
    matchOne?:boolean
}
export function searchObject<T=any>(obj:any[] | object,matcher:IForEachCallback,picker?:IForEachCallback,options?:SearchObjectOptions):T | T[]{
```
**说明**

- `matchOne`参数用来指定只搜索匹配一个就退出


**示例**
```typescript
  searchObject({
       a:1，
       b:{x:1,y:2}
  },({value,keyOrIndex,parent})=>{
       return value==2
  },({value,keyOrIndex,parent})=>{
       return keyOrIndex            // 当值=1时返回y
       return value                 // 当值=1时返回{x:1,y:2}
  })
```

## serializableObject

处理对象成为可序列化的数据，基本原理是将对象里面所有不可序列化的项（如函数）删了。

```typescript
function serializableObject(data:any[] | object){
```

## setObjectDefault

使用`src`来为`target`设置默认值。

```typescript
function setObjectDefaultValue(target:any,src:any)
```

**说明**

-  仅当`target`中不存在的key或`target`值为`undefined`时，将`src`中的对应项更新到`target`.

## isDiff

以`baseObj`为基准判断两个对象值是否相同，值不同则返回false 
以`baseObj`为基准的意思是，只对`refObj`中与`baseObj`相同键名的进行对比，允许`refObj`存在不同的键名

```typescript
function isDiff(baseObj:Record<string,any> | [], refObj:Record<string,any> | [],isRecursion:boolean=false):boolean
```

## selfUpdate

根据输入路径和特定的语法更新对象值。例如：`selfUpdate(data,"a","+2") `将`data.a`值`+2`。

```typescript
function selfUpdate(obj:object,path:string,operate:string | string[])
```

**示例**

```typescript

let data
function resetData(){
    data = {
        a:1,
        b:true,
        c:[1,2,3,4],
        d:["a","b","c"],
        e:{
            a:1,b:2
        },
        f:{
            x:"abc",y:"def"
        },
        s:"abc"
    }
}

function assertEqual(expr,expectValue,actualValue){
    if(JSON.stringify(expectValue) == JSON.stringify(actualValue)){
        console.log(expr,"\texpect =",JSON.stringify(expectValue),"\t actual=",JSON.stringify(actualValue))
    }else{
        console.error(expr,"\texpect =",JSON.stringify(expectValue),"\t actual=",JSON.stringify(actualValue))
    }
    resetData()
}

// 数字
selfUpdate(data,"a","+2") ; assertEqual("+2",3,data.a)
selfUpdate(data,"a","-2") ; assertEqual("-2",-1,data.a)
selfUpdate(data,"a","1=-2"); assertEqual("1=-2",-1,data.a)
selfUpdate(data,"a","&2=-2"); assertEqual("&2=-2",1,data.a)
selfUpdate(data,"a",["&2=0","&1=9"]); assertEqual('["&2=0","&1=9"]',9,data.a)
selfUpdate(data,"a","&1=100"); assertEqual('&1=100',100,data.a)
selfUpdate(data,"a","-2") ; assertEqual("-2",-1,data.a)
selfUpdate(data,"a",">1") ; assertEqual(">1",0,data.a)

// 布尔
selfUpdate(data,"b","&false"); assertEqual("&false",false,data.b)
selfUpdate(data,"b","!"); assertEqual("!",false,data.b)

// 字符串
selfUpdate(data,"s","+xyz"); assertEqual("+xyz","abcxyz",data.s)
selfUpdate(data,"s","1=>xyz"); assertEqual("1=>xyz","axyzbc",data.s)
selfUpdate(data,"s","1=-xyz"); assertEqual("1=-xyz","axyz",data.s)

// 数组
selfUpdate(data,"c","1=9"); assertEqual("1=9",[1,9,3,4],data.c)
selfUpdate(data,"c","1=+1"); assertEqual("1=+1",[1,3,3,4],data.c)
selfUpdate(data,"c","1=-1"); assertEqual("1=-1",[1,1,3,4],data.c)
selfUpdate(data,"c","&2=+1"); assertEqual("&2=+1",[1,3,3,4],data.c)  // 将值=2的项+1
selfUpdate(data,"c","1=>1"); assertEqual("1=>1",[1,1,3,4],data.c)

// 字符串数组
selfUpdate(data,"d","1=+1"); assertEqual("1=>1",["a","b1","c"],data.d)
selfUpdate(data,"d","1=>0"); assertEqual("1=>0",["a","0b","c"],data.d)
selfUpdate(data,"d","1=1=+xyz"); assertEqual("1=1=+xyz",["a","bxyz","c"],data.d)

// 对象
selfUpdate(data,"e","a=+1"); assertEqual("a=+1",{a:2,b:2},data.e)
selfUpdate(data,"f","x=+000"); assertEqual("x=+000",{x:"abc000",y:"def"},data.f)
selfUpdate(data,"f","y=1=>000"); assertEqual("y=1+000",{x:"abc",y:"d000ef"},data.f)
```


## mixinProperties

本方法可以用来为类或实例混入属性/方法等

```typescript
function mixinProperties(target:any, source:any,  options?:MixinPropertiesOptions)
 interface MixinPropertiesOptions{
    excludes?: string[]                                             // 排除的字段名称列表
    injectStatic?:boolean                                           // 是否注入静态变量,当source是一个类时,确认如何处理静态变量
    conflict?: ConflictStrategy                                     // 冲突处理策略
}
type ConflictStrategy ='ignore' | 'replace' | 'merge' | 'error' | ((key:string, target:object, source:object)=>'ignore' | 'replace' | 'merge' | 'error' | undefined)
```

**说明**

- `excludes`用来忽略某些字段不进行混入
- `injectStatic`参数用来指定是否将`source`的静态变化注入目标类中
- `conflict`用来处理当混入时名称冲突的处理策略：
    - `ignore`: 忽略该字段
    - `replace`: 替换原始成员
    - `merge`: 如果有目标是数组或{}则进行深度合并。
    - `error`: 触发错误
    - 指定`(key:string, target:object, source:object)=>'ignore' | 'replace' | 'merge' | 'error' | undefined`函数来动态指定冲突处理策略。

## pick

提取对象中的指定键并返回新的对象。功能等效于`lodash/pick`+`lodash/pickBy`

> `pick(source:Record<any,any>,keys:ItemPicker,defaultValues?:Record<any,any>) `

```typescript
  pick({a:1,b:2,c:3},"a")  // == {a:1}
  pick({a:1,b:2,c:3},["a","b"])  // == {a:1,b:2} 
  pick({a:1,b:2,c:3},(k,v)=>{
       return k =='a'           // 只提取k=a的项
  } )  // == {a:1}
```

- `defaultValues`：提供一个默认值，当所输入的键不存在时使用。

## omit

排除对象中的指定键，功能等效于`lodash/omit`+`lodash/omitBy`。

> `omit(source:Record<string | symbol,any>,keys:ItemPicker,returnNewObject?:boolean)`

```typescript

    let obj = {a:1,b:2,c:3,d:4}
    omit(obj,"a")                   // == {b:2,c:3,d:4}
    omit(obj,["a","b"])             // == {c:3,d:4}
    omit(obj,(k,v)=>{
          return k =='a'
    })                  // == {b:2,c:3,d:4} 
    console.log(obj)// {a:1,b:2,c:3,d:4}
    omit(obj,"a",false)// {b:2,c:3,d:4}
    // 原始对象改变了
    console.log(obj)// {b:2,c:3,d:4}

```

- `returnNewObject`： 控制是否返回一个新的对象,默认为`true`


## hasCircularRef

返回指定的对象是否存在循环引用。

# 树工具

树数据结构是非常常见的，比较常见的有两种数据结构来表示树。

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/tree"
```


```typescript
// 嵌套树结构
const tree = {
    id:1,
    name:"a",
    children:[
        {id:2,name:"b"},
        {id:3,name:"c"}
    ]
}
// pid树结构
const tree = [
    [id:1,pid:null,name:"a"],
    [id:2,pid:1,name:"b"],
    [id:3,pid:1,name:"c"],
]
```

两种树结构各有优缺点,在实际项目均有应用,我们提供了一系工具函数来处理树结构。

为了提供统一的树操作体验，我们约定：

- 每一个树节点均具有唯一ID
- 每一个树节点均具有可选的`children`字段数组来用表示子节点
- 如果约定`id`、`children`字段名称不符合要求同，以下大部份的API均可以通过`options.idKey`和`options.childrenKey`来指定这两个核心字段的键名称。
- `id`、`children`字段也支持通过泛型指定字段名称.

## getById

通过节点Id返回节点数据

```typescript
getById<Node extends TreeNode = TreeNode,IdKey extends string = "id">(treeObj:Node | Node[],nodeId:Node[IdKey],options?:GetByIdOptions):Node | null  
```

## getByPath

通过路径名称（如`a/b/c`）返回指定的节点对象。

```typescript
function getByPath<Node extends TreeNode = TreeNode>(treeObj:Node | Node[],fullpath: string,options?:GetByPathOptions):Node | undefined 
```

**示例**

```typescript
const tree = {
    id:1,
    name:"a",
    children:[
        {id:2,name:"b"},
        {id:3,name:"c"}
    ]
} 
getByPath(treeData,"a/b")           // == {id:2,name:"b"
// 指定路径采用id值进行组合
getByPath(treeData,"1/2",{pathKey:"id"})           // == {id:2,name:"b"
```

## forEachTree

采用深度优先的方法遍历树节点。

```typescript
function forEachTree<Node extends TreeNodeBase = TreeNode>(treeData:Node[] | Node,callback:IForEachTreeCallback<Node>,options?:ForEachTreeOptions)
interface ForEachTreeOptions extends TreeNodeOptions{
    startId?:string | number | null                 // 从哪一个节点id开始进行遍历
 }
type IForEachTreeCallback<Node> = ({node,level,parent,path,index}:{node:Node,level:number,parent:Node | null,path:string,index:number})=> any

```

**说明**

- 遍历过程中可以在`callback`中返回`ABORT`来中止遍历。
- `callback`提供四个参数，分别是`node=<当前节点>`,`level=<节点层级>`,`parent=<父节点>`,`path=<当前节点的路径>`,`index=<子节点序号>`}。
-  `startId`参数可以用来指定遍历起点。

## mapTree

转换树结构。

```typescript
function mapTree<FromNode extends TreeNodeBase = TreeNode,ToNode extends TreeNodeBase = FromNode>(treeData:FromNode[] | FromNode,mapper:ITreeNodeMapper<FromNode,ToNode>,options?:MapTreeOptions):ToNode[] | ToNode

type ITreeNodeMapper<FromNode,ToNode> = ({node,parent,level,path,index}:{node:FromNode,parent:FromNode | null,level:number,path:any[],index:number})=>ToNode

interface MapTreeOptions extends TreeNodeOptions{
    from?:{
        idKey?:string,childrenKey?:string
    }
    to?:{
        idKey?:string,childrenKey?:string
    }
}
```

**示例**

```typescript
    type mapedBook = TreeNode<{ key: string; name: string; level: number; path: string},'key','books'>
    let mapedTree = mapTree<Book,mapedBook >(
        Object.assign({}, books),
        ({ node, level, parent, path }) => {
            return {
                key:String(node.id),
                name: node.title,
                level: level,
                path: path.join("/")
            }
        }, { 
            pathKey: "title",
            to:{
                idKey:'key',childrenKey:"books"
            } 
        }) as mapedBook

```

## searchTree

遍历树的每一个节点，执行`mather({node,level,parent,path,index})`，如果返回`true`，则调用`picker({node,level,parent,path,index})`函数返回结果

```typescript
function serachTree<Node extends TreeNode=TreeNode,Returns=Node[]>(treeData:Node[] | Node,matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions):Returns[]
interface SerachTreeOptions extends TreeNodeOptions,ForEachTreeOptions {
    matchOne?:boolean               //   只匹配一个就退出搜索
}
```

## removeTreeNodes

删除满足条件的节点

```typescript
function removeTreeNodes<Node extends TreeNode>(treeObj:Node | Node[],matcher:IForEachTreeCallback<Node>,options?:RemoveTreeNodes):void  
```

**说明**

- 当`mather`函数返回`true`时，删除该节点。
- 当`mather`函数返回`ABORT`时，中止遍历过程。

## toPidTree

将嵌套树结构转换为PID结构。

```typescript
function toPidTree<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
>(treeObj:FromNode | FromNode[],options?:ToPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):PidTreeNode<Omit<ToNode,ChildrenKey>,IdKey>[]

interface ToPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{
     includeLevel?: boolean
     includePath?: boolean
     mapper?:({node,level,parent,path,index}:{node:FromNode,level:number,parent:FromNode | null,path:string,index:number}) => Omit<ToNode,ChildrenKey | IdKey>
 }
```
**说明**

-  转换时可选指定`mapper`函数，用来返回新的节点数据
- 当`includePath=true`时，在目标节点中包括path节点路径
- 当`includeLevel=true`时，在目标节点中包括节点层级


**示例**

```typescript
    // 节点数据结构一致
    let nodes = toPidTree<Book>(books,{includePath:true})    
    
    // 转换为不同的数据结构
    type StoryBook = TreeNode<{
        name: string,
        publisher: string,
    }>    
    let storyNodes = toPidTree<Book,StoryBook>(books,{
        includePath:true,
        mapper:({node,level})=>{
            return {               
                name:node.title,
                publisher:`MEEYI ${level}` 
            }
        }
    })
```

## fromPidTree

将PID树结构转换为嵌套树结构。

```typescript
function fromPidTree<
    FromNode extends PidTreeNode = PidTreeNode,
    ToNode extends TreeNode = TreeNode<Omit<FromNode,'pid'>>,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
    >(pidNodes:FromNode[],options?:FromPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):ToNode[]   

interface FromPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{ 
     mapper?:(node:FromNode) => ToNode
 }
```

**说明**:
- 默认情况下转换为保持原节点的所有数据
- 可以通过`mapper`函数来返回新的节点数据.

## getTreeNodeInfo

获取节点基本信息，包括节点数据、父节点、路径、层级、和子节点序号。

```typescript
interface TreeNodeInfo<Node>{
    node:Node
    parent:Node | undefined | null
    path:string
    level:number
    index:number
}
export function getTreeNodeInfo<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetTreeNodeInfoOptions):TreeNodeInfo<Node> | undefined 
```


## getTreeNodeRelation

返回两个节点之间的关系。

```typescript
enum TreeNodeRelation{
    Same = 0,                               // 相同节点
    Child = 1,                              // 子节点
    Parent = 2,                             // 父节点     
    Descendants = 3,                        // 后代    
    Ancestors = 4,                          // 祖先
    Sibling = 5,                            // 兄弟节点    
    Unknown = 9                             // 未知
}
export function getTreeNodeRelation<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId:Node[IdKey],refNodeId:Node[IdKey],options?:GetTreeNodeRelationOptions):TreeNodeRelation
   
```
## moveTreeNode

移动节点到新的位置。

```typescript
enum MoveTreeNodePosition{
    LastChild = 0,                           // 移动为目标节点的最后一个子节点
    FirstChild = 1,                          //
    Next= 2,                                 //  下一个兄弟节点
    Previous = 3                             // 上一个兄弟
}

function moveTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],fromNodeId: Node[IdKey],toNodeId:Node[IdKey],pos:MoveTreeNodePosition=MoveTreeNodePosition.LastChild, options?:MoveTreeNodeOptions):void   
```

## getRelatedTreeNode

获取指定节点的关联节点。

```typescript
enum RelatedTreeNode{
    Parent = 1,
    Next = 2,
    Previous = 3 
}
function getRelatedTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id' 
>(treeObj: Node | Node[],nodeId:Node[IdKey],pos:RelatedTreeNode , options?:GetRelatedTreeNodeOptions):Node | null   
```

## FlexTree

`FlexTree`是一个树结构类

```typescript

class FlexTree{
    constructor(nodes:Node[] | Node,options:FlexTreeOptions<Node,IdKey>)
    get root(): Node | undefined
    get nodes(): Node[]
    getNode(nodeId:Node[IdKey]):Node | null
    addNode(nodeData: Partial<Node> ,refNodeId:Node[IdKey],pos:MoveTreeNodePosition = MoveTreeNodePosition.LastChild):Node 
    removeNode(nodeId:Node[IdKey]):void 
    moveNode(nodeId: Node[IdKey],refNodeId:Node[IdKey],pos:MoveTreeNodePosition)
    search(matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions)
}

// 遍历节点
let tree = new FlexTree({
    id:1,
    title:"a",
    children: [
        {id:2},
        {id:3}
    ]
})
for(let node of nodes){
    console.log(node)
}

```




# 类工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/classs"
```


## getClassStaticValue

获取当前实例或类的静态变量值.

```typescript
function getClassStaticValue(instanceOrClass:object,fieldName:string,options:{merge?: number,default?:any}={})
```

**说明**:

- `getClassStaticValue`会遍历继承链上的所有静态变量，如果值是`{}`或`数组`，则会进行**合并**。


**示例**:

```typescript
 
calss A{
   static settings={a:1}
}
calss A1 extends A{
    static settings={b:2}
}
 
getStaticFieldValue(new A1(),"settings") //==== {a:1,b:2} 
 ```

## isPropertyMethod

返回指定名称的方法是否是一个属性，即（GET、SET）

```typescript
function isPropertyMethod(inst:object, name:string)
```

# 异步工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/async"
```



## delay

延迟一段时间。

```typescript
 async function delay(ms: number)
```

## delayRejected

延迟一段时间，当超时时会触发错误。

```typescript
 async function delayRejected(ms: number,rejectValue?:any)
```
 
## asyncSignal

开发中经常碰到需要在某些异步任务完成后做点什么的场景，`asyncSignal`用来生成一个异步控制信号，可以侦听该异步信号的`resolve/reject`，其本质上是对`Promise`的简单封装。

- **使用方法**

```typescript

// 第一步：创建异步信号
import {asyncSignal,IAsyncSignal} from "flex-tools";
let signal = asyncSignal()

// 第2步：等待异步信号Resolve或Rejected
await signal()
// 第3步：在其他地方Resolve或Rejected异步信号，例 
 
setTimeout(() =>{
    signal.resolve(result?:any)
    signal.reject(e?:Error | string);
},100)
```

- **说明**

> asyncSignal(constraint?:Function,options?:{timeout:number}={timeout:0})


- 每个异步信号均具一个唯一的ID，即`signal.id`
- `asyncSignal`可以在被`resolve`或`reject`后，再次`await signal()`反复使用。
- 创建`asyncSignal`可以指定一个`约束条件函数`，当调用`signal.reject()`或`signal.resolve()`时，需要**同时满足约束条件函数返回true**，signal才会被`resolve/reject`。如:

```typescript
    // 
    
    let signal = asyncSignal(()=>{
        return true
    })
```

- 创建`asyncSignal`可以指定一个`timeout`参数，如果当`await signal()`超时会自动`rejected`。
- `signal.destroy()`可以销毁信号
- 在调用`await signal(timeout)`可以指定额外的超时。


- **API**

```typescript
signal.id    // 标识
// 信号被销毁时，产生一个中止错误，信号的使用者可以据此进行善后处理
signal.destroy() 
// 重置异步信号
signal.reset()    
// 返回异步信号的状态值
signal.isResolved() 
signal.isRejected()
signal.isPending()

```

- **示例**

**以下是一个例子使用`asyncSignal`的简单例子：**

```typescript
import {asyncSignal,IAsyncSignal} from "flex-decorators/asyncSignal";

let signal = asyncSignal()

class Queue{
    signal:IAsyncSignal
    buffer:number[]=[]
    constructor(){
        // 创建信号
        this.signal =  asyncSignal()
    }
    async start(){
        setTimeout(()=>{
            while(true){
                let data = await this.pop()
                //处理数据
            }
        },0)

    }
    async pop(){
        if(this.buffer.length > 0) return this.buffer.shift()
        // 等待有数据，返回的是一个Promise
        await this.signal()
    }
    push(data){
        this.buffer.push(data)
        // 当有数据时通过异步信号
        this.signal.resolve()
    }

}

```


## AsyncSignalManager

对`asyncSignal`的简单封装，用来管理多个异步信号，并确保能正确`resolve`和`reject`。

```typescript

let signals = new AsyncSignalManager({
    // 所有信号均在1分钟后自动超时，0代表不设超时，并且此值应该大于signal(timeout)时指定的超时值
    timeout:60 * 1000               
})
  
let signal= signals.create()   、、创建一个asyncSignal

signals.destroy()   //销毁所有异步信号
signals.resolve()    //resolve所有异步信号
signals.reject()     //reject所有异步信号
signals.reset()      //reset所有异步信号

```


# 事件工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/events"
```


## FlexEvent

一个简单的事件发生器，可以用来替代`eventemitter2`。

- **使用方法**

```typescript
import { FlexEvent } from "flex-tools"

let events = new FlexEvent({
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误  
    wildcard?: boolean          // 是否启用通配符订阅  
    delimiter?:string           // 当启用通配符时的事件分割符
})

// 订阅事件
let listenerId = events.on("<事件名称>",callback)              // 订阅事件
let listenerId = events.once("<事件名称>",callback)            // 只订阅一次
let listener = events.on("<事件名称>",callback,{objectify:true}) 
listener.off() //退订
// 退订
events.off(listenerId)
events.off("<事件名称>",callback)             // 退订事件
events.off("<事件名称>")             // 退订事件
events.offAll()                               // 退订所有事件


events.getListeners()                         //  返回所有侦听器
events.emit(event:string,...args:any[])       // 触发事件
events.emitAsync(event:string,...args:any[])  // 使用Promise.allSettled触发事件
await events.waitFor(event:string)             // 等待某个事件触发

// 通配符

events.on("a/*",callback)
events.emit("a/b")                  // 匹配触发

events.on("a/*/c",callback)
events.emit("a/b/c")                  // 匹配触发
events.emit("a/x/c")                  // 匹配触发

events.on("a/**/x",callback)
events.emit("a/b/c/x")              // 匹配触发
events.emit("a/b/x")                // 匹配触发
events.emit("a/b/c/d/e/x")          // 匹配触发

```
 
- **说明**

    - 构建`FlexEvent`时可以指定`context`参数作为订阅函数的`this`
    - 事件订阅支持通配符，可能通过`wildcard=false`来关闭此功能。

## FlexEventBus

基于`FlexEvent`实现的简单的事件总线,用来提供一个应用模块之间通讯的机制。

**主要特性:**

- 包含`FlexEventBus`和`FlexEventBusNode`两个类 
- 应用可以构建议`1-N`个节点`FlexEventBusNode`可以接入到`FlexEventBus`实例中
- 可以广播消息给所有节点
- 可以在节点之间进行`点对点`发送消息
- 提供基于`发布/订阅`节点通讯机制


### 快速入门

- **第1步: 创建总线实例**

```typescript
const eventbus = new FlexEventBus()
```

- **第2步: 创建节点**

```typescript
const aNode =  new FlexEventBusNode({id:`a`})
aNode.join(eventbus)
const bNode =  new FlexEventBusNode({id:`b`})
bNode.join(eventbus)
```

- **第3步: 节点间通讯**

```typescript

aNode.send("b",1)       // 向b节点发送消息
aNode.emit("run",1)       // a节点触发`run`事件

// b节点接收消息
b.onMessage=(message:FlexEventBusMessage)=>{

}

// bNode订阅aNode的事件，接收到的消息通过onMessage接收
b.on("a/run")

// bNode订阅aNode的事件时，指定消息侦听器
b.on("a/run",(message:FlexEventBusMessage)=>{
    // 
})
```

- **第4步:广播消息给所有节点**

```typescript

aNode.broadcast(1)

eventbus.broadcast("xxxx")

```

### 指南

#### 创建总线实例

创建总线实例只需要简单地实例即可。

```typescript

const eventbus = new FlexEventBus({
    //参阅FlexEvent的构建参数
})

```

- `FlexEventBus`继承自`FlexEvent`
- 

#### 创建节点

创建节点有两种方法：

```typescript

// 直接实例化
let node = new FlexEventBusNode({
    id:"<节点的唯一标识>",
    receiveBoradcast:true       // 是否接收广播消息
    onMessage:<Function>        // 提供一个接收消息的函数
})

// 继承方式
class MyModule extends FlexEventBusNode{
    constructor(){
        super({id:"<节点的唯一标识>"})
    }
    onMessage(message?:FlexEventBusMessage){
        // 
    }
}
 
```
#### 消息格式

事件总线内部通讯的消息采用统一格式，如下：L

```typescript
interface FlexEventBusMessage{
    from?:string                                // 消息来源=<节点的id>/<事件名称>
    id?:number                                  // 消息唯一标识用来跟踪消息时有用
    meta?:FlexEventBusMessageMeta
    payload?:any
}
```

- `id`字段是一个递增的字段
- `meta`字段供扩展保存一些额外的数据
- `from`字段为`<消息来源节点id>/<事件名称>`，如果调用的是`send`方法，则等于`<消息来源节点id>`。

#### 点对点通讯

每个节点均具有一个唯一的`id`，然后节点实例化时会在`FlexEventBus`实例上订阅`${节点ID}/$data`事件。
基于此原理，如果要给某个节点发送数据，只需要触发`${节点ID}/$data`事件即可。
如此，如果想要给某个节点发送消息

```typescript
const A = new FlexEventBusNode({id:"A"})
A.join(eventbus)
const B = new FlexEventBusNode({id:"B"})
B.join(eventbus)
A.onMessage = vi.fn((message:FlexEventBusMessage)=>{
    expect(message.payload).toBe(100)
    expect(message.meta?.from).toBe("B")
    resolve()
})            
B.send("A",100)
//

eventbus.send("A",100)

```

#### 发布/订阅事件

节点可以调用`emit`触发节点事件，触发的事件会自动添加节点id前缀。比如:

```typescript
const A = new FlexEventBusNode({id:"A"})
A.join(eventbus)
const B = new FlexEventBusNode({id:"B"})
B.join(eventbus)
A.onMessage = vi.fn((message:FlexEventBusMessage)=>{
    
})  

// A节点触发事件
A.emit("x",100)     // 等效于 eventbus.emit("A/x",{from:"A/x",payload:100})

// 
B.onMessage = (message:FlexEventBusMessage)=>{
    
}
// B节点订阅A节点发布的x事件
B.on("A/x")   // 没有指定侦听器时，默认由B.onMessage处理
// 也可以指定侦听函数
B.on("A/x",(message:FlexEventBusMessage)=>{
    
})

```

- 关于`发布/订阅`的API可以参阅`FlexEvent`

#### 广播消息

所有节点默认均会订阅`$ALL`事件，只需要在总线上触发`$ALL`事件均可以让所有节点(`在onMessage上`)接收到消息。

```typescript
const A = new FlexEventBusNode({id:"A"})
A.join(eventbus)

A.broadcast("内容")       // 广播到所有节点
eventbus.broadcast("内容")
```
- 节点可以通过设置`receiveBoradcast=false`来禁用接收广播消息。

#### API

- **FlexEventBus**

```typescript
let eventbus = new FlexEventBus({
    // ...参阅FlexEvent参数
})

// FlexEventBus继承自FlexEvent，扩展以下方法:

eventbus.nodes            // 返回接收总线的节点id列表
// 给指定节点发送消息
eventbus.send(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta)
// 给所有节点发送消息
eventbus.broadcast(payload:any,meta?:FlexEventBusMessageMeta)

```

- **FlexEventBusNode**

```typescript
const A = new FlexEventBusNode({id:"A"})

A.join(eventbus)      // 接入到总线
A.disjoin()           // 从总线中断开
// 订阅事件，如果event中包括delimiter字符(默认是/)
A.on(event:string,listener?:FlexEventListener<FlexEventBusMessage>)
A.on("xxx")   // 订阅本节点的事件并在onMessage中接收
A.on("xxx",(message)=>{...})   // 订阅本节点的事件并在指定侦听器中接收
A.on("B/xxx")   // 订阅B节点的事件并在onMessage中接收
A.on("B/xxx",(message)=>{...})   // 订阅B节点的事件并在指定侦听器中接收

// 订阅一次事件，其他同on方法
A.once(event:string,listener?:FlexEventListener<FlexEventBusMessage>)

// 等待某个事件触发，并可以指定等待超时时间
// 同样的，如果是本节点事件则可以省略节点名称
await A.waitFor(event:string,timeout?:number)

// 向指定的节点发送消息
send(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta)
// 向指定的节点发送消息并返回结果
await A.sendAsync(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta)

// 触发事件，自动添加本节点id前缀
// 如emit("xx") == emit("A/xx)
// 如emit("xx/yy") == emit("A/xx/yy)
A.emit(event:string,payload:any,meta?:FlexEventBusMessageMeta)
// emit的异步版本，采用Promise.allSettled并返回结果
await A.emitAsync(event:string,payload:any,meta?:FlexEventBusMessageMeta)
// 广播消息
A.boradcast(message:FlexEventBusMessage,useAsync:boolean=false)

```

# 数据容器

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/collection"
```


## dictArray
 
 构建一个成员是`{...}`的数组，数组中的成员均是具有相同结构的对象。如：`[{a:1},{a:2},...]`


 
```typescript
function dictArray<Item>(items:any[],defaultItem:Partial<Item> & {default?:boolean},options?:DictArrayOptions){
interface  DictArrayOptions{
    defaultField:string             // 声明默认字段，允许在items里面只写默认字段而不用完整的{}
    includeDefaultField:boolean     // 如果此值=true，则会为每一个item增加一个default字段，并且保证整个items里面至少有一项default=true
}
```

**说明**

- 每一项均是一个`{}`,且具有相同的结构
- 数组成员可以指定默认字段，比如`defaultField='name`，则
  [{name:"xx“，...},{name:"",},"tom",{name:"",...}]，在进行处理后将变成[{name:"xx“，...},{name:"",},{name:"tom",..默认项.},{name:"",...}]
- 如果输入的是`{}`，则转换成[{..}]
- 如果是其他非`{}`和Array，则按省略项进行处理，如`dictArray("tom")==> [{name:"tom",..默认项.}]`
- 可以指定其中的一个为`default=true`
- 可以指定默认成员值


## NamedDict

构建一个`{[name]:{....},[name]:{....},...}`对象容器.

```typescript
interface NamedDictOptions{
    requires?          : string[]                           // item项必选字段名称列表
    // item名称键名,代表名称是从item[nameKey]提取,如果是class:name代表是由item.class字段的name提取，当然，此时item.class必须是一个对象或者是{}才行
    nameKey?           : string                             
    // 忽略无效项，如果=false则会触发错误，否则会直接无视
    ignoreInvalidItems?: boolean                            
    // 正常情况下定义一个命名容器是[{name,...},{name:...},....{}]
    // 某些情况下允许采用缩写形式，如[AClass,BClass,....],这样存在命名容器没有名称的问题,这种情况下
    // 可以指定default="class"，代表缩写的是成员的class字段值
    // 然后再从AClass[nameKey],BClass[nameKey]提取名称
    // 默认项名称，比如default=“class"，代表可以不需要输入完整的{}，而只输入class，在这种情况下，名称只能从其中提取
    default           : string,                                    
    normalize         : (item:any)=>any                            // 提供一个函数normalize(item)用来对成员项进行规范化处理
}

function NamedDict<T>(items: any[], defaultItem?:T, options?:NamedDictOptions):Record<string,T>
```

**说明**

- 容器的数据项均具有一个唯一的名称，一般是具有一个`name`的字段
- 数据项里面有些字段是必须的，不能为空：即不能是`null`,`undefined`
- 支持两种构造方法，即`NamedDict([{name,...},{name,...}...])`和`NamedDict({name:{...},name:{...}})`
- 支持为每一项指定默认值
- 提供一个函数`normalize(item)`用来对成员项进行规范化处理
- `default`和`nameKey`两个参数配合用来指定如何提取成员名称。

```typescript

class A{}
class B{}
class C{}

let dict = NamedDict([
    {class:A},              
    {name:"AA",class:A},
    B,                          // 简写模式
    C
],{
    default:'class',        // 如果没有指定name，则从class中提取名称
    nameKey:'name'          // 代表name是成员名称
})

// 以上代表成员名称

{
    A:{name:"A",class:"A"},
    AA:{name:"AA",class:"A"},
    B:{name:"B",class:B},
    C:{name:"C",class:C}
}

```

# TypeScript类型

```typescript
import type { <函数名称> } from "flex-tools"
import type { <函数名称> } from "flex-tools/types"
```

## Class

类类型

```typescript
    export type Class = new (...args: any[]) => any
```

## ArrayMember

返回数组成员类型

```typescript
// 提取数组成员的类型
export type ArrayMember<T> = T extends (infer T)[] ? T : never
```

## AsyncFunction

异步函数

```typescript
export type AsyncFunction = (...args: any[]) => Awaited<Promise<any>>;
```
 
## ReturnValueType

提取函数的返回值类型

```typescript
export type ReturnValueType<T> = T extends (...args: any) => any ? ReturnType<T> : any;
```

## AllowEmpty

允许为空

```typescript
export type AllowEmpty<T> = T | null | undefined
```
## Constructor

构造类

```typescript
export type Constructor = { new (...args: any[]): any };
```

## TypedClassDecorator

用来声明类的装饰器函数

```typescript
export type TypedClassDecorator<T> = <T extends Constructor>(target: T) => T | void; 


```

## WithReturnFunction

用来声明一个函数，该函数必须返回指定类型

```typescript
export type WithReturnFunction<T> = (...args: any)=>T

type MyFunc = WithReturnFunction<number>

const f1:MyFunc =getCount():number=>1  // OK
const f2:MyFunc =getCount():string=>""  // ERROR

```

## ImplementOf

实现某个指定的类接口

```typescript
export type ImplementOf<T> = new (...args: any) => T

```

## Rename

用来更名接口中的类型名称

```typescript
export type Rename<T,NameMaps extends Partial<Record<keyof T,any>>> = {
    [K in keyof NameMaps as NameMaps[K] ]:K extends keyof T ? T[K] : never
} & Omit<T,keyof NameMaps>

// 示例：

interface X{
  a:number
  b:boolean
  c:()=>boolean
}

// 将a更名为A
type R1 = Rename<X,{'a':'A'}>  
// {  A:number, 
//    b:boolean
//    c:()=>boolean
// }
type R2 = Rename<X,{'a':'A','b':'B'}>  
// {  A:number, 
//    B:boolean
//    c:()=>boolean
// }

```

## FileSize

文件尺寸表示，可以调用`parseFileSize`函数解析。

**例：**:  `1kb`、`23MB`、`123GB`、`1MB`、`32E`、`41TB`、`13Bytes`

```typescript
type FileSize = number | `${number}${
    'B' | 'Byte' | 'b' | 'Bytes' 
    | 'K' | 'KB' | 'k' | 'kb' 
    | 'M' | 'MB' | 'm' | 'mb'
    | 'G' | 'GB' | 'g' | 'gb'
    | 'T' | 'TB' | 't' | 'tb' 
    | 'P' | 'PB' | 'p' | 'pb' 
    | 'E' | 'EB' | 'e' | 'eb'
}`
```

## TimeDuration

时间表示，可以使用`parseTimeDuration`函数返回毫秒数。

**例：**:  `1ms`, `12s` , `98m`, `100h`,`12Hours`,`8Days`, `6Weeks`, `8Years`, `1Minute`

```typescript
type TimeInterval = number | `${number}` | `${number}${
    'ms' | 's' | 'm' | 'h'              // 毫秒/秒/分钟/小时/
    | 'Milliseconds' | 'Seconds' | 'Minutes' |'Hours' 
    | 'd' | 'D' | 'W' | 'w' | 'M' | 'Y' | 'y'                // 天/周/月/年
    | 'Days' | 'Weeks' |'Months' | 'Years'
}` 
 
``` 
 
## MutableRecord

可变记录类型,其类型是由记录上的`type`字段推断出来的。

```typescript

type Animal = MutableRecord<{
    dog:{bark:boolean,wagging:boolean},
    cat:{mew:number},
    chicken:{egg:number}      
}>
// {type:'dog',bark:boolean,wagging:boolean } 
// | {type: 'cat', mew:number}
// | {type: 'chicken', egg:number}

let animals:Animal = {
    type:"dog",
    bark:true,
    wagging:true
}
let animals:Animal = {
    type:"cat",
    mew:23
}

```

也可以通过第二个泛型参数来指定，类型字段。如下：

```typescript

type Animal = MutableRecord<{
    dog:{bark:boolean,wagging:boolean},
    cat:{mew:number},
    chicken:{egg:number}      
},'kind'>
// {kind:'dog',bark:boolean,wagging:boolean } 
// | {kind: 'cat', mew:number}
// | {kind: 'chicken', egg:number}
```

## MutableRecordList

可变记录数组,其数组成员中`Record`类型，并且类型是根据`Record`的`type`字段值来推断的。

```typescript

type Animals = MutableRecordList<{
    dog:{bark:boolean,wagging:boolean},
    cat:{mew:number},
    chicken:{egg:number}      
}>
// (
//     {type:'dog',bark:boolean,wagging:boolean } 
//     | {type: 'cat', mew:number}
//     | {type: 'chicken', egg:number}
// )[]

let animals:Animal = [
    { type:"dog", bark:true,wagging:true},
    { type:"cat", mew:23 }
]

```

也可以通过第二个泛型参数来指定`type`类型字段。如下：

```typescript

type Animals = MutableRecordList<{
    dog:{bark:boolean,wagging:boolean},
    cat:{mew:number},
    chicken:{egg:number}      
},'kind'>
// (
//     {kind:'dog',bark:boolean,wagging:boolean } 
//     | {kind: 'cat', mew:number}
//     | {kind: 'chicken', egg:number}
// )[]
```


# 杂项

## timer

计时器，用来返回两次调用之间的耗时

```typescript
import { timer } from "flex-tools"


timer.begin()
await doing()
timer.end()  // time consuming: 12ms

timer.end("耗时：")  // 耗时：12ms
timer.end("耗时：",{unit:'s'})  // 耗时：1200s
```

**说明** 

- `timer.begin`和`timer.end`必须成对出现
- 允许嵌套使用`timer.begin`和`timer.end`
    ```typescript
        timer.begin() -------------| 
        await doing()              |
            timer.begin() ---      |
            await doing()    |     |
            timer.end()   ---      |
        timer.end()  --------------|
    ```


## parseTimeDuration

解析如`1ms`, `12s` , `98m`, `100h`,`12Hours`,`8Days`, `6Weeks`, `8Years`, `1Minute`的字符串为毫秒数。

```typescript
    // ms
    parseTimeDuration("1")              // =1
    parseTimeDuration("1ms")            // =1
    parseTimeDuration("1Milliseconds")  // =1
    //s
    parseTimeDuration("1s")             // =1000
    parseTimeDuration("1Seconds")       // =1000
    parseTimeDuration("1.5s")           // =1500
    parseTimeDuration("1.5Seconds")     // =1500
    
    // m
    parseTimeDuration("1m")             // =60000
    parseTimeDuration("1Minutes")       // =60000
    parseTimeDuration("1.5m")           // =60000+60000*0.5
    parseTimeDuration("1.5Minutes")     // =60000+60000*0.5
    // h
    parseTimeDuration("1h")             // =3600000
    parseTimeDuration("1Hours")         // =3600000
    parseTimeDuration("1.5h")           // =3600000+3600000*0.5
    parseTimeDuration("1.5Hours")       // =3600000+3600000*0.5

    // D
    parseTimeDuration("1D")             // =86400000
    parseTimeDuration("1d")             // =86400000
    parseTimeDuration("1Days")          // =86400000
    parseTimeDuration("1.5d")           // =86400000+86400000*0.5
    parseTimeDuration("1.5Days")        // =86400000+86400000*0.5

    // W 
    parseTimeDuration("1w")             // =604800000
    parseTimeDuration("1W")             // =604800000
    parseTimeDuration("1Weeks")         // =604800000
    parseTimeDuration("1.5w")           // =604800000+604800000*0.5
    parseTimeDuration("1.5Weeks")       // =604800000+604800000*0.5

    // M
    parseTimeDuration("1M")             // =2592000000
    parseTimeDuration("1Months")        // =2592000000
    parseTimeDuration("1.5M")           // =2592000000+2592000000*0.5
    parseTimeDuration("1.5Months")      // =2592000000+2592000000*0.5

    // Y
    parseTimeDuration("1Y")             // =31104000000
    parseTimeDuration("1y")             // =31104000000
    parseTimeDuration("1Years")         // =31104000000
    parseTimeDuration("1.5Y")           // =31104000000+31104000000*0.5
    parseTimeDuration("1.5Years")       // =31104000000+31104000000*0.5
```

## parseFileSize

解析如`1ms`, `12s` , `98m`, `100h`,`12Hours`,`8Days`, `6Weeks`, `8Years`, `1Minute`的字符串为字节数。


```typescript
    parseFileSize(1)                //1,无单位代表是字节
    parseFileSize("33b")            //33
    parseFileSize("33B")            //33
    parseFileSize("33Byte")         //33
    //kb
    parseFileSize("1k")             //1024
    parseFileSize("1K")             //1024
    parseFileSize("1kb")            //1024
    parseFileSize("1KB")            //1024

    parseFileSize(".5k")            //512
    parseFileSize("0.5k")           //512)   
    parseFileSize("1.5k")           //1536
    parseFileSize("1.5K")           //1536
    parseFileSize("1.5kb")          //1536
    parseFileSize("1.5KB")          //1536

    //mb
    parseFileSize("1m")             //1048576
    parseFileSize("1M")             //1048576
    parseFileSize("1mb")            //1048576
    parseFileSize("1MB")            //1048576
    
    parseFileSize("1.5m")           //1572864
    parseFileSize("1.5M")           //1572864
    parseFileSize("1.5mb")          //1572864
    parseFileSize("1.5MB")          //1572864

    //gb
    parseFileSize("1g")             //1073741824
    parseFileSize("1g")             //1073741824
    parseFileSize("1gb")            //1073741824
    parseFileSize("1GB")            //1073741824

    parseFileSize("1.5g")           //1610612736
    parseFileSize("1.5G")           //1610612736
    parseFileSize("1.5gb")          //1610612736
    parseFileSize("1.5GB")          //1610612736
```


# 升级日志
## 2023/2/25

- 增加`parseFileSize`和`parseTimeDuration`
## 2023/2/24

- 修复`string.params`处理字符串时的错误迭代
- 增加`object/pick`和`object/omit`函数

## 2023/2/22

- `string`函数支持按需导入

## 2023/2/21

- 增加`String.prototype.reverse`函数，用来反转字符串


