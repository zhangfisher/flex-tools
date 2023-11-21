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
import { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types";
import { getFullPath } from './utils';

 
export interface GetByPathOptions extends TreeNodeOptions{
     
}

export function getByPath<Node extends TreeNodeBase = TreeNode>(treeObj:Node | Node[],fullpath: string,options?:GetByPathOptions):Node | undefined {
    let result:Node | undefined;
    let opts = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetByPathOptions>     
    forEachTreeByDfs<Node>(treeObj,({node,path})=>{        
        if(getFullPath(path,opts.idKey) == fullpath){
            result = node
            return ABORT    
        }
    },opts) 
    return result
}
