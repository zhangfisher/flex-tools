/**
* 
* 
* 复制文件夹，并且支持模板文件
* 
*  1. 支持深度复制文件夹，保持文件夹结构
*  2. 支持模板文件，模板文件以 .art 结尾，复制后去掉 .art后缀，采用art-template渲染
   3. 支持忽略文件或文件夹
   4. 支持文件或文件夹重命名 
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
import type {CopyFileInfo} from "./copyFiles"

export type {CopyFileInfo} from "./copyFiles"

export interface CopyDirsOptions {
	vars?        : Record<string, any> | ((file: string) => Record<string, any> | Promise<Record<string, any>>); // 传递给模板的变量
	pattern?     : string;                   // 匹配的文件或文件夹，支持通配符
	ignore?      : string[];                  // 忽略的文件或文件夹，支持通配符
    clean?       : boolean                      // 是否清空目标文件夹
    overwrite?   : boolean | ((filename: string) => boolean | Promise<boolean>); // 是否覆盖已存在的文件，可以是boolean或返回boolean的同步/异步函数
	before?      : (info:CopyFileInfo) => void | typeof ABORT; // 复制前的回调
	after?       : (info:CopyFileInfo) => void | typeof ABORT; // 复制后的回调
    error?       : (error:Error,{source,target}:{source: string, target: string})=>void | typeof ABORT // 复制出错的回调
}

export async function copyDirs(
	srcDir: string,
	targetDir: string,
	options?: CopyDirsOptions
) {
	const opts = assignObject({ 
        pattern: "**/*.*",
        ignore:[],
        clean:false 
    }, options);
	const { ignore, pattern,vars={} } = opts;

	if (!existsSync(srcDir)) throw new Error(`srcDir=${srcDir} not exists`);
	if (!path.isAbsolute(targetDir))
		targetDir = path.join(process.cwd(), targetDir);
	if (!existsSync(targetDir)) {
		await mkdir(targetDir, { recursive: true });
	}

    if (opts.clean) {
        try{await cleanDir(targetDir)}catch{}
    }


	return new Promise<void>((resolve, reject) => {
		glob(pattern, {
			ignore,
			cwd: srcDir,
		}).then(async (files) => {
			for (let file of files) {
                const fileInfo:Required<CopyFileInfo> = {
                    file,
                    source:path.join(srcDir, file),
                    target:path.join(targetDir, file),
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
                        const targetFile = path.join(
                            path.dirname(fileInfo.target),
                            path.basename(fileInfo.target, ".art")
                        );
                        const shouldOverwrite = typeof opts.overwrite === 'function' 
                            ? await Promise.resolve(opts.overwrite(targetFile))
                            : opts.overwrite;
                        if (shouldOverwrite === false && existsSync(targetFile)) {
                            continue;
                        }
                        const template = artTemplate(fileInfo.source);
                        const templateVars = typeof vars === 'function' 
                            ? await Promise.resolve(vars(file))
                            : vars || {};
                        await writeFile(targetFile, template(templateVars), {encoding:"utf-8"});
                    }else{// 普通文件
                        const shouldOverwrite = typeof opts.overwrite === 'function' 
                            ? await Promise.resolve(opts.overwrite(fileInfo.target))
                            : opts.overwrite;
                        if (shouldOverwrite === false && existsSync(fileInfo.target)) {
                            continue;
                        }
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
		}).catch(reject)
	});
}

export { ABORT } from "../consts";


// copyDirs(path.join(__dirname, "../../src"), "c://temp//copydirs", {
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
