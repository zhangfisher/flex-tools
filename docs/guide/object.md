
# 对象工具

```typescript
import { <函数名称> } from "flex-tools/object"
```


## safeParseJson

使用`JSON.parse`解决JSON字符串时，对格式的要求比较严格，要求键名和字符串必须使用`"`包起来。比如`JSON.parse("{a:1}")`就会失败，`safeParseJson`方法能可以更好地兼容一些非标`JSON`字符串,当键名没有使用`"`包起来也可以解析。原理很简单，就是在使用`JSON.parse`前先用正则表达式处理替换一下。

```typescript
function safeParseJson(str:string)
```
- `safeParseJson`内部也是调用`JSON.parse`
- 能处理`key`没有用`"`包起来或使用`'...'`包起来的情况
- 能处理`value`使用`'...'`包起来的情况
- 行未尾未添加,号的情况
- 中文字符`“ ”，`替换

## assignObject

与`Object.assign`一样的功能，主要差别在于：

- 对值为`undefined`的处理方式不同。 

```typescript

Object.assign({a:1},{a:undefined}) // == {a:undefined})
// 由于a==undefined所有不会被合并，这样就保留了a的值
assignObject({a:1},{a:undefined}) // == {a:1})

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

## getByPath

类似`lodash/get`,根据路径来返回对象成员值。


```typescript
export interface getByPathOptions{
    defaultValue?:any                       // 默认值 
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
   get(obj,"y.0")                  // == 1
   get(obj,"y.1")                  // == 2
   get(obj,"y.5.m")                // == 1
   get(obj,"y.5.n")                // == 2
   get(obj,"z.3.0")              // == 1
   get(obj,"z.3.0")               // == 1
   get(obj,"z.4.1.1")            // == 3
```

- `defaultValue`参数可以用来指定一个默认值，当输入一个无效的路径时返回该默认值
- 当输入路径成功匹配到时会调用`matched`函数。 
- `get`支持两个可选泛型参数，第一个参数`R`为返回值类型，第二个参数`P`为路径名称类型。

```typescript

import type {ObjectPath} from "flex-tools"
import { getByPath} from "flex-tools/object/getByPath"

const obj = {
    x: {
        a: {
            b1: '1',
            b2: '1',
            b3: 1
        },
        b: 1,
        c:1
    },
    y:1
    z:[1,2,3]
} 
 

// 第二个参数使用ObjectKeyPath来生成路径类型
//  'x' | 'x.a' | 'x.a.b1' | 'x.a.b2' | 'x.a.b3' | 'x.b' | 'x.c' | 'y' | 'z' | `z[${number}]`
const b1 = getByPath<any,ObjectPath<typeof obj>>(obj,"x.a.b1") 
const b1 = getByPath<any,ObjectPath<typeof obj>>(obj,"z") 
const b1 = getByPath<any,ObjectPath<typeof obj>>(obj,"z[12]") 

// 注意：ObjectPath用来生成路径强类型约束，但是其有一定的限制，请参阅types/ObjectPath说明

```

## setByPath

类似`lodash/set`,根据路径来更新对象成员值。

```typescript

interface SetByPathOptions { 
    delimiter?: string; // 路径分隔符，默认为 '.'
    // 如果指定的路径不存在，则回调返回一个值目标路径的值
    infer?: (path:string[]) => any; // 自定义路径解析器
}

function setByPath<P extends string = string>(obj:object,path:P,value:any,options?:SetByPathOptions):object;

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
    get(set(obj,"a.b3.0.b31",22),"a.b3.0.b31")        // == 22
    get(set(obj,"a.b3.1.b31",33),"a.b3.1.b31")        // == 33
    get(set(obj,"a.b3.1.b32",44),"a.b3.1.b32")        // == 44
    get(set(obj,"a.b3.1.b31",55),"a.b3.1.b31")      // == 55
    get(set(obj,"a.b3.1.b32",55),"a.b3.1.b32")      // == 55
    get(set(obj,"x",2),"x")                             // == 2
    get(set(obj,"y.0",3),"y.0")                       // == 3
    get(set(obj,"y.1",4),"y.1")                       // == 4
    get(set(obj,"y.5.m",5),"y.5.m")                   // == 5
    get(set(obj,"y.5.n",6),"y.5.n")                   // == 6

```

- 当`onlyUpdateUndefined=true`时，则仅当原始值是`undefined`时才会更新。默认值为`false`。此参数在某此场合不能会很有用。比如在进行函数参数设置时，可以用来指定某个参数的默认值。

```typescript
function test(options){
    // 仅当options.a.b为undefined时才会设置,这样就相当于设置了一个默认值
    set(options,"a.b",1) 
}
```
-  `allowUpdateNullPath`指定当路径不存在时，是否允许更新，默认为`true`。
- 泛型参数可以配合`ObjectPath`类型来指定路径类型参数。

```typescript

import type {ObjectPath} from "flex-tools"
import { get} from "flex-tools/object/get"

const obj = {
    x: {
        a: {
            b1: '1',
            b2: '1',
            b3: 1
        },
        b: 1,
        c:1
    },
    y:1
    z:"1"
} 
 

// 第二个参数使用ObjectKeyPath来生成路径类型
//  'x' | 'x.a' | 'x.a.b1' | 'x.a.b2' | 'x.a.b3' | 'x.b' | 'x.c' | 'y' | 'z'

setByPath<any,ObjectPath<typeof obj>>(obj,"x.a.b1") 
setByPath<any,ObjectPath<typeof obj>>(obj,"x.xxx")   // ERROR: 不能设置不存在的路径

```


## deepMerge

深度合并多个对象到第一个对象参数中，功能类似`lodash/merge`，但是对数组的合并策略不同。

```typescript
deepMerge(...objs:Record<string|symbol,any>[],options?:DeepMergeOptions):Record<string|symbol,any>;

interface DeepMergeOptions{
    // 数组合并策略，0-替换，1-合并，2-去重合并
    $merge: 'replace' | 'merge' | 'uniqueMerge' | ((fromValue:any,toValue:any,ctx:{key:string,from:any,to:any})=>any)                                                
    // 忽略undefined项不进行合并
    $ignoreUndefined?: boolean             
}
```

当`deepMerge`的最后一个为`Record<string|symbol,any>`，且包含`DeepMergeOptions`中的任一个属性时代表是一个配置项，而不是一个待合并的对象。
  
`deepMerge`支持以下参数:

- `$merge`
决定如何合并数组,与`lodash/merge`的区别在于对数组成员的合并处理机制不同,`merge`参数可以指定如何对数据进行合并。
    - `$merge='replace'`: 替换原始数据项
    - `$merge='append'`:  合并追加到原数组
    - `$merge='unique`:  合并数组，并且进行去重
    - `$merge`也可以是一个函数，用来自定义合并策略
- `$ignoreUndefined`
忽略掉`fromObj`中的`undefined`项。 



## getPropertyNames

 获取指定对象的所有包含原型链上的所有属性列表  

 ```typescript
function getPropertyNames(obj: any,includePrototype?:boolean):string[]
```
- 默认当`includePrototype=true`时，会包含原型链上的属性列表。
## objectIterator

返回一个对象(`{}`,`[]`,`Set`,`Map`)的**深层遍历**迭代器。

```typescript
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

export function objectIterator(obj:Collection,options?:ObjectIteratorOptions):Iterable<ObjectIteratorValue>

const obj = {a:1,b:2,c:{c1:3,c2:4,c3:{c31:5,c32:[6,7,8,9]}}}
const results = []
for(let {value,parent,keyOrIndex} of objectIterator(obj) ){
    results.push(value)
}
console.log(results.join(",")) // 1,2,3,4,5,6,7,8,9

// 不仅仅遍历原子类型
for(let {value,parent,keyOrIndex} of objectIterator(obj,{onlyPrimitive:false}) ){
    results.push(value)
}
console.log(results.map(r=>JSON.stringify(r)).join(" | ")) 
// '1 | 2 | {"c1":3,"c2":4,"c3":{"c31":5,"c32":[6,7,8,9]}} | 3 | 4 | {"c31":5,"c32":[6,7,8,9]} | 5 | [6,7,8,9] | 6 | 7 | 8 | 9'

```


## forEachObject

遍历对象成员,对每一个成员调用`callback`函数。
`forEachObject`内部使用了`objectIterator`,其配置参数与`objectIterator`相同。

```typescript
type ForEachObjectOptions = ObjectIteratorOptions
type IForEachCallback = ({value,parent,keyOrIndex}:{value?:any,parent?:Collection | null,keyOrIndex?:string | number | null})=>any

function forEachObject(obj:Collection,callback:IForEachCallback,options?:ForEachObjectOptions);

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


## mixinObject

本方法可以用来为类或实例混入属性/方法等

```typescript
function mixinObject(target:any, source:any,  options?:MixinPropertiesOptions)
 interface MixinObjectOptions{
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

## isLikeObject

判断两个对象是否相似

```typescript

export interface IsLikeObjectOptions{
    strict?:boolean                 // 是否严格比较
    deep?:boolean                   // 是否深度比较, 对象的值为对象时，是否递归比较
}
export function isLikeObject(obj:Record<string | number | symbol,any>,baseObj:Record<string |number | symbol,any>,options?:IsLikeObjectOptions):boolean
 
isLikeObject({a:1,b:2},{a:1,b:2}) // true
isLikeObject({a:1,b:2},{b:2,a:1}) // true
// 默认strict=false，允许srcObj中存在baseObj中不存在的键
isLikeObject({a:1,b:2,c:3},{b:2,a:1}) // true
isLikeObject({a:1,b:2,c:3},{b:2,a:1},{strict:true}) // false
 
```

- 只进行键名称的比较，不进行值的比较
- 两个对象的键名称相同，但顺序不同也认为是相似的
- 两个对象的键名称相同，但值的类型不同也认为是相似的
- 默认`strict=false`代表不进行严格比较
- `deep=true`则当对象的值均是对象时进行递归比较，否则只进行一层比较，默认值为`false`

## hasKey

判断对象中是否指定的键值.

```typescript
const obj = {
  a: {
    b: {
      c: "hello",
    },
  },
};
console.log(hasKey(obj, "a.b.c")); // true
console.log(hasKey(obj, "a.b.d")); // false
console.log(hasKey(obj, "a.b")); // true
console.log(hasKey(obj, "a")); // true
console.log(hasKey(obj, "b")); // false
```



## defaultObject

用来为对象提供默认值。执行此函数时，仅当对象中的键不存在或值为`undefined`时才会使用默认值进行替换。
当我们需要为对象提供默认值时，可以使用此函数。

```typescript
const obj = {
  a: 1
  b: undefined
}

defaultObject(obj, {a: 2, b: 3, c: 4}) // {a: 1, b: 3, c: 4}

```
`defaultObject`使在在以下场景：

```
interface Options{
    a?:number
    b?:boolean
    c?:string
}


function fn(options:Options){
    // 第1处理方式，
    const opts = Object.assing({a:1,b:true,c:""},options)
    // 此处理方式的缺点是，当传入{a:undefined}时，a默认值也会变成undefined
    // 因此就有了第2种处理方式
    
    // 第2处理方式:  当传入{a:undefined}时，a默认值保持不变
    const opts = assignObject({a:1,b:true,c:""},options)

    // 第3处理方式: 如果希望直接修改传入的options对象，而不是生成新的对象，则上述两种均不合适
    defaultObject(options,{a:1,b:true,c:""})
    此方式仅当options中不存在键或值为undefined时才会更新到options    
}

```
## observable

创建一个可观察的对象，当对象的值发生变化时，会触发回调函数。

```typescript
export type ObservableOptions= {
    onRead?:(key:string[],value:any)=>any
    onWrite?:(key:string[],newValue:any)=>any
    onDelete?:(key:string[])=>any
    // 触发方式
    // default: 只有读取值是非对象时才会触发
    // full: 读取任何值都会触发,这可能会导致性能问题,慎用
    trigger?: 'default' | 'full'
}
function observable<T extends object=object>(target: T, options?:ObservableOptions):T 


const obj = observable({a:1,b:2},{
    onRead:(key,value)=>{
        console.log("read",key,value)
    },
    onWrite:(key,newValue)=>{
        console.log("write",key,value)
    },
    onDelete:(key)=>{
        console.log("delete",key)
    }
})

```

## lazyObject

创建一个懒加载对象，只有在访问对象的属性时才会加载对象。

```typescript

const obj = lazyObject(()=>{
    a:1,
    b:2
})

obj.a       // 首先访问时执行懒加载函数的返回值


```

## WeakObjectMap

一个弱引用对象映射，当对象被垃圾回收时，会自动移除映射中的对象。

```typescript
const map = new WeakObjectMap()
const obj = {a:1}
map.set("key",obj)
obj = null // 此时map中的对象会被自动移除
```