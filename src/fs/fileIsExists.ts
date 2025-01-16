import  fs from "node:fs"
/**
 * 检查文件是否存在
 * @param filename 
 */
export function fileIsExists(filename:string):boolean{
    try{
        fs.statSync(filename)
        return true
    }catch{
        return false
    }
}