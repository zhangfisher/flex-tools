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
import { mkdir } from "./nodefs";
import { existsSync } from "node:fs"; 
import { ABORT } from "../consts";
import path from "node:path"
import { cleanDir } from "./cleanDir"; 
import { copyFile } from "./copyFile";


export interface CopyFileInfo{
    file?  : string                                             // 相对于源文件夹的文件路径
    source?: string                                             // 源文件路径
    target?: string                                             // 目标文件路径
    vars?  : null | undefined | Record<string,any>             // 模板变量
}
 
export interface CopyFilesOptions {
	vars?           : Record<string, any> | ((file: string) => Record<string, any> | Promise<Record<string, any>>); // 传递给模板的变量
	ignore?         : string[];                                        // 忽略的文件或文件夹，支持通配符
    clean?          : boolean;                                         // 是否清空目标文件夹
    cwd?            : string;                                          // pattern的cwd
    overwrite?      : boolean | ((filename: string) => boolean | Promise<boolean>); // 是否覆盖已存在的文件，可以是boolean或返回boolean的同步/异步函数
	before?         : (info:CopyFileInfo) => void | typeof ABORT;      // 复制前的回调
	after?          : (info:CopyFileInfo) => void | typeof ABORT;      // 复制后的回调
    error?          : (error:Error,{source,target}:{source: string, target: string})=>void | typeof ABORT // 复制出错的回调
    templateOptions?: Record<string, any> | ((file: string) => Record<string, any> | Promise<Record<string, any>>); 
}
/**
 * 拷贝满足条件的文件到目标文件夹
 * 
 * @param pattern 
 * @param targetDir 
 * @param options 
 * @returns  返回实际拷贝的文件列表
 */
export async function copyFiles( pattern: string, targetDir: string, options?: CopyFilesOptions):Promise<string[]> {

	const opts = assignObject({  
        ignore   : [],
        clean    : false,
        overwrite: false
    }, options);

	const { ignore, cwd=process.cwd() } = opts;

    const srcDir = path.isAbsolute(pattern) ? path.dirname(pattern) : cwd;    
 
	if (!path.isAbsolute(targetDir)) targetDir = path.join(process.cwd(), targetDir);
	if (!existsSync(targetDir)) {
		await mkdir(targetDir, { recursive: true });
	}

    if (opts.clean) {
        try{await cleanDir(targetDir)}catch{}
    }
    
    const copyedFiles:string[] = []

	return new Promise<string[]>((resolve, reject) => {
		glob(pattern, {
			ignore,
			cwd:srcDir,
            dot:true
		}).then(async (files) => {
			for (let file of files) {
                const isAbsoluteFile = path.isAbsolute(file); 
                const fromFile       = isAbsoluteFile ? file: path.join(srcDir, file)
                const fromDir        = path.dirname(fromFile);
                const toFile         = path.join(targetDir, isAbsoluteFile ? path.relative(fromDir,file) : file)           

                const fileInfo:Required<CopyFileInfo> = {
                    file,
                    source: fromFile,
                    target: toFile,
                    vars:opts.vars
                } 
				let targetFileDir = path.dirname(fileInfo.target);
				if (!existsSync(targetFileDir)) {
					await mkdir(targetFileDir, { recursive: true });  
				}
				if (typeof options?.before == "function") {
					if(options.before(fileInfo)===ABORT){
                        break
                    }
				}				
				try {
                    await copyFile(fromFile, toFile, opts); 
                    copyedFiles.push(toFile)
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
			resolve(copyedFiles);
		}).catch(reject);
	});
}