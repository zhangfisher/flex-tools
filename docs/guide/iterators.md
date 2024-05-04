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

根据可迭代对象可迭代创建器，`FlexIterator`支持构建参数：

```ts

class FlexIterator<Value=any,Result=Value,Parent=Value>{
    constructor(values:IteIterable<Value | Iterable<any>>options?:FlexIteratorOptions<Value>)    
}

interface FlexIteratorOptions<T> {
    filter?:(item:Value | Parent)=>Value | Iterable<any> | {value:Value | Iterable<any>,parent:Parent}
    transform:(value:Value,parent?:Parent)=>Result
    // 当filter返回一个迭代对象时，是否递归遍历,默认为false
    recursion?:boolean
}
```
 

**示例：**

- **迭代输入对象，通过`transform`转换值**

```ts

import { FlexIterator } from 'flex-tools/iterators/flexIterator';


const i1 = new FlexIterator([1,2,3,4,5],{transform:(value)=>`S-${value}`})
for(let value of i1){
    console.log(value,",")
}
// Output: S-1,S-2,S-3,S-4,S-5
```

- **默认`recursion:false`，不递归遍历**

```ts 
const i2 = new FlexIterator([1,[2,3],[4,5]],{transform:(value)=>`S-${value}`})
for(let value of i2){
    console.log(value)
}

// Output: S-1,S-2,3,S-4,5
```
- **指定`recursion:true`时，递归遍历**

```ts
const i3 = new FlexIterator([1,[2,3],[4,5]],{transform:(value)=>`S-${value}`,recursion:true})
for(let value of i3){
    console.log(value)
}
// Output: S-1,S-2,S-3,S-4,S-5
```

- **通过`pick`函数从迭代项中提取内容进行迭代**

```ts
const i4 = new FlexIterator(["A","AA","AAA","AAAA","AAAAA"],{
    pick:(value)=>String(value.length),
    transform:(value)=>`S-${value}`
})
for(let value of i4){
    console.log(value)
}
// Output: S-1,S-2,S-3,S-4,S-5
```

- **当进行递归遍历时，`transform`函数可以接收第二个参数`parent`，表示当前迭代项的父级迭代项。**

```ts
const i5 = new FlexIterator([1,[2,3],[4,5]],{
    pick:(value)=>value,
    transform:(value,parent)=>`S-${value} (parent=${parent})`,
    recursion:true
})
for(let value of i5){
    console.log(value)
}
// Output: 
// S-1 (parent=1,2,3,4,5)
// S-2 (parent=2,3)
// S-3 (parent=2,3)
// S-4 (parent=4,5)
// S-5 (parent=4,5) 

```

- **当进行递归遍历时，在`transform`的`parent`参数用获取当前迭代项的父级迭代项**

```ts
const i6 = new FlexIterator([1,[2,3],[4,5]],{
    pick:(value)=>{
        if(Array.isArray(value)){
            return {
                value,
                parent:`P_${value.join("_")}`
            }
        }else{  
            return value    
        }
        
    },
    transform:(value,parent)=>`S-${value} (parent=${parent})`,
    recursion:true
})
for(let value of i6){
    console.log(value)
}
// Output: 
// S-1 (parent=undefined)
// S-2 (parent=P_2_3)
// S-3 (parent=P_2_3)
// S-4 (parent=P_4_5)
// S-5 (parent=P_4_5)
```

- 如果`recursion`为`false`，则`parent`等于输入的迭代对象。如上例中,`parent`等于`[1,[2,3],[4,5]]`。 
- **注意：**当启用递归迭代时，当`pick`返回的是一个可迭代对象时，也会对该对象进行递归迭代。此时要指定终止条件，否则可能会导致无限递归。


- **跳过迭代**

可以在`pick`或`transform`中返回`SKIP`来跳过指定的迭代项。

```ts
import { FlexIterator,SKIP } from 'flex-tools/iterators/flexIterator';

const i1 = new FlexIterator([1,2,3,4,5,6,7],{
    pick:(value)=>value % 2 ==0 ? SKIP : value,
    transform:(value)=>`S-${value}`
})
for(let value of i1){
    console.log(value)
}
// Output:
// S-1
// S-3
// S-5
// S-7
```