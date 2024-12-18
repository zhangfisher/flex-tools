/**
* 
* 
* 复制文件夹，并且支持模板文件
* 
*  1. 支持深度复制文件夹，保持文件夹结构
*  2. 支持模板文件，模板文件以 .art 结尾，复制后去掉 .art后缀，采用art-template渲染
   3. 支持忽略文件或文件夹
   4. 支持文件或文件夹重命名
 
   copyFiles("/temp/a*.ts", targetDir, options)

* 
*/

import { glob} from "glob";
import { assignObject } from "../object/assignObject";
import {copyFile,mkdir,writeFile} from "./nodefs";
import { existsSync } from "node:fs";
import artTemplate from "art-template";
import { ABORT } from "../consts";
import path from "node:path"
import { cleanDir } from "./cleanDir";

export interface CopyFileInfo{
    file?:string                                            // 相对于源文件夹的文件路径
    source?:string                                          // 源文件路径
    target?:string                                          // 目标文件路径
    vars?:null | undefined | Record<string,any>             // 模板变量
}

export interface CopyFilesOptions {
	vars?: Record<string, any>;         // 传递给模板的变量 
	ignore?: string[];                  // 忽略的文件或文件夹，支持通配符
    clean?:boolean                      // 是否清空目标文件夹
    cwd?:string;                        // pattern的cwd
	before?: (info:CopyFileInfo) => void | typeof ABORT; // 复制前的回调
	after?: (info:CopyFileInfo) => void | typeof ABORT; // 复制后的回调
    error?:(error:Error,{source,target}:{source: string, target: string})=>void | typeof ABORT // 复制出错的回调
}

export async function copyFiles(
	pattern: string,
	targetDir: string,
	options?: CopyFilesOptions
) {
	const opts = assignObject({  
        ignore: [],
        clean : false 
    }, options);

	const { ignore,vars={},cwd=process.cwd() } = opts;

    const srcDir = path.isAbsolute(pattern) ? path.dirname(pattern) : cwd;    
 
	if (!path.isAbsolute(targetDir)) targetDir = path.join(process.cwd(), targetDir);
	if (!existsSync(targetDir)) {
		await mkdir(targetDir, { recursive: true });
	}

    if (opts.clean) {
        try{await cleanDir(targetDir)}catch{}
    }


	return new Promise<void>((resolve, reject) => {
		glob(pattern, {
			ignore,
			cwd:srcDir,
		}).then(async (files) => {

			for (let file of files) {
                const isAbsoluteFile = path.isAbsolute(file); 
                const fromFile = isAbsoluteFile ? file: path.join(srcDir, file)
                const fromDir = path.dirname(fromFile);
                const toFile = path.join(targetDir, isAbsoluteFile ? path.relative(fromDir,file) : file)                
                const fileInfo:Required<CopyFileInfo> = {
                    file,
                    source: fromFile,
                    target: toFile,
                    vars:null
                } 
				let targetFileDir = path.dirname(fileInfo.target);
				if (!existsSync(targetFileDir)) {
					await mkdir(targetFileDir, { recursive: true }); // 创建目录
				}
				if (typeof options?.before == "function") {
					if(options.before(fileInfo)===ABORT){
                        break
                    }
				}				
				try {
                    if (file.endsWith(".art")) {// 模板文件
                        const template = artTemplate(fileInfo.source);   
                        await writeFile(fileInfo.target.replace(".art",""),template(fileInfo.vars ? Object.assign({},vars,fileInfo.vars) : vars ),{encoding:"utf-8"}) 
                    }else{// 模板文件
                        await copyFile(fileInfo.source, fileInfo.target);                        
                    }
                    if (typeof options?.after == "function") {
                        if(options.after(fileInfo)===ABORT){
                            break
                        }
                    }
				} catch (e: any) {                
                    if (typeof options?.error == "function") {
                        if(options.error(e,fileInfo)===ABORT){
                            break
                        }
                    }                    
                }
			}
			resolve();
		}).catch(reject);
	});
}

export { ABORT } from "../consts";


// copyFiles("*.*", "c://temp//copyFiles", {
//     vars:{
//         count:"hello to flex-tools"
//     },
// 	after: ({source,target}) => {
// 		console.log("copy: ", source);
// 	},
//     error:(error,{source,target})=>{
//         console.error("copy error:",source,error.message)
//     }
// }).then(() => {});
