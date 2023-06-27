import { assignObject } from "../object/assignObject"
import { execScript } from "../misc/execScript"
import { getPackageTool } from "./getPackageTool"
import { packageIsInstalled } from "./packageIsInstalled"


export interface installPackageOptions{
    location?:string                                // 安装位置
    silent?: boolean                                // 执行安装时静默输出
    type?:'prod' | 'dev' | 'peer' | 'optional' | 'bundle'    // 安装开发依赖 
    global?: boolean                                // 安装为全局依赖
    upgrade?: boolean                               // 当依赖已经安装时是否进行升级 
    use?:"auto" | string                            // 使用哪一个包工具
    ignoreError?:boolean                            // 忽略错误
}
/**
 * 在当前项目下安装指定的包
 * @param packageName 
 * @param param1 
 */
export async function installPackage(packageName:string,options?:installPackageOptions){
    const {silent,type,global:isGlobal,upgrade,use,location,ignoreError} = assignObject({
        location:process.cwd(),
        global:false,
        silent:true,
        type:'prod',
        upgrade:true,               // 当包已经安装时,是否升级到最新版本
        use:"pnpm",
        ignoreError:true
    },options)
    const packageTool =use =='auto' ? getPackageTool() : use
    let args = []
    let hasInstalled = false
    const cwd = process.cwd()
    const isInstalled = await packageIsInstalled(packageName,{location})
    process.chdir(location)
    try{    
        if(isInstalled && upgrade){
            if(packageTool.includes('pnpm')){           
                await execScript(`pnpm upgrade  --latest ${packageName}`,{silent}) 
            }else if(packageTool.includes('yarn')){
                await execScript(`yarn upgrade --latest ${packageName}`,{silent})        
            }else if(packageTool.includes('npm')){
                await execScript(`npm upgrade ${packageName}`,{silent})        
            }else{
                await execScript(`${packageTool} upgrade ${packageName}`,{silent})        
            }
            hasInstalled =true
        }else if(!isInstalled){
            if(packageTool.includes('pnpm')){
                if(isGlobal) args.push("-g")
                if(type=='dev') args.push("-D")
                if(type=='peer') args.push("-P")
                if(type=='optional') args.push("-O")
                await execScript(`pnpm add ${args.join(" ")} ${packageName}`,{silent}) 
            }else if(packageTool.includes('yarn')){
                if(isGlobal) args.push("-g")
                if(type=='dev') args.push("-D")
                if(type=='peer') args.push("-P")
                if(type=='optional') args.push("-O")
                await execScript(`yarn ${isGlobal ? 'global ' :''}add  ${args.join(" ")} ${packageName}`,{silent})        
            }else if(packageTool.includes('npm')){
                if(isGlobal) args.push("-g")
                if(type=='dev') args.push("-D --save-dev")
                if(type=='bundle') args.push("--save-bundle")                
                if(type=='peer') args.push("-P")
                if(type=='optional') args.push("-O")
                await execScript(`npm install  ${args.join(" ")} ${packageName}`,{silent})        
            }else{
                if(isGlobal) args.push("-g")
                if(type=='dev') args.push("-D --save-dev")
                if(type=='peer') args.push("-P")
                if(type=='optional') args.push("-O")
                await execScript(`${packageTool} install  ${args.join(" ")} ${packageName}`,{silent}) 
            }
            hasInstalled =true
        }    
    }catch(e){
        if(!ignoreError) throw e
    }finally{        
        process.chdir(cwd)
    }
    return hasInstalled 
} 