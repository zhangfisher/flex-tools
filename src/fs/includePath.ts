/**
 *
 * 判断某个文件夹或文件是否在指定的文件夹下
 *
 * const p1 = "c:/temp/a/b/c"
 * const p2 = "d:/temp/a/b/c"
 * const base = "c:/temp"
 *
 * includePath(p1,base) // true
 * includePath(p2,base) // false
 *
 *
 *
 */

import path from 'node:path'

export function includePath(src: string, basePath: string): boolean {
    // 将路径字符串转换为目录对象
    const srcDir = path.normalize(src)
    const baseDir = path.normalize(basePath)
    return srcDir.startsWith(baseDir)
}

// const p1 = "c:/temp/a/b/c"
// const p2 = "d:/temp/c"
// const p3 = "d:/temp/a/b/c.zip"
// const base = "c:/temp"
// console.log(includePath(p1,base)) // true
// console.log(includePath(p2,base)) // false
// console.log(includePath(p3,base)) // false
