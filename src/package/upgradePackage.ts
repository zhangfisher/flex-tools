/**
 * 
 * 升级包到最新版本
 * 
 */

import { execScript } from "../misc/execScript"
import { getPackageTool } from "./getPackageTool"
import fs from "node:fs"
import path from "node:path"
import { updatePackageJson } from './updatePackageJson';

export async function upgradePackage(packageName:string){
    const packageTool = getPackageTool()
    if(packageTool.includes('pnpm')){
        await execScript(`pnpm update --latest ${packageName}`)        
    }else if(packageTool.includes('yarn')){
        await execScript(`yarn upgrade --latest ${packageName}`)        
    }else{
        await execScript(`npm upgrade ${packageName}`)        
        // npm upgrade不会更新package.json，所以以下更新一个版本号
        // 从更新的包中读取版本号
        const { version } = JSON.parse(String(fs.readFileSync(path.join(path.dirname(require.resolve(packageName)),"package.json"))))        
        updatePackageJson({version:`^${version}`})
    } 
}