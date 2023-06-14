import { getPackageRootPath } from "./getPackageRootPath";
import path from "node:path"


export function getPackageJson(){
    const packageRoot = getPackageRootPath() as string
    return require(path.join(packageRoot,"package.json"))
}