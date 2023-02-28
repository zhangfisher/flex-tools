import { assignObject } from "../object/assignObject"
import { execShellScript } from "../shell/execShellScript"
import { getPackageTool } from "./getPackageTool"
import { packageIsInstalled } from "./packageIsInstalled"


export interface installPackageOptions{
    silent?: boolean                                // 执行安装时静默输出
    type?: 'prod' | 'dev' | 'peer' | 'optional'     // 安装开发依赖
    global?: boolean                                // 安装为全局依赖
    upgrade?: boolean                               // 当依赖已经安装时是否进行升级 
}
/**
 * 在当前项目下安装指定的包
 * @param packageName 
 * @param param1 
 */
export async function installPackage(packageName:string,options?:installPackageOptions){
    const {silent,type,global:isGlobal,upgrade} = assignObject({
        silent:true,
        type:'prod',
        upgrade:true,               // 当包已经安装时,是否升级到最新版本
    },options)
    const packageTool = getPackageTool()
    let args = []
    
    const isInstalled = await packageIsInstalled(packageName)
    if(isInstalled && upgrade){
        if(packageTool=='pnpm'){           
            await execShellScript(`pnpm upgrade  --latest ${packageName}`,{silent}) 
        }else if(packageTool=='yarn'){
            await execShellScript(`yarn upgrade --latest ${packageName}`,{silent})        
        }else{
            await execShellScript(`npm upgrade ${packageName}`,{silent})        
        }  
    }else{
        if(packageTool=='pnpm'){
            if(isGlobal) args.push("-g")
            if(type=='dev') args.push("-D")
            if(type=='peer') args.push("-P")
            if(type=='optional') args.push("-O")
            await execShellScript(`pnpm add ${args.join(" ")} ${packageName}`,{silent}) 
        }else if(packageTool=='yarn'){
            if(isGlobal) args.push("-g")
            if(type=='dev') args.push("-D")
            if(type=='peer') args.push("-P")
            if(type=='optional') args.push("-O")
            await execShellScript(`yarn ${isGlobal ? 'global ' :''}add  ${args.join(" ")} ${packageName}`,{silent})        
        }else{
            if(isGlobal) args.push("-g")
            if(type=='dev') args.push("-D --save-dev")
            if(type=='peer') args.push("-P")
            if(type=='optional') args.push("-O")
            await execShellScript(`npm install  ${args.join(" ")} ${packageName}`,{silent})        
        }  
    }    
} 