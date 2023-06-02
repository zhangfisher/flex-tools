/**
 * 
 *  获取节点之间的关系
 * 
 */

import { DefaultTreeOptions } from "./consts";
import { TreeNode, TreeNodeOptions } from "./types";
import { ABORT } from '../object/forEachObject';
import { forEachTreeByDfs } from "./forEachTreeByDfs";

 
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
    let relation:any = 9;

    const opts= Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetTreeNodeRelationOptions>     
    const { idKey } = opts
    if(nodeId == refNodeId) return TreeNodeRelation.Same

    let nodes: string | any[]=[] 
    
    forEachTreeByDfs<Node>(treeObj,({node:curNode,level,parent,path})=>{
        if(nodes.length==0){
            if(curNode[idKey]==nodeId) {
                nodes = [[nodeId,level,parent && parent[idKey],path],refNodeId]
                return
            }else if(curNode[idKey]==refNodeId){
                nodes = [[refNodeId,level,parent && parent[idKey],path],nodeId]
                return
            } 
        }
        if(nodes.length==0) return 
        if(curNode[idKey]==nodes[1]){
            const [id,level,parentId,basePath] = nodes[0]
            if(parent?.id == parentId){
                relation = TreeNodeRelation.Sibling
            }else if(parent?.id == id ){
                relation = TreeNodeRelation.Child
            }else if(path.startsWith(basePath)){
                relation = TreeNodeRelation.Descendants
            }
            return ABORT 
        }
    },opts)  

    if(nodes[0][0] == nodeId){
        if(relation == TreeNodeRelation.Descendants) relation = TreeNodeRelation.Ancestors 
        if(relation == TreeNodeRelation.Child) relation = TreeNodeRelation.Parent
    }
    return relation as TreeNodeRelation
}
