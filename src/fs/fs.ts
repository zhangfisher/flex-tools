/**
 * 将fs模块的方法转换为Promise
 * 
 */
import fs from "node:fs"
import { promisify } from "../func/promisify";
 
type NodejsOverloadsParameters<T> =
  T extends {
    (...args: [...infer A1,any]): infer R1; (...args: [...infer A2,any]): infer R2;
    (...args: [...infer A3,any]): infer R3; (...args: [...infer A4,any]): infer R4
  } ?
  Parameters<(...args: A1) => R1> | (Parameters<(...args: A2) => R2>) | (Parameters<(...args: A3) => R3>) | (Parameters<(...args: A4) => R4>) :
  T extends {
    (...args: [...infer A1,any]): infer R1; (...args: [...infer A2,any]): infer R2;
    (...args: [...infer A3,any]): infer R3
  } ?
  Parameters<(...args: A1) => R1> | Parameters<((...args: A2) => R2)> | Parameters<((...args: A3) => R3)> :
  T extends {
    (...args: [...infer A1,any]): infer R1; (...args: [...infer A2,any]): infer R2
  } ?
  Parameters<(...args: A1) => R1> | (Parameters<(...args: A2) => R2>):
  T extends {
    (...args: [...infer A1,any]): infer R1
  } ?
  Parameters<(...args: A1) => R1> :
  any



export * from "node:fs"

type NodejsParameters<T extends (...args: any) => any> = T extends (...args: [...infer P,any]) => any ? P : never;

export const copyFile = promisify<void,NodejsOverloadsParameters<typeof fs.copyFile>>(fs.copyFile); 
export const exists = promisify<boolean,NodejsParameters<typeof fs.exists>>(fs.exists, {
	parseCallback: (results) => {
		return results[0];
	},
});
export const mkdir = promisify<void,NodejsOverloadsParameters<typeof fs.mkdir>>(fs.mkdir);
export const readdir = promisify<void,NodejsOverloadsParameters<typeof fs.readdir>>(fs.readdir);
export const readFile = promisify<void,NodejsOverloadsParameters<typeof fs.readFile>>(fs.readFile);
export const readlink = promisify<void,NodejsOverloadsParameters<typeof fs.readlink>>(fs.readlink);
export const realpath = promisify<void,NodejsOverloadsParameters<typeof fs.realpath>>(fs.realpath);
export const rename = promisify<void,NodejsParameters<typeof fs.rename>>(fs.rename);
export const rmdir = promisify<void,NodejsOverloadsParameters<typeof fs.rmdir>>(fs.rmdir);
export const stat = promisify<fs.Stats,NodejsOverloadsParameters<typeof fs.stat>>(fs.stat);
export const symlink = promisify<void,NodejsOverloadsParameters<typeof fs.symlink>>(fs.symlink);
export const unlink = promisify<void,NodejsParameters<typeof fs.unlink>>(fs.unlink);
export const writeFile = promisify<void,NodejsParameters<typeof fs.writeFile>>(fs.writeFile);  
export const access = promisify<void,NodejsOverloadsParameters<typeof fs.access>>(fs.access);
export const appendFile = promisify<void,NodejsOverloadsParameters<typeof fs.appendFile>>(fs.appendFile);
export const chmod = promisify<void,NodejsParameters<typeof fs.chmod>>(fs.chmod);
export const chown = promisify<void,NodejsParameters<typeof fs.chown>>(fs.chown);
export const close = promisify<void,NodejsParameters<typeof fs.close>>(fs.close);
export const fchmod = promisify<void,NodejsParameters<typeof fs.fchmod>>(fs.fchmod);
export const fchown = promisify<void,NodejsParameters<typeof fs.fchown>>(fs.fchown);
export const rm = promisify<void,NodejsOverloadsParameters<typeof fs.rm>>(fs.rm);
export const truncate = promisify<void,NodejsOverloadsParameters<typeof fs.truncate>>(fs.truncate);
export const openDir = promisify<void,NodejsOverloadsParameters<typeof fs.opendir>>(fs.opendir);
export const open = promisify<void,NodejsOverloadsParameters<typeof fs.open>>(fs.open);
export const read = promisify<void,NodejsOverloadsParameters<typeof fs.read>>(fs.read);
export const write = promisify<void,NodejsOverloadsParameters<typeof fs.write>>(fs.write);
export const mkdtemp = promisify<void,NodejsOverloadsParameters<typeof fs.mkdtemp>>(fs.mkdtemp);
export const cp = promisify<void,NodejsOverloadsParameters<typeof fs.cp>>(fs.cp); 
