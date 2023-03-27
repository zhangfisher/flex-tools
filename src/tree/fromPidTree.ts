/**
 * 
 *  toPidTree的反向操作
 * 
 * 将[{id,pid,...},{id,pid,...},...,{id,pid,...}]形式的树转换为的{id:any,children:[{},{},...,{}]}树结构
 * 
 * 
 */

import { DefaultTreeOptions } from "./consts";
import { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types";
import { PidTreeNode } from "./toPidTree";
import { omit } from "../object/omit"

 export interface FromPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{ 
     mapper?:(node:FromNode) => ToNode
 }
  

 export function fromPidTree<
    FromNode extends PidTreeNode = PidTreeNode,
    ToNode extends TreeNode = TreeNode<Omit<FromNode,'pid'>>,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
    >(pidNodes:FromNode[],options?:FromPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):ToNode[]{
    const opts = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<FromPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>>     
    const { idKey, childrenKey,mapper } = opts
    let treeObj:ToNode[] = [];

    function getNode(node:FromNode):ToNode{
        let toNode:ToNode 
        if(typeof(mapper)=='function'){
            toNode = mapper(node);
            (toNode as any)[idKey] = node[idKey]
        }else{
            toNode = {            
                ...omit(node,'pid'),
                [idKey]: node[idKey],
            } as ToNode
        }        
        let children = pidNodes.filter(pNode => pNode.pid==node[idKey])
        if(children.length>0){
            (toNode as any)[childrenKey] = children.map(subnode=>getNode(subnode))
        }        
        return toNode        
    }
    for(let pNode of pidNodes.filter(node=>node.pid==null)){
        treeObj.push(getNode(pNode));
    }
    return treeObj
}

