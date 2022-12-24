import { DefaultTreeOptions } from "./consts"
import type { TreeNode, TreeNodeOptions } from "./types"

export type ITreeNodeMapper<FromNode,ToNode> = ({node,parent,level,path}:{node:FromNode,parent:FromNode | null,level:number,path:any[]})=>ToNode


export interface MapTreeOptions extends TreeNodeOptions{
    
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
export function mapTree<FromNode extends TreeNode = TreeNode,ToNode extends TreeNode=FromNode>(treeData:FromNode[] | FromNode,mapper:ITreeNodeMapper<FromNode,ToNode>,options?:MapTreeOptions):ToNode[] | ToNode{
    let {childrenKey = 'children',pathKey} = Object.assign({}, DefaultTreeOptions ,options || {}) //as Required<MapTreeOptions>    

    function mapTreeNode(node:FromNode,parent:FromNode | null,level:number,parentPath:any[]):ToNode{
        let curPath = [...parentPath,pathKey ? node[pathKey] : node] 
        let newNode = Object.assign({}, mapper({ node, parent, level,path:curPath})) as ToNode
        if(node[childrenKey]  && Array.isArray(node[childrenKey]) && node[childrenKey] .length>0){
            (newNode as any)[childrenKey]  = [] 
            for(let childNode of node[childrenKey] ){
                newNode[childrenKey].push(mapTreeNode(childNode as FromNode,node,level+1,curPath))
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
