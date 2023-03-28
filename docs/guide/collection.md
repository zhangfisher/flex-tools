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

构建一个形如`{[name]:{....},[name]:{....},...}`对象容器，容器中的每一个成员均具有一个唯一名称。

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