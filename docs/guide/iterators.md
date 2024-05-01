# Iterators

一些迭代工具。

## canIterate

检查一个对象是否可以迭代，即是否有`Symbol.iterator`属性。

```ts

import { canIterate } from 'flex-tools/iterators/canIterate';

canIterate([])  // =true
canIterate({})  // =false
canIterate('')  // =true
```


## flexIterator

用来创建一个迭代器，`FlexIterator`支持构建参数：

```ts

class FlexIterator<Value=any,Result=Value,Parent=Value>;

interface FlexIteratorOptions<T> {
    filter?:(item:Value | Parent)=>Value | Iterable<any> | {value:Value | Iterable<any>,parent:Parent}
    transform:(value:Value,parent?:Parent)=>Result
    // 当filter返回一个迭代对象时，是否递归遍历,默认为false
    recursion?:boolean
}
```

- `类型`

    - `Value`：迭代的值的类型。
    - `Result`：迭代的结果的类，即transform返回结果值。
    - `Parent`：父级迭代的值的类型，当启用递归迭代时，用来传递父级迭代的值。


- `filter`：

用来将迭代的值进行预处理和过滤，该返回可以返回:

    - Value:   一个新的值
    - 可迭代对象：如果返回一个可迭代对象并且`recursion=true`，将会对该对象进行迭代。
    - {value:Value,parent:Parent}：返回一个新的值和父级迭代对象。



- `transform`：

用来对迭代的值进行转换。



**示例：**

```ts

import { FlexIterator } from 'flex-tools/iterators/flexIterator';

const source = new FlexIterator([1,2,3,4,5])
for(let value of source){
 console.log(value)
}
// Output: 1,2,3,4,5

const source = new FlexIterator([1,2,3,4,5],{
    transform:(value)=>`S-${value}`         // 对迭代的值进行转换
})

for(let value of source){
 console.log(value)
}
// Output: S-1,S-2,S-3,S-4,S-5

const source = new FlexIterator([1,2,[3,4],[5,6,[7,8,[9,10]]]],{
 transform:(value)=>`S-${value}`
 // 当transform返回一个迭代对象时，递归遍历所有可迭代对象
 recursion:true             
})
for(let value of source){
 console.log(String(value))
}
//  Output: S-1,S-2,S-3,S-4,S-5,S-6,S-7,S-8,S-9,S-10
const source = new FlexIterator([1,2,[3,4],[5,6,[7,8,[9,10]]]],{
 transform:(value)=>`S-${value}`
 recursion:false         // 不对迭代对象进行递归迭代
})
for(let value of source){
 console.log(String(value))
}
//  Output: S-1,S-2,S-[3,4],S-[5,6,[7,8,[9,10]]]

```

