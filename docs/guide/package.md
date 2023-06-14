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
    silent?: boolean                                // 执行安装时静默输出
    type?: 'prod' | 'dev' | 'peer' | 'optional'     // 安装开发依赖
    global?: boolean                                // 安装为全局依赖
    upgrade?: boolean                               // 当依赖已经安装时是否进行升级 
}
async function installPackage(packageName:string,options?:installPackageOptions)

```

# packageIsInstalled

查询某个包是否已经安装。

```typescript

async function packageIsInstalled(packageName:string,checkGlobal:boolean=false):Promise<boolean>

```
- `checkGlobal`参数用来指定是否在全局进行检查。


