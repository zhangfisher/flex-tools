import { InvalidProjectPathError } from "../errors"
import { getPackageRootPath } from "./getPackageRootPath"
import path from "path"
import { execScript } from "../misc/execScript"

/**
 * 查询指定的包是否安装，如果安装则返回版本号
 * @param packageName
 */
export async function packageIsInstalled(packageName:string,checkGlobal:boolean=false):Promise<boolean>{
    const packageRoot = getPackageRootPath()
    if(!packageRoot) throw new InvalidProjectPathError()
    let installed:boolean = false
    //
    try{
        require.resolve(packageName)
        installed = true
    }catch{
        return false
    }
    if(checkGlobal){
        try{
            const npmRootPath = await execScript("npm root") as  string
            if(npmRootPath){
                require(path.join(npmRootPath,`node_modules/${packageName}/package.json`))
                installed = true
            }            
        }catch(e){}        
    }
    return installed
}