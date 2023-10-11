/**
 * 读取包的入口文件，即main字段值
 * 
 * 
 */
import {getPackageJson} from "./getPackageJson"
import path from "node:path"

export interface GetPackageEntryOptions{
    entry?:string
    absolute?:boolean
}

export function getPackageEntry(options:GetPackageEntryOptions){
    const { entry=process.cwd(),absolute } = options || {}
    let entryFile
    const packageJson = getPackageJson(entry)
    if(packageJson.main){
        entryFile =  packageJson.main
    }else{        
        entryFile ="./src/index.ts"
    }
    return absolute ? path.join(entry || process.cwd(),entryFile) : entryFile
}