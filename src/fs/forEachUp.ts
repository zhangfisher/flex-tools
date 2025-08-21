/**
 *
 * 从当前文件夹开始，向上遍历祖先文件夹
 *
 *
 *
 *
 */
import path from 'node:path'
import { isFunction } from '../typecheck/isFunction'
import { assignObject } from '../object/assignObject'
import { ABORT } from '../consts'
export { ABORT } from '../consts'

export interface findUpOptions {
    includeSelf?: boolean // 结果是否包含当前文件夹
    base?: string // 入口文件夹,默认为当前文件夹
}

export function forEachUp(callback: (folder: string) => Symbol | void, options?: findUpOptions) {
    const { includeSelf, base = process.cwd() } = assignObject({}, options)
    let cur = base
    const result: string[] = []
    if (includeSelf && isFunction(callback)) {
        result.push(cur)
        if (callback(cur) === ABORT) return
    }
    while (true) {
        const parent = path.dirname(cur)
        if (parent === cur) break
        result.push(parent)
        cur = parent
        if (isFunction(callback)) {
            if (callback(parent) === ABORT) break
        }
    }
    return result
}
