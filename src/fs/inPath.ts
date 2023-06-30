/**
 * 
 * 判断某个文件夹或文件是否在指定的文件夹下
 * 
 * const p1 = "c:/temp/a/b/c"
 * const p2 = "d:/temp/a/b/c"
 * const base = "c:/temp"
 * 
 * inPath(p1,base) // true
 * inPath(p2,base) // false
 *  
 * 
 * 
 */

const path = require("node:path")


export function inPath(src: string, basePath: string): boolean {  
    // 将路径字符串转换为目录对象  
    let srcDir = path.normalize(src);  
    let baseDir = path.normalize(basePath);      
    return srcDir.startsWith(baseDir)
}



// const p1 = "c:/temp/a/b/c"
// const p2 = "d:/temp/c"
// const p3 = "d:/temp/a/b/c.zip"
// const base = "c:/temp"
// console.log(inPath(p1,base)) // true
// console.log(inPath(p2,base)) // false
// console.log(inPath(p3,base)) // false