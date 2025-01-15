import path from "node:path"
import { InvalidProjectPathError } from "../errors"
import fs from "node:fs"

/**
 * 获取包的根路径。
 * @param entryPath - 入口路径，默认为当前目录。
 * @param excludeCurrent - 是否排除当前目录查找。
 * @returns 返回包的根路径字符串，如果未找到则返回 null。
 * @throws {InvalidProjectPathError} 当路径无效时抛出错误。
 */
export function getPackageRootPath(entryPath: string = "./", excludeCurrent: boolean = false): string | null {
    if (!path.isAbsolute(entryPath)) {
        entryPath = path.join(process.cwd(),entryPath || "./")
    }
    try{ 
        const pkgFile = excludeCurrent ? 
                        path.join(entryPath, "..", "package.json")
                        : path.join(entryPath, "package.json")
        if(fs.existsSync(pkgFile)){ 
            return path.dirname(pkgFile)
        }
        const parent = path.dirname(entryPath)
        if(parent===entryPath) return null
        return getPackageRootPath(parent,false)
    }catch{
        throw new InvalidProjectPathError()
    }
}
