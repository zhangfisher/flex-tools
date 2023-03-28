/**
 * 
 * 根据ID获取节点对象 
 * 
 */
import { ABORT } from "../object";
import { DefaultTreeOptions } from "./consts";
import { forEachTreeByDfs } from "./forEachTreeByDfs";
import { TreeNode, TreeNodeOptions } from "./types";
 
  
 export interface GetTreeNodeOptions extends TreeNodeOptions{
     includeParent?:boolean         // 当指定时返回[Node,ParantNode]
 }  
 
 export function getTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetTreeNodeOptions):Node | undefined {
     let result:Node | undefined;
     const opts = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<GetTreeNodeOptions>     
     const { idKey } = opts
     forEachTreeByDfs<Node>(treeObj,({node})=>{
          if(node[idKey] == nodeId){
            result =  node;
            return ABORT
          }
     },opts) 
     return result
 }
 