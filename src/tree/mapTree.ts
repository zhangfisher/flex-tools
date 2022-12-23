import { TreeNode } from "./forEachTree"

export type ITreeNodeMapper<FromNode,ToNode> = ({node,parent,level}:{node:FromNode,parent?:FromNode | null,level?:number})=>ToNode

/**
 * 映射生成新的树
 * 每一个节点生成新的节点
 * 
 * 注意生成的映射树不会更新原有的树结构
 * 
 * @param treeData 
 * @param mapper 
 */
export function mapTree<FromNode extends TreeNode=TreeNode,ToNode extends TreeNode=FromNode>(treeData:FromNode[] | FromNode,mapper:ITreeNodeMapper<FromNode,ToNode>):ToNode[] | ToNode{
    function mapTreeNode(node:FromNode,parent:FromNode | null,level:number):ToNode{
        let newNode = Object.assign({}, mapper({ node, parent, level })) as unknown  as ToNode
        if(node.children && Array.isArray(node.children) && node.children.length>0){
            newNode.children = [] 
            for(let childNode of node.children ){
                newNode.children.push(mapTreeNode(childNode as FromNode,node,level+1))
            }
        }
        return newNode  
    }
    if(Array.isArray(treeData)){
        let nodes:ToNode[] =  []
        for(let node of treeData){
            nodes.push(mapTreeNode(node,null,0))
        }
        return nodes
    }else{
        return mapTreeNode(treeData,null,0)
    }    
}
