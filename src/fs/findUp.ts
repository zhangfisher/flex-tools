/**
 * 向上查找指定的文件，并返回文件全路径
 * 
 * findUpFiles("flex.config.json")
 * findUpFiles([
 *    "flex.config.json",
 *    "flex.config.yaml",
 *    "flex.config.ts"
 * ])
 * 
 * 如果没有发现，则返回[] 
 * 
 * 
 */

import {forEachUp} from "./forEachUp"
import path from "path"
import fs from "fs"
import { assignObject } from '../object/assignObject';
import { ABORT } from "../consts";

export interface FindUpOptions{
    includeSelf?:boolean,                   // 结果是否包含当前文件夹
    entry?:string                           // 查找起点,默认为当前文件夹
    onlyFirst?:boolean                      // 是否只查找第一个文件
}

export function findUp(files:string | string[], options?:FindUpOptions){
    const { includeSelf,entry=process.cwd() } = assignObject({},options)
    let result:string[] = []
    if(typeof(files) == "string"){
        files = [files]
    }
    forEachUp((folder:string)=>{
        for(let file of files){
            const filePath = path.join(folder,file)
            if(fs.existsSync(filePath)){
                result.push(filePath)
                if(options?.onlyFirst) return ABORT                
            }
        }
    },{includeSelf,base: entry})
    return result
}