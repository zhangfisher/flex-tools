import { assignObject } from "../object/assignObject"
import shelljs from "shelljs"
/**
 * 执行脚本并返回输出结果
 * @param {*} script 
 * @param {*} options 
 * @returns 
 */
export interface ExecShellScriptOptions{
    silent?:boolean
}

export async function execShellScript(script:string,options?:ExecShellScriptOptions){
    const { silent } = assignObject({silent:false},options)
    return new Promise((resolve,reject)=>{
        shelljs.exec(script,{silent,...options,async:true},(code:number,stdout:string)=>{
            if(code>0){
                reject(new Error(`执行<${script}>失败: ${stdout.trim()}`))
            }else{
                resolve(stdout.trim())
            }
        })   
    }) 
} 
