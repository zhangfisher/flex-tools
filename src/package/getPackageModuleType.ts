import { getPackageJson } from "./getPackageJson" 

export type  ModuleType = "esm" | "cjs"  

export function getPackageModuleType(entry?:string):ModuleType | undefined{ 
    try{
        let packageJson = getPackageJson(entry)
        if(packageJson){
            return packageJson.type=="module" ? "esm" : "cjs"
        } 
    }catch{
    }
}