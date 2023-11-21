import { TreeNode, TreeNodeBase } from "./types"

export type PathGenerator<Node extends TreeNodeBase = TreeNode > = (node:Node)=> any

/**
 * 根据输入的path参数生成一个path生成器
 * 
 * path参数可以是一个函数，也可以是一个字符串代表节点的属性名
 * 
 * 
 * @param node 
 * @param pathParam 
 * @param idKey 
 * @returns 
 */
export function buildPathGenerator<Node extends TreeNodeBase = TreeNode>(pathParam:string | ((node:Node)=>any) | undefined ,idKey:string):PathGenerator<Node>{
    const defaultGenerator:PathGenerator<Node> = (node:Node)=>node[idKey]
    if(!pathParam) return defaultGenerator
    if(typeof(pathParam)=='function'){
         return pathParam as PathGenerator<Node>
     }else if(typeof(pathParam)=='string'){
         return ( node:Node)=>node[pathParam] || node[idKey]
     }else{
        return defaultGenerator
     }
 }
/**
 * 将[1,2,3],[{id,...},{id,...}]转换为'1/2/3'
 * 如果path中的元素是对象，则取对象的idKey属性作为路径元素
 * 
 * @param path 
 * @param idKey 
 * @returns 
 */
export function getFullPath<Path=string>(paths:Path[],idKey:string="id",delimiter:string="/"):string{
   // @ts-ignore
    return paths.map(p=>typeof(p)=='object' ? (idKey in p ? String(p[idKey]): String(p[Object.keys(p)[0]])) : String(p) ).join(delimiter)
}