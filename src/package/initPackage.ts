/**
 * 
 * 初始化包工程
 * 
 */

import { execScript } from "../misc";
import path from "node:path"
import fs from "node:fs"
import { updatePackageJson } from './updatePackageJson';

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

export async function initPackage(packageNameOrInfo:string | PackageInfo,location?:string){        
    const cwd = process.cwd()
    const packageJson = typeof(packageNameOrInfo) == "string" ? {
        name:packageNameOrInfo,
    } : packageNameOrInfo
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
        return packageJson
    }finally{
        await execScript(`cd ${cwd}`)
    }
}