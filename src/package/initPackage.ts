/**
 * 
 * 初始化包工程
 * 
 */

import { execScript } from "../misc";
import path from "node:path"
import fs from "node:fs"
import { installPackage } from "./installPackage";

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
    // 安装依赖前的回调函数
    onBeforeInstallDependent :(packageName:string,installType:DependencieType)=>void
    // 安装依赖后的回调函数
    onAfterInstallDependent:(error:null | Error,packageName:string,installType:DependencieType)=>void
    installTool?: "auto" | "npm" | "yarn" | "pnpm"          // 包安装工具
    files:(string | [string,string])[]                      // 需要复制的文件
    // 当复制文件后的回调函数
    onBeforeCopyFile:(src:string,desc:string)=>void
    onAfterCopyFile:(error:null | Error,src:string,desc:string)=>void
}

export async function initPackage(packageNameOrInfo:string | PackageInfo,options?:InitPackageOptions){        
    let {location,src='src',git=false,typescript=true,dependencies=[],installTool='pnpm',files=[]} = Object.assign({},options)
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
                        await execScript("tsc --init")
                    }
                }else{
                    fs.writeFileSync(path.join(packagePath,"tsconfig.json"),typescript,{encoding:"utf-8"})
                }
            }else{
                await execScript("tsc --init")
            }            
        }
        // 创建src目录
        if(src){
            fs.mkdirSync(path.join(packagePath,src),{recursive:true})            
        }
        // 初始化git
        if(git){
            await execScript("git init",{silent:true})
        }
        if(Array.isArray(dependencies)){
            for(let depend of dependencies){
                const [packageName,dependencieType] = (Array.isArray(depend) ? depend : [depend,"prod"]) as [string,DependencieType]
                if(packageName){
                    let hasError = null
                    try{
                        options?.onBeforeInstallDependent(packageName,dependencieType)
                        await installPackage(packageName,{
                            use:installTool,
                            location:packagePath,
                            type:dependencieType,
                            ignoreError:false
                        })
                    }catch(e:any){
                        hasError = e
                    }
                    options?.onAfterInstallDependent(hasError,packageName,dependencieType)
                }            
            }
        }
        if(Array.isArray(files)){
            for(let file of files){
                const [src,dest] = Array.isArray(file) ? file : [file,"./"]                
                const srcFile =path.isAbsolute(src) ? src : path.join(cwd,src)                
                const destFile = path.join(packagePath,dest)
                if(fs.existsSync(srcFile)){
                    const destPath = path.dirname(destFile)
                    if(!fs.existsSync(destPath)){
                        fs.mkdirSync(destPath,{recursive:true})
                    }           
                    
                    fs.copyFileSync(srcFile,destFile)
                }
            }
        }
        return packageJson
    }finally{
        process.chdir(cwd)
    }
}