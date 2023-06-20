import { getPackageRootPath } from "./getPackageRootPath";
import path from "node:path"


export function getPackageJson(entry?:string){
    const packageRoot = getPackageRootPath(entry) as string
    return require(path.join(packageRoot,"package.json"))
}