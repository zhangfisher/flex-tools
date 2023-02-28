import path from "path"
import { getProjectRootPath } from "./getProjectRootPath"
import fs from "fs-extra"

/**
 * 返回当前项目所使用的包管理工具
 * @returns 
 */
export function getPackageTool():string{
    const projectFolder =  getProjectRootPath(process.cwd())
    if(projectFolder==null){
        throw new Error("未发现package.json,当前工程不是NPM项目")
    }
    if(fs.existsSync(path.join(projectFolder,"pnpm-lock.yaml"))){        
        return 'pnpm'
    }else if(fs.existsSync(path.join(projectFolder,"yarn.lock"))){
        return 'yarn'
    }else{
        return 'npm'
    } 
}   