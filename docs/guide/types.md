# TypeScript 类型

```typescript
import type { <类型名称> } from "flex-tools/types"
```

## String

### FirstUpper

**类型：**`FirstUpper<T extends string>`

将字符串首字母变成大写

### FirstLower

**类型：**`FirstLower<T extends string>`

将字符串首字母变成小写

## Object

### MutableRecord

**类型：**`MutableRecord<Items,KindKey extends string='type',Share = unknown,DefaultKind extends keyof Items = never>`

- **可变记录类型,其类型是由记录上的`type`字段推断出来的。**

```typescript twoslash
import { MutableRecord } from "flex-tools/types";

type Animal = MutableRecord<{
  dog: { bark: boolean; wagging: boolean };
  cat: { mew: number };
  chicken: { egg: number };
}>;
let animals: Animal = {
  type: "dog",
  bark: true,
  wagging: true,
};
let animals2: Animal = {
  type: "cat",
  mew: 23,
};
```

- **也可以通过第二个泛型参数来指定，类型字段。如下：**

```ts twoslash
import { MutableRecord } from "flex-tools/types";
type Animal = MutableRecord<
  {
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  },
  "kind"
>;

let animals: Animal = {
  kind: "dog",
  bark: true,
  wagging: true,
};
// {kind:'dog',bark:boolean,wagging:boolean }
// | {kind: 'cat', mew:number}
// | {kind: 'chicken', egg:number}
```

- **第 3 个泛型参数用来指定`share`公共字段。**

```ts twoslash {7,8}
import { MutableRecord } from "flex-tools/types";
type Animal = MutableRecord<
  {
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  },
  "kind",
  {
    name: string;
    age: number;
  }
>;

let animals: Animal = {
  kind: "dog",
  bark: true,
  wagging: true,
  name: "Jack",
  age: 3,
};
// {kind:'dog',bark:boolean,wagging:boolean,name:string,age:number }
// | {kind: 'cat', mew:number,name:string,age:number}
// | {kind: 'chicken', egg:number,name:string,age:number}
```

- **第 4 个泛型参数用于指定 kind 默认类型。**

```ts twoslash {7,8}
import { MutableRecord } from "flex-tools/types";
type Animal = MutableRecord<
  {
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  },
  "kind",
  {
    name: string;
    age: number;
  },
  "cat"
>;
// 以下没有指定kind时，默认为cat类型。
let animals: Animal = {
  mew: 5,
  name: "Jack",
  age: 3,
};
```

### MutableRecordList

**类型：**`MutableRecordList<T,Name extends string>`

可变记录数组,其数组成员中`Record`类型，并且类型是根据`Record`的`type`字段值来推断的。

```ts twoslash
import { MutableRecordList } from "flex-tools/types";

type Animals = MutableRecordList<{
  dog: { bark: boolean; wagging: boolean };
  cat: { mew: number };
  chicken: { egg: number };
}>;
// (
//     {type:'dog',bark:boolean,wagging:boolean }
//     | {type: 'cat', mew:number}
//     | {type: 'chicken', egg:number}
// )[]

let animals: Animals = [
  { type: "dog", bark: true, wagging: true },
  { type: "cat", mew: 23 },
];
```

- **也可以通过第二个泛型参数来指定`type`类型字段。如下：**

```ts twoslash
import { MutableRecordList } from "flex-tools/types";

type Animals = MutableRecordList<
  {
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  },
  "kind"
>;

let animals: Animals = [
  { kind: "dog", bark: true, wagging: true },
  { kind: "cat", mew: 23 },
];
// (
//     {kind:'dog',bark:boolean,wagging:boolean }
//     | {kind: 'cat', mew:number}
//     | {kind: 'chicken', egg:number}
// )[]
```

**`MutableRecordList`也可以通过第 3 个泛型参数来指定`share`公共字段。**

```ts twoslash
import { MutableRecordList } from "flex-tools/types";

type Animals = MutableRecordList<
  {
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  },
  "kind",
  {
    name: string;
    age: number;
  }
>;

let animals: Animals = [
  { kind: "dog", bark: true, wagging: true, name: "tom", age: 3 },
  { kind: "cat", mew: 23, name: "bob", age: 1 },
];
// (
//     {kind:'dog',bark:boolean,wagging:boolean ,name:string,age:number}
//     | {kind: 'cat', mew:number,name:string,age:number}
//     | {kind: 'chicken', egg:number,name:string,age:number}
// )[]
```

- **第 4 个泛型参数用于指定 kind 默认类型。**

```ts twoslash
import { MutableRecordList } from "flex-tools/types";

type Animals = MutableRecordList<
  {
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  },
  "kind",
  {
    name: string;
    age: number;
  },
  "cat"
>;

let animals: Animals = [
  { kind: "dog", bark: true, wagging: true, name: "tom", age: 3 },
  { mew: 23, name: "bob", age: 1 }, // [!code ++]
];
// (
//     {kind:'dog',bark:boolean,wagging:boolean ,name:string,age:number}
//     | {kind?: 'cat' | undefined, mew:number,name:string,age:number}
//     | {kind: 'chicken', egg:number,name:string,age:number}
// )[]
```

### ChangeFieldType

**类型：**`ChangeFieldType<Record,Name extends string,Type=any>`

改变记录类型中某个字段的类型。

```typescript twoslash
import { ChangeFieldType } from "flex-tools/types";

interface MyRecord {
  a: number;
  b: boolean;
  c: string;
}
type newRecord = ChangeFieldType<MyRecord, "a", boolean>;
/** {
  a:boolean
  b:boolean
  c:string
}*/
```

### ValueOf

**类型：**`ValueOf<T>`

获取`Record`类型的值类型

```typescript twoslash
import { ValueOf } from "flex-tools/types";

type Value = ValueOf<Record<string, number>>;
//   ^^^^^
// Value == number
```

### Optional

**类型：**`Optional<T, ExcludeKeys extends keyof T = never>`

将类型中的所有属性变为可选属性，可以通过`ExcludeKeys`排除指定的属性。

```typescript twoslash
import { Optional } from "flex-tools/types";
export interface SiteOptions {
  id: string;
  icon: string;
  logo: string;
  title: string;
  path: string;
}

type mysite = Optional<SiteOptions, "id" | "path">;
//   ^^^^^^
// type mysite == {
//     id:string
//     icon?:string
//     logo?:string
//     title?:string
//     path:string
// }
```

### Dict

**类型：**`Dict<T>`

创建一个字典类型，键为字符串，值为指定类型（不允许为函数类型）

```ts
type StringDict = Dict<string>;
const dict1: StringDict = {
  key1: "value1",
  key2: "value2",
};

// 使用复杂类型
interface User {
  name: string;
  age: number;
}
type UserDict = Dict<User>;
const dict2: UserDict = {
  user1: { name: "Alice", age: 25 },
  user2: { name: "Bob", age: 30 },
};

// 函数类型会返回 never
type FuncDict = Dict<() => void>; // never
```

### JSONObject

**类型：**`JSONObject`

支持嵌套的`JSON`对象类型，`Key`为字符串，值类型为`any`。

### DeepPartial

**类型：**`DeepPartial<T>`

将对象类型`T`中的所有属性变为可选属性,包含嵌套对象。

```typescript twoslash
import { DeepPartial } from "flex-tools/types";

interface Order {
  orderNo: string;
  amount: number;
  status: "pending" | "paid" | "canceled";
  custom: {
    name: string;
    age: number;
    address: string;
  };
}

type PartialOrder = DeepPartial<Order>;
//   ^^^^^^^^^^^^
```

- `DeepPartial`还有一个别名`DeepOptional`。

### DeepRequired

**类型：**`DeepRequired<T>`

```typescript twoslash
import { DeepRequired } from "flex-tools/types";
type Example = {
  a?: {
    b?: number;
  };
  c?: string[];
};

type RequiredExample = DeepRequired<Example>;
// 结果类型：
// {
//   a: {
//     b: number;
//   };
//   c: string[];
// }
```

### ObjectKeys

**类型：**`ObjectKeys<T>`

获取对象的键名类型

```typescript twoslash
import { ObjectKeys } from "flex-tools/types";

interface Animal {
  name: string;
  age: number;
  address: string;
}

type name = keyof Animal;

// 此时name的类型是string | number,而不是预想的string

type KeyType = ObjectKeys<Animal>;
//   ^^^^^^^
```

### Keys

**类型：**`Keys<T extends Record<string,any>>`

获取对象的键名元组

```typescript twoslash
import { Keys } from "flex-tools/types";

interface Animal {
  name: string;
  age: number;
  address: string;
}

type KeyType = Keys<Animal>;
//   ^^^^^^^
// ['name', 'age', 'address']
```

### RequiredKeys

**类型：**`RequiredKeys<T extends object, Keys extends keyof T> `

用于获取对象 `T` 中指定的属性键 Keys，并将这些键对应的属性设置为必选。

```ts twoslash
import { RequiredKeys } from "flex-tools/types";

type Person = {
  name?: string;
  age?: number;
  address?: string;
  sex?: "male" | "female";
};

// 我们想要创建一个新的类型，其中 name,age 属性是必选的：
type NewPerson = RequiredKeys<Person, "name" | "age">;
//   ^^^^^^^^^
```

### ObjectKeyPaths

**类型：**`ObjectKeyPaths<T,Delimiter extends string = '.'> `

获取对象的所有路径

```ts twoslash
import { ObjectKeyPaths } from "flex-tools/types";
const obj = {
  store: {
    book: [
      {
        category: "reference",
        author: "Nigel Rees",
        title: "Sayings of the Century",
        price: 8.95,
        tabs: ["1", "2"],
      },
      {
        category: "fiction",
        author: "Evelyn Waugh",
        title: "Sword of Honour",
        price: 12.99,
        tags: ["a", "b"],
      },
    ],
    bicycle: {
      color: "red",
      price: 19.95,
    },
  },
};

type paths = ObjectKeyPaths<typeof obj>;
//   ^^^^^
```

默认情况下，路径分割符是`.`，你也可以通过第二个参数指定其他的分割符。

```ts twoslash
import { ObjectKeyPaths } from "flex-tools/types";

const obj = {
  store: {
    book: [
      {
        category: "reference",
        author: "Nigel Rees",
        title: "Sayings of the Century",
        price: 8.95,
        tabs: ["1", "2"],
      },
      {
        category: "fiction",
        author: "Evelyn Waugh",
        title: "Sword of Honour",
        price: 12.99,
        tags: ["a", "b"],
      },
    ],
    bicycle: {
      color: "red",
      price: 19.95,
    },
  },
};

type paths = ObjectKeyPaths<typeof obj, "/">;
//   ^^^^^
```

:::warning 注意
对象深度限制为 30
:::

### GetTypeByPath

**类型：**`GetTypeByPath<State extends Dict, Path extends string,Delimiter extends string = '.'> `

获取对象的所有路径

```ts twoslash
import { GetTypeByPath } from "flex-tools/types";
const obj = {
  a: {
    b: {
      b1: "1",
      b2: "1",
      b3: 1,
      b4: {
        b41: 1,
        b42: 2,
        b43: [1, 2],
      },
    },
    e: 1,
    y: 1,
  },
  f: 1,
  e: 8,
  y: "",
  z: [],
  d1: () => {},
  d2: new Set(),
  d3: new Map(),
  d4: Symbol(),
};

type type1 = GetTypeByPath<typeof obj, "a.b">;
type type2 = GetTypeByPath<typeof obj, "a.b.b1">;
type type3 = GetTypeByPath<typeof obj, "a.b.b4.b41">;
type type4 = GetTypeByPath<typeof obj, "a.b.b4.b43.0">;
type type5 = GetTypeByPath<typeof obj, "a.b.b4.b43.1">;
type type6 = GetTypeByPath<typeof obj, "d1">;
type type7 = GetTypeByPath<typeof obj, "z.0">;
```

默认情况下，路径分割符是`.`，你也可以通过第二个参数指定其他的分割符。

```ts twoslash
import { GetTypeByPath } from "flex-tools/types";
const obj = {
  a: {
    b: {
      b1: "1",
      b2: "1",
      b3: 1,
      b4: {
        b41: 1,
        b42: 2,
        b43: [1, 2],
      },
    },
    e: 1,
    y: 1,
  },
  f: 1,
  e: 8,
  y: "",
  z: [],
  d1: () => {},
  d2: new Set(),
  d3: new Map(),
  d4: Symbol(),
};

type type1 = GetTypeByPath<typeof obj, "a/b", "/">;
type type2 = GetTypeByPath<typeof obj, "a/b/b1", "/">;
type type3 = GetTypeByPath<typeof obj, "a/b/b4/b41", "/">;
type type4 = GetTypeByPath<typeof obj, "a/b/b4/b43/0", "/">;
type type5 = GetTypeByPath<typeof obj, "a/b/b4/b43/1", "/">;
type type6 = GetTypeByPath<typeof obj, "d1", "/">;
type type7 = GetTypeByPath<typeof obj, "z/0", "/">;
```

## Array

### ArrayMember

**类型：**`ArrayMember<T> `

提取数组成员的类型。如果传入的类型不是数组，则返回`never`。

```typescript twoslash
import type { ArrayMember } from "flex-tools/types";
// 基本类型数组
type NumberArray = number[];
type NumberType = ArrayMember<NumberArray>; // number
//   ^^^^^^^^^^
// 对象数组
type User = { id: number; name: string };
type Users = User[];
type UserType = ArrayMember<Users>; // { id: number; name: string }
//   ^^^^^^^^
// 联合类型数组
type MixedArray = (string | number)[];
type MixedType = ArrayMember<MixedArray>; // string | number
//   ^^^^^^^^^
// 非数组类型
type NotArray = string;
type Result = ArrayMember<NotArray>; // never
//   ^^^^^^
```

### Unique

**类型：**`Unique<T>`

将数组中的类型元素去重。

```typescript twoslash
import { Unique } from "flex-tools/types";

type T1 = Unique<[number, string, number]>; // [number, string]
//   ^^
type T2 = Unique<[1, 2, 2, 3]>; // [1, 2, 3]
//   ^^
type T3 = Unique<["a", "b", "a"]>; // ['a', 'b']
//   ^^
```

## Function

### SyncFunction

**类型：**`SyncFunction<T>`

用来声明一个函数，该函数必须返回指定类型

```typescript
import type { SyncFunction } from "flex-tools/types";

function getCount(fn: SyncFunction<number>) {}
getCount(() => 100); // ✅ Correct
getCount(() => true); // ❌ ERROR
getCount(async () => 100); // ❌ ERROR
getCount(async () => true); // ❌ ERROR
```

### AsyncFunction

**类型：**`AsyncFunction<Returns=void | any>`

表示异步函数类型。

```typescript
 import type { AsyncFunction } from "flex-tools/types";

// 声明异步函数
const fetchData: AsyncFunction = async (url: string) => {};

// 用作参数类型
function executeAsync(fn: AsyncFunction) {
  return fn();
}
executeAsync(async ()=>{}) ✅ Correct
executeAsync(()=>{})❌ Error

// 限制返回值类型
function executeAsync(fn: AsyncFunction<boolean>) {
  return fn();
}
executeAsync(async ()=>true)✅ Correct
executeAsync(()=>true) ❌ Error
```

### Argument

**类型：**`Argument<T extends (...args:any[])=>any,index extends number>`

- `T`: 要提取参数类型的函数类型
- `index`: 要提取的参数索引（从 0 开始），使用 -1 表示最后一个参数

提取函数的第 `n`个参数的类型。当索引为 `-1`时，返回最后一个参数的类型。

```typescript twoslash
import type { Argument } from "flex-tools/types";

function greet(name: string, age: number, isAdmin: boolean) {
  // 函数实现
}
// 提取各个位置参数的类型
type FirstParam = Argument<typeof greet, 0>; // string
type SecondParam = Argument<typeof greet, 1>; // number
type ThirdParam = Argument<typeof greet, 2>; // boolean
type LastParam = Argument<typeof greet, -1>; // boolean
```

### LastArgument

**类型：** `LastArgument<T> `

- `T`: 要提取参数类型的函数类型

获取函数的最后一个参数类型

```typescript twoslash
import type { LastArgument } from "flex-tools/types";

function greet(name: string, age: number, isAdmin: boolean) {
  // 函数实现
}
// 提取各个位置参数的类型
type LastParam = LastArgument<typeof greet>; // boolean
```

### ChangeReturns

**类型：**`ChangeReturns<T,NewReturn>`

改变函数的返回类型

```typescript twoslash
import { ChangeReturns } from "flex-tools/types";
type fn = (a: number, b: boolean) => void;

type newFn = ChangeReturns<fn, string>;
//   ^^^^^
// newFn == (a:number,b:boolean)=>string
```

### Overloads

**类型：**`Overloads<T>`

用来获取函数的重载类型

当一个函数具有多个重载时，我们可以使用`Overloads<T>`来获取函数的重载类型

```typescript twoslash
import { Overloads } from "flex-tools/types";

function foo(a: string): string;
function foo(a: number): number;
function foo(a: boolean): boolean;
function foo(): any {}

type Fun = typeof foo;

//  可以返回所有重载的类型
type Funs = Overloads<typeof foo>;
//   ^^^^
```

- `Overloads<T>` 只能获取最多 10 个重载的类型。

## Class

### Class

**类型：**`Class<T = any>`

表示任意类的构造函数类型。可用于需要接受任意类作为参数的场景。

```typescript
// 基本用法
class AClass {
  private a: string = "";
}
class BClass {
  private b: string = "";
}

// 函数接受任意类作为参数
function createInstance(ClassType: Class) {
  return new ClassType();
}
createInstance(AClass); // ✅ Correct
// 限制类
function createInstance(ClassType: Class<AClass>) {
  return new ClassType();
}

createInstance(AClass); //  ✅ Correct
createInstance(BClass); //  ❌ Error
```

### ImplementOf

**类型：**`ImplementOf<T>`

实现某个指定的类接口，效果与`Class`相同，在某些情况下语义更准备。

```typescript
interface Animal {
  name: string;
  run(): void;
}

// 使用 ImplementOf 定义工厂函数
function createAnimal(AnimalClass: ImplementOf<Animal>) {
  return new AnimalClass();
}

// 实现接口的类
class Dog implements Animal {
  name = "Dog";
  run() {}
}
class Cat {}

createAnimal(Dog); // ✅ Correct
createAnimal(Cat); // ❌ ERROR
```

## Misc

### Union

**类型：**`Union<T>`

将类型 `T` 所有成员合并为一个类型, 用于展开复杂的类型定义,使其更易读和理解

```ts twoslash
import type { Union } from "flex-tools/types";
type Complex = { a: string } & { b: number };
type Unioned = Union<Complex>; // { a: string; b: number }
//   ^^^^^^^^
```

### AllowEmpty

**类型：**`AllowEmpty<T>`

将类型转换为可为空（`null` 或 `undefined`）的类型

```typescript twoslash
import type { AllowEmpty } from "flex-tools/types";

type Value = string;
type ValueParam = AllowEmpty<Value>;

const str1: ValueParam = "hello"; // ✅ Correct
const str2: ValueParam = null; // ✅ Correct
const str3: ValueParam = undefined; // ✅ Correct
```

### Rename

**类型：**`Rename<T,NameMaps extends Partial<Record<keyof T,any>>>`

重命名类型中的属性。

```typescript twoslash
import type { Rename } from "flex-tools/types";
interface X {
  a: number;
  b: boolean;
  c: () => boolean;
}

// 将a更名为A
type R1 = Rename<X, { a: "A" }>;
// {  A:number,
//    b:boolean
//    c:()=>boolean
// }
type R2 = Rename<X, { a: "A"; b: "B" }>;
// {  A:number,
//    B:boolean
//    c:()=>boolean
// }
```

### FileSize

**类型：**`FileSize`

表示文件大小的类型，支持纯数字（字节数）或带单位的字符串格式，可以调用`parseFileSize`函数解析。

支持的单位包括：

- B/Byte/Bytes：字节
- K/KB/kb：千字节
- M/MB/mb：兆字节
- G/GB/gb：吉字节
- T/TB/tb：太字节
- P/PB/pb：拍字节
- E/EB/eb：艾字节

**例：**: `1kb`、`23MB`、`123GB`、`1MB`、`32E`、`41TB`、`13Bytes`

```typescript
// 函数参数类型
function validateFileSize(size: FileSize): boolean {
  // 实现文件大小验证逻辑
  return true;
}

validateFileSize("100MB"); // ✅ Correct
validateFileSize(100); // ✅ Correct
validateFileSize("100"); // ❌ ERROR
```

### TimeDuration

**类型：**`TimeDuration`

时间表示，可以使用`parseTimeDuration`函数返回毫秒数。

支持以下格式：

- 纯数字（毫秒）：`1000` 或 `'1000'`
- 带单位简写：
  - 毫秒: `'100ms'`
  - 秒: `'30s'`
  - 分钟: `'5m'`
  - 小时: `'2h'`
  - 天: `'1d'` 或 `'1D'`
  - 周: `'2w'` 或 `'2W'`
  - 月: `'3M'`
  - 年: `'1y'` 或 `'1Y'`
- 带单位全称：
  - `'500Milliseconds'`
  - `'30Seconds'`
  - `'5Minutes'`
  - `'2Hours'`
  - `'1Days'`
  - `'2Weeks'`
  - `'3Months'`
  - `'1Years'`

```typescript
const short: TimeDuration = "30s"; // ✅ Correct
const long: TimeDuration = "1h30m"; // ✅ Correct
const days: TimeDuration = "7d"; // ✅ Correct
const ms: TimeDuration = 5000; // ✅ Correct
const strMs: TimeDuration = "5000"; // ✅ Correct
const full: TimeDuration = "2Weeks"; // ✅ Correct
```

### Merge

**类型：**`Merge<T extends any[]> `

合并输入的多个类型

```typescript twoslash
import { Merge } from "flex-tools/types";
type Foo = { a: number };
type Bar = { b: string };
type Baz = { c: boolean };
type Merged = Merge<[Foo, Bar, Baz]>;
// == Foo & Bar & Baz
// 返回 { a: string; b: number; c: boolean; } ，它包含了输入数组中所有类型的属性。
```

### Primitive

原始类型

```ts
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
```

### IsNumberLike

判断是否是数字类型

```ts twoslash
import { IsNumberLike } from "flex-tools/types";

type A = IsNumberLike<"1">;
//=> true

type B = IsNumberLike<"-1.1">;
//=> true

type C = IsNumberLike<1>;
//=> true

type D = IsNumberLike<"a">;
//=> false
```

### Fallback

**类型：**`Fallback<T, F>`

当`T`为`never`时，返回`F`，否则返回`T`。

```typescript twoslash
import { Fallback } from "flex-tools/types";

type A = Fallback<never, "a">;
//=> 'a'

type B = Fallback<"a", "b">;
//=> 'a'
```
