# 包

本工具函数用于编写`nodejs`应用时使用，用来操作当前包工程。

# getProjectRootPath

返回当前包工程所在的根路径。

```typescript
function getProjectRootPath(entryPath:string="./",exclueCurrent:boolean=false):string | null
```

- `getProjectRootPath`会从指定的extryPath开始向上查找`package.json`文件
- `entryPath`默认以当前路径为起点。

# getPackageJson

返回当前工程的`package.json`文件内容

```typescript
function getPackageJson()
```

# getPackageTool

返回当前项目所使用的包管理工具。

```typescript
function getPackageTool():('pnpm' | 'npm' | 'yarn')[]
```

- getPackageTool通过检查当前工程根目录下是否存在`pnpm-lock.yaml`和`yarn.lock`来判断当前工程所使用的包管理工具。

# installPackage

安装指定的包。

```typescript
interface installPackageOptions{
    location?:string                                // 安装位置
    silent?: boolean                                // 执行安装时静默输出
    type?: 'prod' | 'dev' | 'peer' | 'optional'     // 安装开发依赖 
    global?: boolean                                // 安装为全局依赖
    upgrade?: boolean                               // 当依赖已经安装时是否进行升级 
    use?:"auto" | string                            // 使用哪一个包工具
    ignoreError?:boolean                            // 忽略错误
}
async function installPackage(packageName:string,options?:installPackageOptions)

```

- `location`：安装位置，默认为当前工程根目录下。`location`可以是任意的路径，安装时会向上查找`package.json`文件，然后进行安装
- 如果安装成功则返回`true`,否则返回`false`
- `use`默认使用`pnpm`

# packageIsInstalled

查询某个包是否已经安装。

```typescript

async function packageIsInstalled(packageName:string,checkGlobal:boolean=false):Promise<boolean>

```
- `checkGlobal`参数用来指定是否在全局进行检查。


# updatePackageJson

更新当前工程的`package.json`

```typescript
interface UpdatePackageJsonOptions{
    location:string                 // 指定入口文件夹，如果不指定则使用当前工作目录
}
function updatePackageJson(data:Record<string,any>,options?:UpdatePackageJsonOptions)
```
- `location`用来指定入口文件夹，如果不指定则使用当前工作目录。当没有指定时会以当前文件夹为起点查找`package.json`文件。如果有指定则会以指定的文件夹为起点查找`package.json`文件。


# initPackage

初始化一个标准的nodejs包

```typescript
export type DependencieType = 'dev' | 'prod' | 'peer' | 'optional'  | 'bundle'
export interface InitPackageOptions{
    location?:string                                        // 初始化位置路径
    src?:string                                             // 源文件路径,默认是当前目录
    // 是否使用typescript,true=使用默认配置,字符串=tsconfig.json文件内容，"file:tsconfig.json"=使用指定的tsconfig.json文件
    typescript?:boolean | string                           
    git?:boolean                                            // 是否初始化git              
    dependencies?:(string | [string,DependencieType])[]     // 依赖包, [包名,依赖类型]
    // 安装依赖前的回调函数
    onBeforeInstallDependent :(packageName:string,installType:DependencieType)=>void
    // 安装依赖后的回调函数
    onAfterInstallDependent:(error:null | Error,packageName:string,installType:DependencieType)=>void
    installTool?: "auto" | "npm" | "yarn" | "pnpm"          // 包安装工具
    files:(string | [string,string] | [string,string,Record<string,any>])[]                      // 需要复制的文件
    // 当复制文件后的回调函数
    onBeforeCopyFile:(src:string,desc:string)=>void
    onAfterCopyFile:(error:null | Error,src:string,desc:string)=>void
}

async function initPackage(packageNameOrInfo:string | PackageInfo,options?:InitPackageOptions)

```

- `packageNameOrInfo`：包名或者包信息JSON对象
- `location`：包的存放位置，默认为当前目录下
- `src`：创建一个`src`源文件夹
- `typescript`：是否使用`typescript`
    - 如果为`true`则使用`tsc --init`生成`tsconfog.json`; 
    - 字符串：`typescript=<tsconfog.json内容字符串>`
    - 模板文件：`typescript=file:<tsconfog.json模板文件路径>`    
- `git`：是否初始化`git`
- `dependencies`：安装依赖包
- `onBeforeInstallDependent`和`onAfterInstallDependent`：安装依赖包前后的回调函数,当需要显示安装进度时可以使用这两个回调函数。
- `onBeforeCopyFile`和`onAfterCopyFile`：复制文件前后的回调函数,当需要显示复制进度时可以使用这两个回调函数。
- `files`：指定需要复制的文件,暂不支持通配符,也不支持文件夹。
    - `files=["c:/temp/a.js"]`表示复制`a.js`到目标文件夹下
    - `files=[["c:/temp/a.js","src/"]]`表示复制`a.js`到目标文件夹`src`下
    - `files=[["c:/temp/a.js","b.js"]]`表示复制`a.js`到目标文件夹下的`b.js`文件
    - `files=[["c:/temp/a.js","src/b.js"]]`表示复制`a.js`到目标文件夹下的`src/b.js`文件
    - `files=[["c:/temp/a.js","src/b.js",{x:1,y:2}]]`表示读取`a.js`并对文件内容执行插值变量替换，然后复制到目标文件夹下的`src/b.js`文件.
- 复制文件时允许对原始文件内容进行插值变量替换。方法是指定`files=[["c:/temp/a.js","src/b.js",{x:1,y:2}]]`，然后在`原始`文件中使用`{{x}}`和`{{y}}`表示变量。

**示例：**

```typescript
const args = process.argv.slice(2)
    initPackage({
        name:args[0],
        version:"1.0.0",
    },{
        location:"c://temp//initpackages",
        dependencies:[
            "nanoid",
            ["lodash",'dev']
        ],
        files:[
            ['./index.ts','./src/index.ts'],
            'getPackageTool.ts'
        ],
        onBeforeInstallDependent(packageName,installType){
            console.log(`安装依赖包${packageName}(${installType})...`)
        },
        onAfterInstallDependent(error,packageName,installType){
            if(error){
                console.error(`安装依赖包${packageName}(${installType})失败,错误信息:${error.message}`)
            }else{
                console.log(`安装依赖包${packageName}(${installType})成功`)
            }
        },
        onBeforeCopyFile(src,desc){
            console.log(`复制文件${src}...`)
        },
        onAfterCopyFile(error,src,desc){
            if(error){
                console.error(`复制文件${src}失败,错误信息:${error.message}`)
            }else{
                console.log(`复制文件${src}成功`)
            }
        }
    })
```

# getPackageEntry

 读取包的入口文件，即`main`字段值

 ```js
 
 getPackageEntry() // 返回当前包入口main值
 getPackageEntry({absolute:true}) // 返回绝对路径
 // 指定一个入口文件夹，获取该入口所在的包的main值
 getPackageEntry({entry:"/usr/app"}) 

 ```
