# 文件系统

## forEachUp

向上遍历祖先文件夹

```typescript
interface findUpOptions{
    includeSelf?:boolean,                   // 结果是否包含当前文件夹
    base?:string,                          // 入口文件夹,默认为当前文件夹
}

function forEachUp(callback:(folder:string)=>Symbol | void,options?:findUpOptions)

forEachUp((folder)=>{
    console.log(folder)
})
```

- 通过返回`ABORT`可以中断遍历
- 默认是从当前文件夹开始向上遍历，可以通过`base`参数指定入口文件夹
- 默认结果不包含当前文件夹，可以通过`includeSelf`参数指定是否包含当前文件夹


## findUp

向上查找指定的文件，并返回找到的文件路径列表

```typescript
export interface FindUpOptions{
    includeSelf?:boolean,                   // 是否包含当前文件夹
    entry?:string                           // 查找起点,默认为当前文件夹
    onlyFirst?:boolean                      // 是否只查找第一个文件
}

export function findUp(files:string | string[], options?:FindUpOptions)

// 示例：

// 当前文件夹为d:/code/web/app/src
//  d:/code
//       |--myapp
//          |--/src
//          |--/dist
//          |--/package.json
//          |--tsconfig.json
//          |--tsconfig.ts
//  d:/code/myapp/src


// CWD=d:/code/myapp/src
// 从当前路径向上查找package.json文件
findUp('package.json')  //= ["d:/code/myapp/package.json"]
findUp('package.json',{entry:"c:/code/myapp/src"}) // 从c:/code/myapp/src向上查找package.json文件
// 从当前路径向上查找'tsconfig.json','tsconfig.ts'
findUp(['tsconfig.json','tsconfig.ts']) // = ["d:/code/myapp/tsconfig.json","d:/code/myapp/tsconfig.ts"]

```

- 默认是从当前文件夹开始向上查找，可以通过`entry`参数指定入口文件夹
- 默认结果不包含当前文件夹，可以通过`includeSelf`参数指定是否包含当前文件夹
- 默认查找所有匹配的文件，可以通过`onlyFirst`参数指定是否只查找第一个文件
- 如果找不到文件，则返回空数组
- 如果找到文件，则返回文件路径列表
 

## includePath

判断某个文件夹或文件是否在指定的文件夹下

```typescript

 function includePath(src: string, basePath: string): boolean

// const p1 = "c:/temp/a/b/c"
// const p2 = "d:/temp/c"
// const p3 = "d:/temp/a/b/c.zip"
// const base = "c:/temp"
// console.log(includePath(p1,base)) // true
// console.log(includePath(p2,base)) // false
// console.log(includePath(p3,base)) // false

```



## fs

对`fs`模块的`promise`包装,对标准的使用`callback`的异步函数全部进行了`promise`包装。

```typescript
import {mkdir,writeFile,readFile} from 'flex-tools/fs/nodefs'

await mkdir('d:/temp/a/b/c',{recursive:true})
await writeFile('d:/temp/a/b/c.txt','hello world')
await readFile('d:/temp/a/b/c.txt','utf-8')
//.....

```

- 注意，生成的函数不支持类型提示。


## cleanDir

清空文件夹

```typescript
interface CleanDirOptions{
    ignoreError?:boolean    
}
function cleanDir(dir:string,options?:CleanDirOptions)
```

## copyDirs

**此特征可以用来生成项目模板。**

复制文件夹内的所有文件(包括子文件夹)到指定的目标文件夹，并且保持源文件夹结构不变。
不同于其他的复制文件夹的功能，`copyDirs`支持模板文件。
引入`art-template`模板引擎，当源文件是`.art`文件时会进行模板渲染，然后再复制到目标文件夹。比如在源文件夹中有一个`package.json.art`文件，内容如下：

```json
{
    "name":"{{name}}",
    "version":"{{version}}"
}
```
则会在目标文件夹中生成一个`package.json`文件，内容如下：

```json
{
    "name":"myapp",
    "version":"1.0.0"
}
```




```typescript

export interface CopyFileInfo{
    file?  : string                                            // 相对于源文件夹的文件路径
    source?: string                                          // 源文件路径
    target?: string                                          // 目标文件路径
    vars?  : null | undefined | Record<string,any>             // 模板变量
}

export interface CopyDirsOptions {
	vars?      : Record<string, any>;         // 传递给模板的变量
	pattern?   : string;                   // 匹配的文件或文件夹，支持通配符
	ignore?    : string[];                  // 忽略的文件或文件夹，支持通配符
    clean?     : boolean                      // 是否清空目标文件夹
    overwrite? : boolean | ((filename: string) => boolean | Promise<boolean>); // 是否覆盖已存在的文件，可以是boolean或返回boolean的同步/异步函数
	before?    : (info:CopyFileInfo) => void | typeof ABORT; // 复制前的回调
	after?     : (info:CopyFileInfo) => void | typeof ABORT; // 复制后的回调
    error?     :(error:Error,{source,target}:{source: string, target: string})=>void | typeof ABORT // 复制出错的回调
}

export async function copyDirs(
	srcDir: string,
	targetDir: string,
	options?: CopyDirsOptions
)
```

- `copyDirs`使用`glob`来匹配文件，所以`pattern`和`ignore`支持通配符。
- `copyDirs`会保持源文件夹的结构不变，所以`targetDir`必须是一个文件夹,如果不存在则会自动创建。
- `vars`参数会传递给模板引擎，用于渲染模板文件,对所有`.art`模板文件生效。如果需要对某个文件传入单独的模板变量，可以在`before`回调中设置`vars`参数。
    
    ```typescript
    copyDirs("c://temp//myapp","d://temp/app",{
        vars:{                          // 这个变量会传递给所有的模板文件
            name:"myapp",
            version:"1.0.0"
        },
        before(info){
            if(info.file === "package.json.art"){
                // 这里的变量会与全局变量合并后果传递给package.json.art模板文件
                info.vars = {   
                    name:"myapp",
                    version:"1.0.0"
                }
            }
        }
    })
    ```
-  `before`回调会在复制文件前调用，可以在这里修改`vars`参数，或者返回`ABORT`来阻止复制。
 

## copyFiles

复制文件符合通配符的文件到指定的目标文件夹。

```ts
export interface CopyFilesOptions {
	vars?: Record<string, any>;         // 传递给模板的变量 
	ignore?: string[];                  // 忽略的文件或文件夹，支持通配符
    clean?:boolean                      // 是否清空目标文件夹
    cwd?:string;                        // pattern的cwd
    overwrite?: boolean | ((filename: string) => boolean | Promise<boolean>); // 是否覆盖已存在的文件，可以是boolean或返回boolean的同步/异步函数
	before?: (info:CopyFileInfo) => void | typeof ABORT; // 复制前的回调
	after?: (info:CopyFileInfo) => void | typeof ABORT; // 复制后的回调
    error?:(error:Error,{source,target}:{source: string, target: string})=>void | typeof ABORT // 复制出错的回调
}
export async function copyFiles(
	pattern: string,
	targetDir: string,
	options?: CopyFilesOptions
)
```

- 支持与`copyDirs`相同的功能参数。
- `pattern`参数支持通配符，内部使用`glob`。
- `targetDir`必须是一个文件夹,如果不存在则会自动创建。
- 复制时会保持源文件夹的结构不变。


## getExistedDir

返回第一个存在的文件夹

```typescript

getExistedDir([
    "./a",
    "./b",
    "./c",
    "/var/www/static"
],{
    cwd:"code",        // 当前文件夹，如果没指定则为当前文件夹
    absolute:true       // 返回绝对路径
})  
```

## fileIsExist

判断文件是否存在

```typescript
fileIsExist("./a/b/c")  // true
fileIsExist("./a/b/c/d")  // false
``` 

## fs

对`node:fs`的`promise`包装,对标准的使用`callback`的异步函数全部进行了`promise`包装。

```typescript
import {mkdir,writeFile,readFile} from 'flex-tools/fs/nodefs'
await mkdir('d:/temp/a/b/c',{recursive:true})  // 创建文件夹

```
