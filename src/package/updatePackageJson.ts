import { getPackageRootPath } from "./getPackageRootPath";
import path from "node:path"
import fs from "node:fs"
import { deepMerge } from '../object/deepMerge';

export function updatePackageJson(data:Record<string,any>){
    const packageRoot = getPackageRootPath() as string
    const pkgPath = path.join(packageRoot,"package.json")
    const jsonData =  require(pkgPath)
    deepMerge(jsonData,data)
    fs.writeFileSync(pkgPath,JSON.stringify(jsonData,null,4))    
}