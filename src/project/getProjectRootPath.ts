import path from "path"
import { InvalidProjectPathError } from "../errors"
import fs from "fs-extra"

export function getProjectRootPath(entryPath:string="./",exclueCurrent:boolean=false):string | null{
    if(!path.isAbsolute(entryPath)){
        entryPath = path.join(process.cwd(),entryPath)
    }
    try{ 
        const pkgFile =exclueCurrent ? 
                        path.join(entryPath, "..", "package.json")
                        : path.join(entryPath, "package.json")
        if(fs.existsSync(pkgFile)){ 
            return path.dirname(pkgFile)
        }
        const parent = path.dirname(entryPath)
        if(parent===entryPath) return null
        return getProjectRootPath(parent,false)
    }catch(e){
        throw new InvalidProjectPathError()
    }
}
