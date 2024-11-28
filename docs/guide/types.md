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

## Argument

获取函数的第`n`个参数类型

```typescript

function fn(a:number,b:boolean,c:string,d:any[]){
}


type arg1 = Argument<typeof fn,0>  // == number
type arg2 = Argument<typeof fn,1>   // == boolean
type arg3 = Argument<typeof fn,2>   // string
// -1代表最后一个参数，不支持-2,-3等
type arg4 = Argument<typeof fn,-1>  // any[]

```

## LastArgument

获取函数的最后一个参数类型

```typescript
export type LastArgument<T> = T extends (...args:infer Args) => any ? (Args extends [...infer _,infer L] ? L :never) : never
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


## ChangeFieldType

改变记录类型中某个字段的类型。

```typescript
export type ChangeFieldType<Record,Name extends string,Type=any> = Omit<Record,Name> & {
    [K in Name]:Type
}

interface MyRecord{
  a:number
  b:boolean
  c:string
}

type newRecord = ChangeFieldType<MyRecord,'a' ,boolean> 
/** {
  a:boolean
  b:boolean
  c:string
}*/

```

## Merge

 合并输入的多个类型

```typescript 
type Foo = { a: number};
type Bar = { b: string };
type Baz = { c: boolean };
type Merged = Merge<[Foo, Bar, Baz]>;
// == Foo & Bar & Baz
// 返回 { a: string; b: number; c: boolean; } ，它包含了输入数组中所有类型的属性。
```

## JsonObject

支持嵌套的JSON对象类型

## Overloads

用来获取函数的重载类型
 
 当一个函数具有多个重载时，我们可以使用`Overloads<T>`来获取函数的重载类型
 
```typescript

function foo(a: string): string;
function foo(a: number): number;
function foo(a: any): any 
 
typeof foo    // (a: string)=>string, 只能返回第一个重载的类型 
 
//  可以返回所有重载的类型
Overloads<typeof foo>  == (a: string)=>string | (a: number)=>number | (a: any)=>any
 
```

- `Overloads<T>` 只能获取最多8个重载的类型。


## ChangeReturns

改变函数的返回类型

```typescript

type fn = (a:number,b:boolean)=>void

type fn2 = ChangeReturns<fn,string>

// fn2 == (a:number,b:boolean)=>string


```

## ValueOf

获取`Record`类型的值类型

```typescript
type A = ValueOf<Record<string,number>>
// A == number
```
## Optional

将类型中除指定属性外的所有属性变为可选属性，

```typescript
export interface SiteOptions{
    id:string                           
    icon:string                         
    logo:string                         
    title:string                        
    path:string                         
}

type mysite = Optional<SiteOptions,'id' | 'path'>

// type mysite == {
//     id:string                           
//     icon?:string                         
//     logo?:string                         
//     title?:string                        
//     path:string 
// }

```
 

 
## ObjectKeyOf

获取对象的键名类型

```typescript 
  
interface Animal {
    [key: string]: string;
}

type name = keyof Animal

// 此时name的类型是string | number,而不是预想的string

type KeyType = ObjectKeyOf<Animal>


```


# requiredKeys

 用于获取对象 `T` 中指定的属性键 Keys，并将这些键对应的属性设置为必选。

 ```ts
  type Person {
   name?: string;
   age?: number;
 }
 // 我们想要创建一个新的类型，其中 name 属性是必选的：
 type PersonWithRequiredName = RequiredKeys<Person, 'name'>;

 // 这将创建一个新的类型，等同于：
 type PersonWithRequiredName = {
   name: string;
   age?: number;
 }
  
 ```