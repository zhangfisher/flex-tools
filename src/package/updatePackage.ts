import { execScript } from "../misc/execScript"
import { getPackageTool } from "./getPackageTool"

export async function upgradePackage(packageName:string){
    const packageTool = getPackageTool()
    try{
        if(packageTool.includes('pnpm')){
            await execScript(`pnpm update ${packageName}`)        
        }else if(packageTool.includes('yarn')){
            await execScript(`yarn upgrade ${packageName}`)        
        }else{
            await execScript(`npm upgrade ${packageName}`)        
        }
    }catch{
        await execScript(`npm upgrade ${packageName}`)        
    }    
}