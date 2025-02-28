import type { PackageJson } from "type-fest";
import { getPackageRootPath } from "./getPackageRootPath";
import path from "node:path"

/**
 * 
 * @param entry 
 * @param findUp   是否向上查找package.json，默认为true
 * @returns 
 */
export function getPackageJson(entry?:string,findUp:boolean = true):PackageJson | undefined{
    const packageRoot =findUp ? getPackageRootPath(entry) as string : entry || process.cwd()
    try{
        return require(path.join(packageRoot,"package.json")) 
    }catch{
        return undefined
    }
}
 