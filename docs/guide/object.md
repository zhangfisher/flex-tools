
# 对象工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/object"
```


## safeParseJson

使用`JSON.parse`解决JSON字符串时，对格式的要求比较严格，要求键名和字符串必须使用`"`包起来。比如`JSON.parse("{a:1}")`就会失败，`safeParseJson`方法能可以更好地兼容一些非标`JSON`字符串,当键名没有使用`"`包起来也可以解析。

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

**此函数在处理函数的对象参数时有用**,例如：

```typescript
// 一般在处理传参时会使用如下方法：
function test(x:number,options:{a:string,b:number}){
    // 为配置参数提供默认值
    let opts = Object.assign({
        a:"x",b:1
    },options)  
    //...
}

// 以上方法有个问题，如果传入的options中包含{a:undefined}，则会导致a没有默认值
// 此时，可以就可以使用assignObject
function test(x:number,options:{a:string,b:number}){
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
forEachObject(obj:Collection,callback:IForEachCallback,options?:ForEachObjectOptions)
interface ForEachObjectOptions{
    keys?:string[]               // 限定只能指定的健执行callback 
    // 是否仅遍历原始类型，如string,number,boolean,symbol,null,undefined,bigInt等
    // 如果为false，则也会为每一个数组和对象进行回调
    onlyPrimitive?:boolean   
    // 是否检测循环引用  no-check:不进行检测, error: 触发错误,  skip: 跳过 
    circularRef?:'no-check' | 'error' | 'skip'
}
type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:Collection | null,keyOrIndex?:string | number | null})=>any
```
- 遍历过程中，如果`callback`返回`ABORT`则中止遍历。
- `circularRef`用来决定是否检测循环引用以及当发现循环引用时的行力。`circularRef`取值如下：
    - `no-check`: 不进行检测，由于存在循环引用时会导致导致无限循环，所以需要特别注意。
    - `error`：当检测到循环引用时会触发错误`CircularRefError`
    - `skip`: 当检测到循环引用时跳过,这是**默认值**。 
    

**说明:**

- 遍历过程中在`callback`中返回`ABORT`常量则中止遍历。
- `keys`参数可以用来指只对指定的键名执行`callback`
- 默认情况下，`onlyPrimitive=true`，遍历时只会对对象中的原子类型(`number`,`string`,`symbol`,`bingInt`,`boolean`)调用`callback`，如果为`false`则也会对每一个对象/数组等调用`callback`
- `forEachObject`可以对`{}`，`Array`，`Set`，`Map`进行遍历


## forEachUpdateObject

深度遍历对象成员,当值满足条件时,调用`updater`函数的返回值来更新值

```typescript
type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:any[] | object | null,keyOrIndex?:string | number | null},options?:ForEachObjectOptions)=>any   
function forEachUpdateObject<T=any>(obj:any[] | object,filter:IForEachCallback,updater:IForEachCallback):T
```
- `forEachUpdateObject`内部使用`forEachObject`。
- 遍历过程中，如果`updater`返回`ABORT`则中止遍历。
- 

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