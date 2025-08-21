import path from 'node:path'
import fs from 'node:fs'

export type GetExistsDirOptions = {
    cwd?: string
    absolute?: boolean
}

/**
 * 返回第一个存在的目录
 *
 *
 *
 * getExistsDir([
 *  'a',
 *  './b',
 *  'c:/c/c/d'
 * ],{
 *  base:'c:/temp'
 *  c:true
 * })
 *
 * - base参数为可选参数，如果不存在，则使用当前目录
 * - 传入有目录数组，如果是相对路径，则会自动拼接base参数
 * - 依次检查目录是否存在，如果存在，则返回
 * - 如果absolute为true，则返回绝对路径
 *
 *
 */
export function getExistedDir(dirs: string[], options?: GetExistsDirOptions): string | undefined {
    const { cwd, absolute } = Object.assign(
        {
            cwd: process.cwd(),
            absolute: true,
        },
        options,
    )
    for (const dir of dirs) {
        const dirPath = path.isAbsolute(dir) ? dir : path.join(cwd, dir)
        if (fs.existsSync(dirPath)) {
            return absolute ? dirPath : dir
        }
    }
}
