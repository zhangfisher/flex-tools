/**
 * 
 * 根据路径获取节点对象
 * getByPath(treedata,"a/b")
 * 
 * getByPath(treedata,"a/b",{pathKey:"name"})
 * 
 */

import { ABORT } from "../object";
import { DefaultTreeOptions } from "./consts";
import { forEachTree } from "./forEachTree";
import { TreeNode, TreeNodeOptions } from "./types";

 
export interface GetByPathOptions extends TreeNodeOptions{
    separator?:string
}

export function getByPath<Node extends TreeNode = TreeNode>(treeObj:Node | Node[],fullpath: string,options?:GetByPathOptions):Node | undefined {
    let result:Node | undefined;
    let {separator='/'} = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetByPathOptions>     
    forEachTree<Node>(treeObj,({node,level,parent,path})=>{
        if(path.map(p=>String(p)).join(separator) == fullpath){
            result = node
            return ABORT    
        }
    },options) 
    return result
}
