import { InvalidProjectPathError } from "../errors"
import { getPackageRootPath } from "./getPackageRootPath"
import path from "path"
import { execScript } from "../misc/execScript"
import { assignObject } from '../object/assignObject';


export interface PackageIsInstalledOptions{
    checkGlobal?:boolean
    location?:string            // 指定一个位置，未指定则使用当前项目的位置
}

/**
 * 查询指定的包是否安装，如果安装则返回版本号
 * @param packageName
 */
export async function packageIsInstalled(packageName:string,options?:PackageIsInstalledOptions):Promise<boolean>{
    const {location,checkGlobal} = assignObject({
        checkGlobal:false
    },options)
    const packageRoot = getPackageRootPath(location)
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