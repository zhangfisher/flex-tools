
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

class A{
    static value:number | number[] = 1
    get(){ return getClassStaticValue(this,"value",{default:[]}) }
}        
class AA extends A{
    static value:number | number[] = 2
}        
class AAA extends AA{
    static value = [3,4]
}
let a = new AAA()
console.log(a.get()) //==== [1,2,3,4]

 ```

## isPropertyMethod

返回指定名称的方法是否是一个属性，即(`GET`、`SET`)

```typescript
function isPropertyMethod(inst:object, name:string)
```

## getClassMethods

返回类中声明的方法列表

```typescript

export interface GetClassMethodsOptions{
    includePrototype?:boolean                  // 是否包含原型链上的所有方法
    excludes?:(string | symbol)[] | ((name:string | symbol)=>boolean)       // 排除
}

export function getClassMethods(obj:object,options?:GetClassMethodsOptions)

// 示例
class A{
    x(){}
    y(){}
}
class AA extends A{
    a1(){}
    a2(){}
    a3(){}
}

getClassMethods(new A())   //   ['x','y']
getClassMethods(new AA())   //   ['x','y','a1','a2','a3']
// 不在父类和祖先类中查找
getClassMethods(new AA(),{includePrototype:false})   //   ['x','y','a1','a2','a3']

getClassMethods(new AA(),{includePrototype:false,excludes:['x']})   //   ['y','a1','a2','a3']
```
