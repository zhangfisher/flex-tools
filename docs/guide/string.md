# 字符串

字符串增强函数均支持两个版本：

- **原型版本**：

函数被直接添加在`String.prototype`，因些需要导入就可以直接使用不需要额外导入。

```typescript
// 导入所有字符串的原型方法
import "flex-tools/string"              
// 只导入部份方法原型方法
import "flex-tools/string/params"
import "flex-tools/string/center"
import "flex-tools/string/firstUpper"
import "flex-tools/string/ljust"
import "flex-tools/string/rjust"
import "flex-tools/string/reverse"
import "flex-tools/string/trimBeginChars"
import "flex-tools/string/trimEndChars"

```
- **函数版本**

如果您不希望污染`String.prototype`,可以使用单独导入函数。

```typescript
// 导入所有字符串的原型方法
import {
    params,
    center,
    firstUpper,
    ljust,
    rjust,
    reverse,
    trimBeginChars,
    trimEndChars
} from "flex-tools/string"              
// 只导入部份方法原型方法
import { params } from "flex-tools/string/params"
import { center } from "flex-tools/string/center"
import { firstUpper } from "flex-tools/string/firstUpper"
import { ljust } from "flex-tools/string/ljust"
import { rjust } from "flex-tools/string/rjust"
import { reverse } from "flex-tools/string/reverse"
import { trimBeginChars } from "flex-tools/string/trimBeginChars"
import { trimEndChars } from "flex-tools/string/trimEndChars"
```

## params

非常强大的对字符串进行变量插值。
 
### 插值占位符

在对字符串进行变量插值时，与一般的变量插值不同，我们还支持**指定额外的前缀和后缀修饰**，插值占位的完整格式如下：

!> `{`<前缀>变量名称<后缀>`}`

- **前缀**: 可选，使用`<前缀内容>`形式，前缀内容会原样输出
- **变量**: 可选的，普通变量字面量，如果省略，则只能使用位置插值方式进行
- **后缀**: 可选，使用`<后缀内容>`形式，后缀内容会原样输出


### 字典插值

```typescript
"this is {a}+{b}".params({a:1,b:2})                 // == "this is 1+2"
"{a}+{b}={c}".params({a:1,b:1,c:2})                 // == "1+1=2"
"{<#>a}+{b<%>}={<<>c<>>}".params({a:1,b:1,c:2})     // == "#1+1%=<2>"
"{a}+{b}={c}".params({a:()=>1,b:()=>1,c:()=>2})     // == "1+1=2"
"{a}+{b}={c}".params({a:1,b:1,c:null},{empty:"空"}) // == "1+1=空"
"{a}+{b}={c}".params({a:undefined,b:null})          // == "+="
// 如果变量值是[],则自动使用,分割
"this is {a}+{b}".params({a:1,b:[1,2]})                 // == "this is 1+1,2"
// 如果变量值是{},则自动使用,分割
"this is {a}".params({a:{x:1,y:2}})                 // == "this is x=1,y=2"
```

### 位置插值

```typescript
"this is {a}+{b}".params([1,2])                 // == "this is 1+2"
"{a}+{b}={c}".params([1,1,2])                 // == "1+1=2"
"{<#>a}+{b<%>}={<<>c<>>}".params([1,1,2])     // == "#1+1%=<2>"
"{a}+{b}={c}".params([()=>1,()=>1,()=>2])     // == "1+1=2"
"{a}+{b}={c}".params([1,1,null],{empty:"空"}) // == "1+1=空"
"{a}+{b}={c}".params([undefined,null])          // == "+="
"{<Line:>name}".params(12)    // =="Line:12"    
"{<file size:>size<MB>}".params(12)    // =="file size:12MB"    
```
位置插值内容除了使用`[]`形式外，还支持位置参数：

```typescript
"this is {a}+{b}".params(1,2)                 // == "this is 1+2"
"{a}+{b}={c}".params(1,1,2)                 // == "1+1=2"
"{<#>a}+{b<%>}={<<>c<>>}".params(1,1,2)     // == "#1+1%=<2>"
"{a}+{b}={c}".params(()=>1,()=>1,()=>2)     // == "1+1=2"
"{a}+{b}={c}".params(1,1,null,{empty:"空"}) // == "1+1=空"
"{a}+{b}={c}".params(undefined,null)          // == "+="
"{<Line:>name}".params(12)    // =="Line:12"    
"{<file size:>size<MB>}".params(12)    // =="file size:12MB"    
```

### 函数插值

当插值变量为函数时，会自动调用函数并使用函数返回值进行插值。

```typescript
"this is {a}+{b}".params(()=>1,()=>2)                 // == "this is 1+2"
"this is {a}+{b}".params([()=>1,()=>2])               // == "this is 1+2"
"this is {a}+{b}".params(()=>[1,2])                   // == "this is 1+2"
"this is {a}+{b}".params(()=>{a:1,b:2})               // == "this is 1+2"
```

### 处理空值

当插值变量为`undefined`和`null`时，默认整个插值内容均不输出。

```typescript
"My name is {name}".params()        //=="My name is "         
"My name is {<[> name <]>}".params(null)      // =="My name is "
"My name is {<[>name<]>}".params("tom")        //=="My name is [tom]"         
```

根据这个特性，就可以在进行日志输出时更加灵活地处理空值。比如:

```typescript
// 变量未定义:module=control
"{error}:{<Module=>module}{<,Line=>line}".params({error:'变量未定义',module:'control'})
// Line前的,只有有提供line变量时才会输出
// 变量未定义:module=control,Line=12
"{error}:{<Module=>module}{<,Line>=line}".params({error:'变量未定义',module:'control',line:12})
```

也可以在`params`的最后一个参数中指定`{empty:"无"}`来配置当插值变量为`undefined`和`null`时，如何处理空值。

```typescript
"My name is {name}".params({$empty:"未知"})        //=="My name is 未知"         
"My name is {<[> name <]>}".params(null,{$empty:"未知"})      // =="My name is [未知]"
```

### 前缀和后缀

前缀和后缀内容采用`<xxx>`进行标识，会原样输出（包括空格）。
需要注意的是，当插值变量值为空时：
- 如果`$empty`参数也为`null`，则前缀和后缀内容会被忽略。
- 如果`$empty`参数不为`null`，则原样输出前缀和后缀内容。

### 配置参数

为了避免参数与插值变量冲突，约定当`params`的最后一个参数是`{...}`,并且包含`$empty`,`$delimiter`,`$forEach`中的任何一个成员时，则代表该参数是配置参数而不是插值变量。
配置参数用来控制一些插值行为。

```typescript

"{a}{b}".params({a:1,b:2})   // {a:1,b:2}是变量字典
"{a}{b}".params({$empty:"空",a:1,b:2})   // 传入的不是变量字典，而是一个配置对象
"{a}{b}".params({$forEach:()=>{},a:1,b:2})   // 传入的不是变量字典，而是一个配置对象


```

- `$empty:string | null`: 当变量值为空时`(undefined,null,[],{})`显示的内容，如果为`null`则不显示.
- `$delimiter:string`: 当变量值是`[]`或`{}`时，使用该分割来连接内容，默认值是`,`。如:
    ```typescript
        "{a}".params({a:[1,2]})   //=="1,2"
        "{a}".params({a:[1,2]},{$delimiter:"_"})   //=="1_2"
        "{a}".params({a:{x:1,y:2}})   // =="x=1,y=2"
        "{a}".params({a:{x:1,y:2}},{$delimiter:"#"})   // =="x=1#y=2"
    ```
- `$forEach:(name:string,value:string,prefix:string,suffix:string)`: 用来遍历插值变量

### 遍历插值变量

`$forEach`控制参数可以指定一个函数用来遍历字符串中的插值变量并进行替换。

```typescript
$forEach:(name:string,value:string,prefix:string,suffix:string):[string,string,string] | string | void | undefined | null

"{a}{b}{<#>c<#>}".params(
        {a:1,b:2,c:3}, 
        {
            $forEach:(name:string,value:string,prefix:string,suffix:string):[string,string,string] | string | void | undefined | null=>{
                console.log(name,value,prefix,suffix)
                return [prefix,value,suffix]            // 分别返回前缀，变量值，后缀
                //return value                            // 返回变量值 
            }
        }
    ) 
    // 控制台输出： 
    // a 1 
    // b 2 
    // c 3 # # 
```

- 当`$forEach`返回[string,string,string]代表插值变量的值为`prefix,value,suffix`
- 当`$forEach`返回`string`代表插值变量的值为`value`
- 如果`$forEach`没有返回值，则不会对插值变量做任何变更。

**利用`$forEach`的机制，可以实现一些比较好玩的特性，比如以下例子，**
    
    - **可以为插值变量值添加终端着色，从而使得在终端输出时插值变量显示为不同的颜色。**

    ```typescript
        import logsets from "logsets"
        const result = "{a}{b}{<#>c<#>}".params(
           {a:1,b:2,c:3}, 
           {
                $forEach:(name:string,value:string,prefix:string,suffix:string):[string,string,string ]=>{
                    let colorizer = logsets.getColorizer("red")
                    // 分别返回前缀，变量值，后缀
                    return [prefix,colorizer(value),suffix]            
                }
           }
        )  
        console.log(result) // 可以将插值内容输出为红色
    ```

    - **遍历字符串中的所有插值变量**

    ```typescript
    "{a}{b}{c}{d}{}{}{}".params({
        $forEach:(name,value,prefix,suffix)=>{
            vars.push(name)
        }
    })
    expect(vars.length).toEqual(7)
    expect(vars).toEqual(["a","b","c","d","","",""]) 
    ```

    - **特殊的插值变量**

    在进行日志输出时，我们需要根据插值变量`module`,`func`,`lineno`输出`Error while execute method(auth/login/13)`，并且当`module`,`func`,`lineno`三个变量均为空时，就输出`Error while execute method`，不显示未尾的`(...)`。

    ```typescript
    // 输出出错时的模块名称、函数名称、行号
    const template = "Error while execute method<{method}>({<(>module/func/lineno<)>})"
    const errInfo = {module:"auth",func:"login",lineno:123}
    const opts = {
        $forEach:(name,value,prefix,suffix)=>{
            if(name=='method'){
                return "hello"
            }else if(name=='module/func/lineno'){
                if(errInfo.module==undefined || errInfo.func || errInfo.lineno){
                    return ['','','']
                }else{
                    return `${errInfo.module}/${errInfo.func ? errInfo.func:'unknow'}/${errInfo.lineno}`
                }
            }
        }
    }
    let text = template.params(opts)
    expect(text).toEqual("Error while execute method<hello>(auth/login/123)")

    text = template.params(opts)
    errorInfo.func = undefined
    expect(text).toEqual("Error while execute method<hello>(auth/unknow/123)")
    //
    errorInfo={}
    text = template.params(opts)
    expect(text).toEqual("Error while execute method<hello>")

    ```
 
 
## replaceVars

`replaceVars`是`String.prototype.params`的内部实现，功能一样，如果您不想将`params`函数注入到`string.prototype`则可以使用`replaceVars`函数。

其函数签名如下：

```typescript
function replaceVars(text:string,vars:any,options?:{
    empty?:string | null,
    delimiter?:string,
    forEach?:(name:string,value:string,prefix:string,suffix:string)=>[string,string,string ]
}):string

console.log(replaceVars("{a}+{b}={c}",{a:1,b:1,c:2})) // Output: "1+1=2"       

```

- `empty`,`delimiter`,`forEach`这三个参数在`params`中使用时，转换为`$empty`,`$delimiter`,`$forEach`


## firstUpper

将首字母变为大写。
```typescript
    "abc".firstUpper() // ==Abc
```
## ljust

输出`width`个字符，字符左对齐，不足部分用`fillChar`填充，默认使用空格填充。

```typescript
"abc".ljust(10) // "abc       "
"abc".ljust(10,"-") // "abc-------"
```

## rjuest

输出`width`个字符，字符右对齐，不足部分用`fillChar`填充，默认使用空格填充。

```typescript
"abc".rjust(10) // "       abc"
"abc".rjust(10,"-") // "-------abc"
```

## center

输出`width`个字符，字符串居中，不足部分用`fillChar`填充，默认使用空格填充。

```typescript
"abc".rjust(7) // "  abc  "
"abc".rjust(7,"-") // "--abc--"
```

## trimBeginChars

截断字符串前面的字符

```typescript
 "abc123xyz".trimBeginChars("abc") // == "123xyz"

 // 从123开始向前截断
"abc123xyz".trimBeginChars("123") // == "xyz"
// 只截断最前的字符==123
"abc123xyz".trimBeginChars("123",true) // == "abc123xyz"
"123abc123xyz".trimBeginChars("123",true) // == "abc123xyz"


```

## trimEndChars

截断字符串未尾的字符

```typescript
"abc123xyz".trimEndChars("xyz") // == "abc123"
// 从123开始向后截断
"abc123xyz".trimEndChars("123") // == "abc"
// 只截断最后的字符
"abc123xyz".trimEndChars("123",true) // == "abc123xyz"
"abc123xyz123".trimEndChars("123",true) // == "abc123xyz"


```


## reverse

反转字符串
```typescript
"123".reverse() // == "321" 

```