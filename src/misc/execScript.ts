import { assignObject } from '../object/assignObject'
import path from 'node:path'
import child_process from 'node:child_process'

/**
 * 执行脚本并返回输出结果
 * @param {string} script 要执行的脚本命令
 * @param {ExecScriptOptions} options 执行选项
 * @returns {Promise<string|{stdout: string, stderr: string}>} 根据选项返回stdout或包含stdout和stderr的对象
 */
export interface ExecScriptOptions {
    silent?: boolean
    env?: NodeJS.ProcessEnv
    maxBuffer?: number
    encoding?: string
    /**
     * 如何处理标准错误输出
     * - 'ignore': 忽略stderr (默认)
     * - 'throw': 当stderr有内容时抛出错误
     * - 'include': 将stderr包含在返回结果中
     */
    stderrHandling?: 'ignore' | 'throw' | 'include'
}

export async function execScript(script: string, options?: ExecScriptOptions) {
    const opts = assignObject(
        {
            silent: false,
            cwd: path.resolve(process.cwd()),
            env: process.env,
            encoding: 'utf8',
            maxBuffer: 30 * 1024 * 1024,
            stderrHandling: 'throw', // 默认忽略stderr
        },
        options,
    )
    opts.stdio = opts.silent ? 'ignore' : [0, 1, 2]

    return new Promise((resolve, reject) => {
        const c = child_process.exec(script, opts, (err: any, stdout: any, stderr: any) => {
            // 检查是否有stderr内容且需要特殊处理
            if (stderr && stderr.trim() !== '' && opts.stderrHandling !== 'ignore') {
                if (opts.stderrHandling === 'throw') {
                    // 创建包含stderr的错误对象
                    const stderrError = new Error('Command generated error output')
                    ;(stderrError as any).stderr = stderr
                    ;(stderrError as any).stdout = stdout
                    ;(stderrError as any).originalError = err
                    return reject(stderrError)
                } else if (opts.stderrHandling === 'include') {
                    // 返回包含stdout和stderr的对象
                    return resolve({ stdout, stderr })
                }
            }

            // 常规错误处理
            if (!err) {
                resolve(stdout)
            } else if (err.code === undefined) {
                resolve(stdout)
            } else {
                // 增强错误对象
                ;(err as any).stderr = stderr
                ;(err as any).stdout = stdout
                reject(err)
            }
        })

        if (!opts.silent) {
            c.stdout?.pipe(process.stdout)
            c.stderr?.pipe(process.stderr)
        }

        // 添加错误事件处理
        c.on('error', (error: Error) => {
            reject(error)
        })
    })
}
