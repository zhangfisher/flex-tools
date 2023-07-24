/**
 * 将fs模块的方法转换为Promise
 * 
 */
import fs from "node:fs"
import { promisify } from "../func/promisify";



type NodejsFunc<T extends (...args: any) => any> = T extends ((...args: [...rest:infer P,callback:(error:any,result:infer R)=>any]) => any) ? (...args: P) => R : never;


type NodejsMethodOverloads<T> =
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; (...args: infer A4): infer R4
  } ?
  NodejsFunc<(...args: A1) => R1> | (NodejsFunc<(...args: A2) => R2>) | (NodejsFunc<(...args: A3) => R3>) | (NodejsFunc<(...args: A4) => R4>) :
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3
  } ?
  NodejsFunc<(...args: A1) => R1> | (NodejsFunc<(...args: A2) => R2>) | (NodejsFunc<(...args: A3) => R3>) :
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2
  } ?
  NodejsFunc<(...args: A1) => R1> | (NodejsFunc<(...args: A2) => R2>):
  T extends {
    (...args: infer A1): infer R1
  } ?
  NodejsFunc<(...args: A1) => R1> :
  any


// export * from "node:fs"





export const readFile = promisify<NodejsMethodOverloads<typeof fs.readFile>>(fs.readFile);
export const copyFile = promisify<NodejsMethodOverloads<typeof fs.copyFile>>(fs.copyFile); 
export const exists = promisify<NodejsFunc<typeof fs.exists>>(fs.exists, {
	parseCallback: (results) => {
		return results[0];
	},
});
export const mkdir = promisify<NodejsMethodOverloads<typeof fs.mkdir>>(fs.mkdir);
export const readdir = promisify<NodejsMethodOverloads<typeof fs.readdir>>(fs.readdir);
export const readlink = promisify<NodejsMethodOverloads<typeof fs.readlink>>(fs.readlink);
export const realpath = promisify<NodejsMethodOverloads<typeof fs.realpath>>(fs.realpath);
export const rename = promisify<NodejsFunc<typeof fs.rename>>(fs.rename);
export const rmdir = promisify<NodejsMethodOverloads<typeof fs.rmdir>>(fs.rmdir);
export const stat = promisify<NodejsMethodOverloads<typeof fs.stat>>(fs.stat);
export const symlink = promisify<NodejsMethodOverloads<typeof fs.symlink>>(fs.symlink);
export const unlink = promisify<NodejsFunc<typeof fs.unlink>>(fs.unlink);
export const writeFile = promisify<NodejsMethodOverloads<typeof fs.writeFile>>(fs.writeFile);  
export const access = promisify<NodejsMethodOverloads<typeof fs.access>>(fs.access);
export const appendFile = promisify<NodejsMethodOverloads<typeof fs.appendFile>>(fs.appendFile);
export const chmod = promisify<NodejsFunc<typeof fs.chmod>>(fs.chmod);
export const chown = promisify<NodejsFunc<typeof fs.chown>>(fs.chown);
export const close = promisify<NodejsFunc<typeof fs.close>>(fs.close);
export const fchmod = promisify<NodejsFunc<typeof fs.fchmod>>(fs.fchmod);
export const fchown = promisify<NodejsFunc<typeof fs.fchown>>(fs.fchown);
export const rm = promisify<NodejsMethodOverloads<typeof fs.rm>>(fs.rm);
export const truncate = promisify<NodejsMethodOverloads<typeof fs.truncate>>(fs.truncate);
export const openDir = promisify<NodejsMethodOverloads<typeof fs.opendir>>(fs.opendir);
export const open = promisify<NodejsMethodOverloads<typeof fs.open>>(fs.open);
export const read = promisify<NodejsMethodOverloads<typeof fs.read>>(fs.read);
export const write = promisify<NodejsMethodOverloads<typeof fs.write>>(fs.write);
export const mkdtemp = promisify<NodejsMethodOverloads<typeof fs.mkdtemp>>(fs.mkdtemp);
export const cp = promisify<NodejsMethodOverloads<typeof fs.cp>>(fs.cp); 



function foo(a:string,callback:(e:Error,x:number)=>void):string
function foo(a:number,callback:(e:Error,x:number)=>void):number
function foo(a:boolean,callback:(e:Error,x:number|string)=>void):boolean;
function foo(a:any,callback:(e:Error,x:number)=>void):any{

}


export const typedfoo = promisify<NodejsMethodOverloads<typeof foo>>(foo); 


