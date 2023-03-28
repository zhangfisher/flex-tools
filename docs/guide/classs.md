
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

返回指定名称的方法是否是一个属性，即(`GET`、`SET`)

```typescript
function isPropertyMethod(inst:object, name:string)
```