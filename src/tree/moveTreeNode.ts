/**
 * 
 *  移动树节点
 * 
 *  moveTreeNode(treeObj,fromNode,toNode,position)
 * 
 */

import { ABORT } from "../object";
import { DefaultTreeOptions } from "./consts";
import { forEachTree } from "./forEachTree";
import { TreeNode, TreeNodeOptions } from "./types";

 
export interface MoveTreeNodeOptions extends TreeNodeOptions{
    separator?:string
}

export function moveTreeNode<Node extends TreeNode = TreeNode>(treeObj:Node | Node[],fullpath: string,options?:MoveTreeNodeOptions):Node | undefined {
    let result:Node | undefined;
    let {separator='/'} = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<MoveTreeNodeOptions>     
    forEachTree<Node>(treeObj,({node,level,parent,path})=>{
        if(path.map(p=>String(p)).join(separator) == fullpath){
            result = node
            return ABORT    
        }
    },options) 
    return result
}
