/**
 * 
 *  移动树节点
 * 
 *  moveTreeNode(treeObj,fromNode,toNode,position)
 * 
 */

import { DefaultTreeOptions } from "./consts";
import { getTreeNodeInfo } from "./getTreeNodeInfo";
import { getTreeNodeRelation, TreeNodeRelation } from "./getTreeNodeRelation";
import { TreeNode, TreeNodeOptions } from "./types";

 
export interface MoveTreeNodeOptions extends TreeNodeOptions{ 
}

export enum MoveTreeNodePosition{
    LastChild = 0,                           // 移动为目标节点的最后一个子节点
    FirstChild = 1,                          //
    Next= 2,                                 //  下一个兄弟节点
    Previous = 3                             // 上一个兄弟
}

export function moveTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],fromNodeId: Node[IdKey],toNodeId:Node[IdKey],pos:MoveTreeNodePosition=MoveTreeNodePosition.LastChild, options?:MoveTreeNodeOptions):void {
    const opts = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<MoveTreeNodeOptions>     
    const  { childrenKey } = opts
    // 先检查是否允许移动
    let R = getTreeNodeRelation<Node,IdKey>(treeObj, fromNodeId, toNodeId,options)   
    if([TreeNodeRelation.Parent,TreeNodeRelation.Ancestors].includes(R)){
        throw new Error("Move here is not allowed")
    }
    
    let fromNode = getTreeNodeInfo<Node>(treeObj,fromNodeId)
    let toNode = getTreeNodeInfo<Node>(treeObj,toNodeId)

    if(!(fromNode && toNode)) {
        throw new Error("Unable to read node data")
    }

    if(pos==MoveTreeNodePosition.LastChild){       
        if(!(childrenKey in toNode.node)) (toNode.node as any)[childrenKey]=[]
        toNode.node[childrenKey].push(fromNode.node)        
    }else if(pos==MoveTreeNodePosition.FirstChild){
        if(!(childrenKey in toNode.node)) (toNode.node as any)[childrenKey]=[]
        toNode.node[childrenKey].splice(0,0,fromNode.node) 
    }else if(pos==MoveTreeNodePosition.Next){
        if(toNode.parent){
            toNode.parent[childrenKey].splice(toNode.index+1,0,fromNode.node) 
        }else if(Array.isArray(treeObj)){
            treeObj.splice(toNode.index+1,0,fromNode.node) 
        }
    }else if(pos==MoveTreeNodePosition.Previous){
        if(toNode.parent){
            toNode.parent[childrenKey].splice(toNode.index<=0 ? 0 : toNode.index,0,fromNode.node) 
        }else if(Array.isArray(treeObj)){
            treeObj.splice(toNode.index<=0 ? 0 : toNode.index-1,0,fromNode.node)           
        }
    }else{
        throw new TypeError('Wrong positional parameter')
    }  

    // 从原始位置移除
    if(fromNode){
        if(fromNode.parent){
            fromNode.parent[childrenKey].splice(fromNode.index,1)
        }else{  // 根节点
            if(Array.isArray(treeObj)){
                treeObj.splice(fromNode.index,1)
            }else{
                treeObj[childrenKey].splice(fromNode.index,1)
            }
        }
    }

}
