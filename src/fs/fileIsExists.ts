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

/**
 * 异步检查文件是否存在
 * @param filename 
 */
export async function fileIsExistsAsync(filename: string): Promise<boolean> {
    try {
        await fs.promises.stat(filename);
        return true;
    } catch {
        return false;
    }
}