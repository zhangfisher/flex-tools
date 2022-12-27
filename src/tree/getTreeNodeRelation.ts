/**
 * 
 *  获取节点之间的关系
 * 
 */

import { DefaultTreeOptions } from "./consts";
import { forEachTree } from "./forEachTree";
import { TreeNode, TreeNodeOptions } from "./types";
import { ABORT } from '../object/forEachObject';

 
export interface GetTreeNodeRelationOptions extends TreeNodeOptions{
    
}

export enum TreeNodeRelation{
    Same = 0,                               // 相同节点
    Child = 1,                              // 子节点
    Parent = 2,                             // 父节点     
    Descendants = 3,                        // 后代    
    Ancestors = 4,                          // 祖先
    Sibling = 5,                            // 兄弟节点    
    Unknown = 9                             // 未知
}

export function getTreeNodeRelation<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId:Node[IdKey],refNodeId:Node[IdKey],options?:GetTreeNodeRelationOptions):TreeNodeRelation{
    let result:TreeNodeRelation  = TreeNodeRelation.Unknown;

    let { childrenKey,idKey } = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetTreeNodeRelationOptions>     
    
    if(nodeId == refNodeId) return TreeNodeRelation.Same

    let nodes: string | any[]=[] 
    
    forEachTree<Node>(treeObj,({node:curNode,level,parent,path})=>{
        if(nodes.length==0){
            if(curNode[idKey]==nodeId) {
                nodes = [[nodeId,level,parent && parent[idKey],path],refNodeId]
                return
            }else if(curNode[idKey]==refNodeId){
                nodes = [[refNodeId,level,parent && parent[idKey],path],nodeId]
                return
            } 

        }
        if(curNode[idKey]==nodes[1]){
            const [id,level,parentId,basePath] = nodes[0]
            let afterNode:Node = nodes[1]
            if(parent?.id == parentId){
                result = TreeNodeRelation.Sibling
            }else if(parent?.id == id ){
                result = TreeNodeRelation.Child
            }else if(path.join("/").startsWith(basePath.join("/"))){
                result = TreeNodeRelation.Descendants
            }
            return ABORT
        }

    },options)  

    return result
}
