/**
 * 
 * 根据ID获取节点对象 
 * 
 */
import { ABORT } from "../object";
import { DefaultTreeOptions } from "./consts";
import { forEachTreeByDfs } from "./forEachTreeByDfs";
import { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types";
 
  
 export interface GetTreeNodeInfoOptions extends TreeNodeOptions{
      
 }  
 
export interface TreeNodeInfo<Node,Path=string>{
    node:Node
    parent:Node | undefined | null
    path:Path[]
    level:number
    index:number
}

export function getTreeNodeInfo<Node extends TreeNodeBase = TreeNode,IdKey extends string = 'id',Path=string>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetTreeNodeInfoOptions):TreeNodeInfo<Node,Path> | undefined {
     let result:TreeNodeInfo<Node,Path> | undefined;     
     const opts =  Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetTreeNodeInfoOptions>     
     let { idKey } = opts
     forEachTreeByDfs<Node,Path>(treeObj,({node,parent,level,path,index})=>{
          if(node[idKey] == nodeId){
            result = {node,parent,level,path,index};
            return ABORT
          }
     },opts) 
     return result
 }
 