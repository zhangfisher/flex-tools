/**
 * 
 *  toPidTree的反向操作
 * 
 * 将[{id,pid,...},{id,pid,...},...,{id,pid,...}]形式的树转换为的{id:any,children:[{},{},...,{}]}树结构
 * 
 * 
 */

 import { DefaultTreeOptions } from "./consts";
 import { forEachTree } from "./forEachTree";
 import { TreeNode, TreeNodeBase, TreeNodeId, TreeNodeOptions } from "./types";
 import omit from "lodash/omit"; 
  
 export interface FromPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{ 
     mapper?:({node,level,parent,path,index}:{node:FromNode,level:number,parent:FromNode | null,path:string,index:number}) => Omit<ToNode,ChildrenKey | IdKey>
 }
  
export type PidTreeNode< 
    Node extends Record<string,any> = {[key: string]: any},IdKey extends string = 'id'
> = Node      
    & TreeNodeId<IdKey,Node[IdKey]>  
    & {
        pid:Node[IdKey] | null 
    } 


 export function fromPidTree<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
    >(treeObj:PidTreeNode<FromNode>[],options?:FromPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):Omit<ToNode,ChildrenKey>[]{

    let tree

    



}

