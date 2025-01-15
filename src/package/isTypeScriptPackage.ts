import { fileIsExists } from "../fs/fileIsExists"
import { getPackageRootPath } from "./getPackageRootPath"
import path from "node:path"

/**
 * 判断当前是否是Typescript工程
 * 
 * 
 */
export function isTypeScriptPackage(entry?:string):boolean{
    let projectFolder = getPackageRootPath(entry)
    if(projectFolder){
       return fileIsExists(path.join(projectFolder,"tsconfig.json"))
            || fileIsExists(path.join(projectFolder,"src","tsconfig.json"))
    }
    return false
}
