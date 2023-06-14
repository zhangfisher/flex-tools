import path from "path"
import { getPackageRootPath } from "./getPackageRootPath"
import fs from "fs"

/**
 * 返回当前项目所使用的包管理工具
 * @returns 
 */
export function getPackageTool():('pnpm' | 'npm' | 'yarn')[]{
    const projectFolder =  getPackageRootPath(process.cwd())
    if(projectFolder==null){
        throw new Error("未发现package.json,当前工程不是NPM项目")
    }
    const tools:('pnpm' | 'npm' | 'yarn')[] =[]
    if(fs.existsSync(path.join(projectFolder,"pnpm-lock.yaml"))){        
        tools.push('pnpm')
    }else if(fs.existsSync(path.join(projectFolder,"yarn.lock"))){
        tools.push('yarn')
    }else{
        tools.push('npm')
    } 
    return tools
}   