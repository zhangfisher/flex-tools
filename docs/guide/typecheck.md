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

## isPrimitive 

判断值是否是原始值类型，即值为`string | number | boolean | symbol | bigInt | null | undefined`

## isCollection

当值是`Array`,`Set`,`Map`,`{}`,`WeakMap`,`WeakSet`时返回`true`