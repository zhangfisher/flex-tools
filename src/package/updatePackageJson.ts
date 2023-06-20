import { getPackageRootPath } from "./getPackageRootPath";
import path from "node:path"
import fs from "node:fs"
import { deepMerge } from '../object/deepMerge';


export interface UpdatePackageJsonOptions{
    location:string                 // 指定入口文件，如果不指定则使用当前工作目录
}

export function updatePackageJson(data:Record<string,any>,options?:UpdatePackageJsonOptions){
    const { location } = options || {}
    const packageRoot = getPackageRootPath(location) as string
    const pkgPath = path.join(packageRoot,"package.json")
    const jsonData =  require(pkgPath)
    deepMerge(jsonData,data)
    fs.writeFileSync(pkgPath,JSON.stringify(jsonData,null,4))    
}