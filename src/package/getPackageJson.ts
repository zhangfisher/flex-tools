import { PackageJson } from "type-fest";
import { getPackageRootPath } from "./getPackageRootPath";
import path from "node:path"


export function getPackageJson(entry?:string):PackageJson | undefined{
    const packageRoot = getPackageRootPath(entry) as string
    try{
        return require(path.join(packageRoot,"package.json")) 
    }catch{
        return undefined
    }
}

export { PackageJson } from "type-fest"