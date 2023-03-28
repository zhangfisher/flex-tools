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
import { forEachTreeByDfs } from "./forEachTreeByDfs";
import { TreeNode, TreeNodeOptions } from "./types";

 
export interface GetByIdOptions extends TreeNodeOptions{}

export function getById<Node extends TreeNode = TreeNode,IdKey extends string = "id">(treeObj:Node | Node[],nodeId:Node[IdKey],options?:GetByIdOptions):Node | null {
    let result:Node | null = null;
    const opts = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetByIdOptions>     
    const { idKey } = opts
    forEachTreeByDfs<Node>(treeObj,({node})=>{
        if(node[idKey] == nodeId){
            result = node
            return ABORT    
        }
    },opts) 
    return result
}
