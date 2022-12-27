/**
 * 获取指定的节点的关联节点
 */

import { TreeNode, TreeNodeOptions } from "./types";
import { ABORT } from '../object/forEachObject';
import { forEachTree } from "./forEachTree";
import { getTreeNodeInfo, TreeNodeInfo } from "./getTreeNodeInfo";

export interface GetRelatedTreeNodeOptions extends TreeNodeOptions {
    
}

export enum RelatedTreeNode{
    Parent = 1,
    Next = 2,
    Previous = 3 
}

export function getRelatedTreeNode<Node extends TreeNode = TreeNode,
    IdKey extends string = 'id' 
>(treeObj: Node | Node[],nodeId:Node[IdKey],pos:RelatedTreeNode , options?:GetRelatedTreeNodeOptions):Node | null {
    const opts = Object.assign({},options) as Required<GetRelatedTreeNodeOptions>
    const { idKey } = opts
    let result:Node | null = null
    let nodeInfo:TreeNodeInfo<Node> | undefined
    forEachTree<Node>(treeObj,({node,parent,index})=>{
        if(pos==RelatedTreeNode.Parent && node[idKey]==nodeId){
            result = parent
            return ABORT
        }else if(pos==RelatedTreeNode.Next){
            if(!nodeInfo) nodeInfo = getTreeNodeInfo(treeObj,nodeId,options)
            if(nodeInfo && (index == nodeInfo.index  +1)){
                result = node
                return ABORT
            }
        }else if(pos==RelatedTreeNode.Previous){
            if(!nodeInfo) nodeInfo = getTreeNodeInfo(treeObj,nodeId,options)
            if(nodeInfo && (index == nodeInfo.index  - 1)){
                result = node
                return ABORT
            }
        }
    },opts)
    return result
}
