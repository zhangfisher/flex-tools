import { DefaultTreeOptions } from "./consts"
import type { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types"

export type ITreeNodeMapper<FromNode,ToNode> = ({node,parent,level,path}:{node:FromNode,parent:FromNode | null,level:number,path:any[]})=>ToNode


export interface MapTreeOptions extends TreeNodeOptions{
    from?:{
        idKey?:string,childrenKey?:string
    }
    to?:{
        idKey?:string,childrenKey?:string
    }
} 
/**
 * 映射生成新的树
 * 每一个节点生成新的节点
 * 
 * 注意生成的映射树不会更新原有的树结构
 * 
 * @param treeData 
 * @param mapper 
 */
export function mapTree<FromNode extends TreeNodeBase = TreeNode,ToNode extends TreeNodeBase = FromNode>(treeData:FromNode[] | FromNode,mapper:ITreeNodeMapper<FromNode,ToNode>,options?:MapTreeOptions):ToNode[] | ToNode{
    let {pathKey} = Object.assign({}, DefaultTreeOptions ,options || {}) as Required<MapTreeOptions>    
    const from = Object.assign({idKey:'id',childrenKey:"children"}, options?.from || {})
    const to = Object.assign({idKey:'id',childrenKey:"children"}, options?.to || {})

    function mapTreeNode(node:FromNode,parent:FromNode | null,level:number,parentPath:any[]):ToNode{
        let curPath = [...parentPath,pathKey ? node[pathKey] : node] 
        let newNode = Object.assign({}, mapper({ node, parent, level,path:curPath})) as ToNode
        if(node[from.childrenKey]  && Array.isArray(node[from.childrenKey]) && node[from.childrenKey] .length>0){
            (newNode as any)[to.childrenKey]  = [] 
            for(let childNode of node[from.childrenKey] ){
                newNode[to.childrenKey].push(mapTreeNode(childNode as FromNode,node,level+1,curPath))
            }
        }
        return newNode  
    }
    if(Array.isArray(treeData)){
        let nodes:ToNode[] =  []
        for(let node of treeData){
            nodes.push(mapTreeNode(node,null,0,[]))
        }
        return nodes
    }else{
        return mapTreeNode(treeData,null,0,[])
    }    
}
