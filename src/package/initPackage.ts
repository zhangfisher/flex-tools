/**
 * 
 * 初始化包工程
 * 
 */

import { execScript } from "../misc";
import path from "node:path"
import fs from "node:fs"
import { installPackage } from "./installPackage";
import { promisify } from "../func/promisify";
import { replaceVars } from "../string";

const gitignore = `
node_modules
logs
*.log
.idea
.DS_Store
npm-debug.log*
yarn-debug.log* 
yarn-error.log*
lerna-debug.log*
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
*.pid
*.seed
*.pid.lock
coverage 
.nyc_output
.grunt
bower_components
node_modules/
jspm_packages/
*.tsbuildinfo
.npm
dist/
.eslintcache
`

export interface  PackageInfo{
    name:string
    version?:string
    description?:string
    author?:string
    license?:string
    main?:string
    module?:string
    types?:string
    type?:"module" | "commonjs"
    scripts?:Record<string,string>
    dependencies?:Record<string,string>
    devDependencies?:Record<string,string>
    peerDependencies?:Record<string,string>
    optionalDependencies?:Record<string,string>
    bundledDependencies?:Record<string,string>
    [key:string]:any
}
export type DependencieType = 'dev' | 'prod' | 'peer' | 'optional'  | 'bundle'
export interface InitPackageOptions{
    location?:string                                        // 初始化位置路径
    src?:string                                             // 源文件路径,默认是当前目录
    typescript?:boolean | string                            // 是否使用typescript,true=使用默认配置,字符串=tsconfig.json文件内容，"file:tsconfig.json"=使用指定的tsconfig.json文件
    git?:boolean                                            // 是否初始化git              
    dependencies?:(string | [string,DependencieType])[]     // 依赖包, [包名,依赖类型]
    silent?:boolean                                         // 是否静默输出
    // 安装依赖前的回调函数
    onBeforeInstallDependent? :(packageName:string,installType:DependencieType)=>void
    // 安装依赖后的回调函数
    onAfterInstallDependent?:(error:null | Error,packageName:string,installType:DependencieType)=>void
    installTool?: "auto" | "npm" | "yarn" | "pnpm"          // 包安装工具
    // 需要复制的文件
    // 源文件 , [源文件,目标文件或文件夹] , [源文件,目标文件,{插值变量}]
    files?:(string | [string,string] | [string,string,Record<string,any>])[]                      
    // 当复制文件后的回调函数
    onBeforeCopyFile?:(src:string,desc:string)=>void
    onAfterCopyFile?:(error:null | Error,src:string,desc:string)=>void
}

const copyFile = promisify(fs.copyFile)

export async function initPackage(packageNameOrInfo:string | PackageInfo,options?:InitPackageOptions){        
    let {location,src='src',silent=true,git=false,typescript=true,dependencies=[],installTool='pnpm',files=[]} = Object.assign({},options)
    const cwd = process.cwd()
    const packageJson = typeof(packageNameOrInfo) == "string" ? {
        name:packageNameOrInfo,
        verison:"1.0.0",
    } : packageNameOrInfo
    if(!packageJson.name || packageJson.name.trim()===""){
        throw new Error("package name is required")
    }
    try{
        if(typeof(location)!='string') location= cwd
        if(!path.isAbsolute(location!)) location = path.join(cwd, location)
        const packagePath = path.join(location!,packageJson.name)
        if(!fs.existsSync(packagePath)){
            fs.mkdirSync(packagePath,{recursive:true})
        }
        const pkgFile = path.join(packagePath,"package.json")
        if(!fs.existsSync(pkgFile)){
            fs.writeFileSync(pkgFile,JSON.stringify(packageJson,null,4),{encoding:"utf-8"})
        }
        process.chdir(packagePath)
        // 初始化typescript
        if(typescript){
            if(typeof(typescript)=="string"){
                if(typescript.startsWith("file:")){
                    const tsconfigFile = path.join(packagePath,typescript.substring(5))
                    if(fs.existsSync(tsconfigFile)){
                        fs.copyFileSync(tsconfigFile,path.join(packagePath,"tsconfig.json"))
                    }else{
                        await execScript("tsc --init",{silent})
                    }
                }else{
                    fs.writeFileSync(path.join(packagePath,"tsconfig.json"),typescript,{encoding:"utf-8"})
                }
            }else{
                await execScript("tsc --init",{silent})
            }            
        }
        // 创建src目录
        if(src){
            fs.mkdirSync(path.join(packagePath,src),{recursive:true})            
            fs.mkdirSync(path.join(packagePath,src,"__tests__"),{recursive:true})    
        }
        // 初始化git
        if(git){
            await execScript("git init",{silent:true})
            fs.writeFileSync(path.join(packagePath,".gitignore"),gitignore)
        }
        if(Array.isArray(dependencies)){
            for(let depend of dependencies){
                const [packageName,dependencieType] = (Array.isArray(depend) ? depend : [depend,"prod"]) as [string,DependencieType]
                if(packageName){
                    let hasError = null
                    try{
                        options?.onBeforeInstallDependent?.(packageName,dependencieType)
                        await installPackage(packageName,{
                            silent,
                            use:installTool,
                            location:packagePath,
                            type:dependencieType,
                            ignoreError:false
                        })
                    }catch(e:any){
                        hasError = e
                    }
                    options?.onAfterInstallDependent?.(hasError,packageName,dependencieType)
                }            
            }
        }
        if(Array.isArray(files)){
            for(let file of files){                
                const [src,dest,vars] = Array.isArray(file) ? file : [file,"./",undefined]                
                const srcFile =path.isAbsolute(src) ? src : path.join(cwd,src)                
                const destFile = dest.trim().endsWith("/") ? path.join(packagePath,dest.trim(),path.basename(srcFile)) : path.join(packagePath,dest.trim())
                options?.onBeforeCopyFile?.(srcFile,destFile)
                try{
                    if(fs.existsSync(srcFile)){
                        const destPath = path.dirname(destFile)
                        if(!fs.existsSync(destPath)){
                            fs.mkdirSync(destPath,{recursive:true})
                        }                                   
                        if(vars && typeof(vars)=="object"){ // 有插值变量时，需要读取文件内容，替换插值变量后再写入
                            const srcContext = await promisify(fs.readFile)(srcFile)
                            const destContext = replaceVars(srcContext.toString(),vars)
                            await promisify(fs.writeFile)(destFile,destContext)
                        }else{
                            await copyFile(srcFile,destFile)
                        }
                    }
                    options?.onAfterCopyFile?.(null,srcFile,destFile)
                }catch(e:any){
                    options?.onAfterCopyFile?.(e,srcFile,destFile)
                }                
                
            }
        }
        return packageJson
    }finally{
        process.chdir(cwd)
    }
}


// {a} {b}
// const args = process.argv.slice(2)
// initPackage({
//     name:args[0],
//     version:"1.0.0",
// },{
//     location:"c://temp//initpackages",
//     dependencies:[
//         "nanoid",
//         ["lodash",'dev']
//     ],
//     files:[
//         ['./index.ts','./src/index.ts'],
//         'getPackageTool.ts',
//         ['initPackage.ts','./',{a:111,b:222}],
//     ],
//     onBeforeInstallDependent(packageName,installType){
//         console.log(`安装依赖包${packageName}(${installType})...`)
//     },
//     onAfterInstallDependent(error,packageName,installType){
//         if(error){
//             console.error(`安装依赖包${packageName}(${installType})失败,错误信息:${error.message}`)
//         }else{
//             console.log(`安装依赖包${packageName}(${installType})成功`)
//         }
//     },
//     onBeforeCopyFile(src,desc){
//         console.log(`复制文件${src}...`)
//     },
//     onAfterCopyFile(error,src,desc){
//         if(error){
//             console.error(`复制文件${src}失败,错误信息:${error.message}`)
//         }else{
//             console.log(`复制文件${src}成功`)
//         }
//     }
// })
