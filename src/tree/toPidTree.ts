/**
 * 
 * 将{id:any,children:[{},{},...,{}]}形式的树转换为[{id,pid,...},{id,pid,...},...,{id,pid,...}]的树结构
 * 
 * 
 */




import { DefaultTreeOptions } from "./consts";
import { TreeNode, TreeNodeBase, TreeNodeId, TreeNodeOptions } from "./types";
import { omit } from "../object/omit"
import { forEachTreeByDfs } from "./forEachTreeByDfs";

 export interface ToPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children',
    Path=string
> extends TreeNodeOptions{
     includeLevel?: boolean
     includePath?: boolean
     mapper?:({node,level,parent,path,index}:{node:FromNode,level:number,parent?:FromNode | null ,path:Path[],index:number}) => Omit<ToNode,ChildrenKey | IdKey>
 }
  
export type PidTreeNode< 
    Node extends Record<string,any> = {[key: string]: any},
    IdKey extends string = 'id',
    Path = string
> = Node      
    & TreeNodeId<IdKey,Node[IdKey]>  
    & {
        pid:Node[IdKey] | null
        level?:number
        path?:Path[]
    } 

export function toPidTree<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children',
    Path = string
>(treeObj:FromNode | FromNode[],options?:ToPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey,Path>):PidTreeNode<Omit<ToNode,ChildrenKey>,IdKey,Path>[]{
    
    const opts = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<ToPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey,Path>>     
    const { childrenKey,idKey,includeLevel=true, includePath=false,mapper } = opts

    let nodes:PidTreeNode<Omit<ToNode,ChildrenKey>,IdKey,Path>[] = []
    forEachTreeByDfs<FromNode,Path>(treeObj,({node,parent,level,path,index})=>{
        if(typeof(mapper)=='function'){
            let newNode = Object.assign({
                [idKey]: node[idKey],
                pid:null
            },mapper({node,parent,level,index,path})) as PidTreeNode<ToNode,IdKey,Path>     
            newNode.pid =parent ? parent?.[idKey]  : null            
            if(includeLevel) newNode.level = level
            if(includePath) newNode.path = path 
            nodes.push(newNode)
            nodes.push()
        }else{
            let newNode = Object.assign({},omit(node,childrenKey)) as PidTreeNode<ToNode,IdKey,Path>
            newNode.pid =parent ? parent?.[idKey]  : null
            if(includeLevel) newNode.level = level
            if(includePath) newNode.path = path
            nodes.push(newNode)
        }                
    },opts)
    return nodes
}