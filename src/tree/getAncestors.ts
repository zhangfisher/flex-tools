/**
 * 
 * 获取所有祖先节点
 * 
 * getAncestors(tree,node.id) == [<祖先节点>,...,<祖先节点>,<爷节点>,<父节点>]
 * 
 * 
 */

import type { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types";
import { forEachTreeByDfs } from './forEachTreeByDfs';
import { DefaultTreeOptions } from "./consts";
import { ABORT } from "../consts";
import { searchTree } from "./searchTree";

export interface GetAncestorsOptions extends TreeNodeOptions{
    includeSelf?:boolean            //  返回结果是否包含自身节点
}

export function getAncestors<Node extends TreeNodeBase = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetAncestorsOptions):Node[] {
    const {idKey,includeSelf=false} = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetAncestorsOptions>     
    let nodes:Node[] =[]
    searchTree<Node,Node[],Node>(treeObj,
        ({node})=>node[idKey]==nodeId,
        ({node,path})=>{
            nodes=path
            return node
        },{
            ...options,
            path:(node:Node)=>node,
            matchOne:true
    })

    if(!includeSelf && nodes.length>0){
        nodes.pop()
    }

    return  nodes
}
