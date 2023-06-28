import { InvalidProjectPathError } from "../errors"
import { getPackageRootPath } from "./getPackageRootPath"
import path from "node:path"
import fs from "node:fs"
import { assignObject } from '../object/assignObject'; 


export interface PackageIsInstalledOptions{
    location?:string            // 指定一个位置，未指定则使用当前项目的位置
}

/**
 * 查询指定的包是否安装，如果安装则返回版本号
 * @param packageName
 */
export async function packageIsInstalled(packageName:string,options?:PackageIsInstalledOptions):Promise<boolean>{
    const {location} = assignObject({
        checkGlobal:false
    },options)
    const packageRoot = getPackageRootPath(location)
    if(!packageRoot) throw new InvalidProjectPathError()
    let installed:boolean = false 
    try{
        const pkgJsonFile = path.join(packageRoot,"node_modules",packageName,"package.json")        
        installed = fs.existsSync(pkgJsonFile)
    }catch(e){}
    return installed
}