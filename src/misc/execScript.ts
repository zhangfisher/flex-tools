import { assignObject } from "../object/assignObject"
import path from "node:path"
import child_process from 'child_process'


/**
 * 执行脚本并返回输出结果
 * @param {*} script 
 * @param {*} options 
 * @returns 
 */
export interface ExecScriptOptions{
    silent?:boolean
    env?:NodeJS.ProcessEnv,
    maxBuffer?:number
    encoding?:string  
}

export async function execScript(script:string,options?:ExecScriptOptions){    
    const opts = assignObject({
        silent:false,
        cwd: path.resolve(process.cwd()),
        env: process.env,
        encoding: 'utf8',
        maxBuffer: 30 * 1024 * 1024
    },options)
    opts.stdio =opts.silent ? 'ignore' : [0, 1, 2];
    return new Promise((resolve,reject)=>{
        child_process.exec(script,opts, function (err, stdout, stderr) {
              if (!err) {
                resolve(stdout)
              } else if (err.code === undefined) {
                resolve(stdout)
              } else {
                const e = new Error(String(stdout));
                (e as any).code=err.code
                reject(e);
              }
          });  
    })           
} 

