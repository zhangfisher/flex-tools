import { InvalidProjectPathError } from "../errors"
import { getProjectRootPath } from "./getProjectRootPath"
import path from "path"

/**
 * 查询指定的包是否安装，如果安装则返回版本号
 * @param packageName
 */
export async function packageIsInstalled(packageName:string,checkGlobal:boolean=false):Promise<boolean>{
    const packageRoot = getProjectRootPath()
    if(!packageRoot) throw new InvalidProjectPathError()
    let installed:boolean = false
    //
    try{
        //require(path.join(packageRoot,`node_modules/${packageName}/package.json`))
        require.resolve(packageName)
        installed = true
    }catch{
        return false
    }
    if(checkGlobal){
        try{
            const npmRootPath = await asyncExecShellScript("npm root") as  string
            if(npmRootPath){
                require(path.join(npmRootPath,`node_modules/${packageName}/package.json`))
                installed = true
            }            
        }catch(e){}        
    }
    return installed
}