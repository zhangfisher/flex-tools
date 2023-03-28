/**
 * 
 * 根据ID获取节点对象 
 * 
 */
import { ABORT } from "../object";
import { DefaultTreeOptions } from "./consts";
import { forEachTreeByDfs } from "./forEachTreeByDfs";
import { TreeNode, TreeNodeOptions } from "./types";
 
  
 export interface GetTreeNodeInfoOptions extends TreeNodeOptions{
      
 }  
 
export interface TreeNodeInfo<Node>{
    node:Node
    parent:Node | undefined | null
    path:string
    level:number
    index:number
}

export function getTreeNodeInfo<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetTreeNodeInfoOptions):TreeNodeInfo<Node> | undefined {
     let result:TreeNodeInfo<Node> | undefined;     
     const opts =  Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetTreeNodeInfoOptions>     
     let { idKey } = opts
     forEachTreeByDfs<Node>(treeObj,({node,parent,level,path,index})=>{
          if(node[idKey] == nodeId){
            result = {node,parent,level,path,index};
            return ABORT
          }
     },opts) 
     return result
 }
 