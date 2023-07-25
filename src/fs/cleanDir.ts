/**
 * 
 * 清空文件夹
 * 
 */
import fs from 'node:fs'
import path from 'node:path'


export interface CleanDirOptions{
    ignoreError?:boolean    
}

export function cleanDir(dir:string,options?:CleanDirOptions){
    const { ignoreError } = Object.assign({ignoreError:true},options)
    return new Promise<void>((resolve,reject)=>{
        fs.readdir(dir,(err,files)=>{
            if(err && !ignoreError){                
                return reject(err)
            } 
            for(let file of files){
                let filePath = path.join(dir,file)             
                if(fs.statSync(filePath).isDirectory()){
                    cleanDir(filePath)
                }else{
                    try{
                        fs.unlinkSync(filePath)
                    }catch(err){
                        if(!ignoreError) return reject(err)
                    }
                }       
            } 
            try{
                fs.rmdirSync(dir)
            }catch(err){
                if(!ignoreError) return reject(err)
            }
            resolve()
        })
    })
}


// cleanDir("C:\\Temp\\copydirs")