/**
 * 将fs模块的方法转换为Promise
 * 
 */
import fs from "node:fs"
import { promisify } from "../func/promisify";



// 以下尝试对promise化的方法进行类型推断，但是失败了，因为nodejs的方法均有重载，实际推断出来的结果是错误的
// type NodejsFunc<T extends (...args: any) => any> = T extends ((...args: [...rest:infer P,callback:infer C]) => any) ? (C extends (error:any,result:infer R)=>any ? (...args: P) => R : (...args: P)=>void) : never;
// type NodejsMethodOverloads<T> =
//   T extends {
//     (...args: infer A1): infer R1; (...args: infer A2): infer R2;
//     (...args: infer A3): infer R3; (...args: infer A4): infer R4
//   } ?
//   (NodejsFunc<(...args: A1) => R1> | NodejsFunc<(...args: A2) => R2> | NodejsFunc<(...args: A3) => R3> | NodejsFunc<(...args: A4) => R4>) :
//   T extends {
//     (...args: infer A1): infer R1; (...args: infer A2): infer R2;
//     (...args: infer A3): infer R3
//   } ?
//   (NodejsFunc<(...args: A1) => R1> | NodejsFunc<(...args: A2) => R2> | NodejsFunc<(...args: A3) => R3> ):
//   T extends {
//     (...args: infer A1): infer R1; (...args: infer A2): infer R2
//   } ?
//   NodejsFunc<(...args: A1) => R1> | NodejsFunc<(...args: A2) => R2>:
//   T extends {
//     (...args: infer A1): infer R1
//   } ?
//   NodejsFunc<(...args: A1) => R1> :
//   T
 
export const readFile = promisify(fs.readFile) //as NodejsMethodOverloads<typeof fs.readFile> 
export const copyFile = promisify(fs.copyFile) //as NodejsMethodOverloads<typeof fs.copyFile>; 
export const mkdir = promisify(fs.mkdir) //as NodejsMethodOverloads<typeof fs.mkdir>;
export const readdir = promisify(fs.readdir) //as NodejsMethodOverloads<typeof fs.readdir>;
export const readlink = promisify(fs.readlink)                  //as NodejsMethodOverloads<typeof fs.readlink>;
export const realpath = promisify(fs.realpath)                  //as NodejsMethodOverloads<typeof fs.realpath>;
export const rename = promisify(fs.rename)                  //as NodejsFunc<typeof fs.rename>;
export const rmdir = promisify(fs.rmdir)                  //as NodejsMethodOverloads<typeof fs.rmdir>;
export const stat = promisify(fs.stat)                  //as NodejsMethodOverloads<typeof fs.stat>;
export const symlink = promisify(fs.symlink)                  //as NodejsMethodOverloads<typeof fs.symlink>;
export const unlink = promisify(fs.unlink)                  //as NodejsFunc<typeof fs.unlink>;
export const writeFile = promisify(fs.writeFile)                  //as NodejsMethodOverloads<typeof fs.writeFile>;  
export const access = promisify(fs.access)                  //as NodejsMethodOverloads<typeof fs.access>;
export const appendFile = promisify(fs.appendFile)                  //as NodejsMethodOverloads<typeof fs.appendFile>;
export const chmod = promisify(fs.chmod)                  //as NodejsFunc<typeof fs.chmod>;
export const chown = promisify(fs.chown)                  //as NodejsFunc<typeof fs.chown>;
export const close = promisify(fs.close)                  //as NodejsFunc<typeof fs.close>;
export const fchmod = promisify(fs.fchmod)                  //as NodejsFunc<typeof fs.fchmod>;
export const fchown = promisify(fs.fchown)                  //as NodejsFunc<typeof fs.fchown>;
export const rm = promisify(fs.rm)                  //as NodejsMethodOverloads<typeof fs.rm>;
export const truncate = promisify(fs.truncate)                  //as NodejsMethodOverloads<typeof fs.truncate>;
export const openDir = promisify(fs.opendir)                  //as NodejsMethodOverloads<typeof fs.opendir>;
export const open = promisify(fs.open)                  //as NodejsMethodOverloads<typeof fs.open>;
export const read = promisify(fs.read)                  //as NodejsMethodOverloads<typeof fs.read>;
export const write = promisify(fs.write)                  //as NodejsMethodOverloads<typeof fs.write>;
export const mkdtemp = promisify(fs.mkdtemp)                  //as NodejsMethodOverloads<typeof fs.mkdtemp>;
export const cp = promisify(fs.cp)                  //as NodejsMethodOverloads<typeof fs.cp>; 

export const exists = promisify(fs.exists, {
	parseCallback: (results) => {
		return results[0];
	},
})  