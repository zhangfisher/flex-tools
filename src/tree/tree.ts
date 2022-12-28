 
import { getById } from "./getById";
import { getTreeNodeInfo } from "./getTreeNodeInfo";
import { MoveTreeNodePosition } from "./moveTreeNode";
import { TreeNode, TreeNodeOptions } from "./types";

 
export interface FlexTreeOptions extends TreeNodeOptions {}



export class FLexTree<Node extends TreeNode = TreeNode,IdKey extends string = "id",ChildrenKey extends string = "children">{
    #treeObj:Node[] | Node
    #options:FlexTreeOptions
    constructor(nodes:Node[] | Node,options:FlexTreeOptions){
        this.#treeObj = nodes
        this.#options = Object.assign({},options) as Required<FlexTreeOptions>
    }
    get root():Node | Node[]{
        return this.#treeObj
    }
    /**
     * 返回指定id的节点
     * @param nodeId 
     * @returns 
     */
    getNode(nodeId:Node[IdKey]):Node | null{
        return getById<Node,IdKey>(this.#treeObj,nodeId,this.#options)
    }


    addNode(node: Node ,refNodeId:Node[IdKey],pos:MoveTreeNodePosition):Node {
       let refNodeInfo =  getTreeNodeInfo<Node,IdKey>(this.#treeObj,refNodeId,this.#options)
       if(refNodeInfo){
            const { parent,node,index}  = refNodeInfo


       }
       return node
    }
    removeNode(refNodeId:Node[IdKey]):void {
       let refNodeInfo =  getTreeNodeInfo<Node,IdKey>(this.#treeObj,refNodeId,this.#options)
       if(refNodeInfo){
            const { parent,node,index}  = refNodeInfo
            

       }
    }
    moveNode(fromNodeId: Node[IdKey],refNodeId:Node[IdKey],pos:MoveTreeNodePosition){
        
    }
    /**
     * 搜索节点
     */
    search(){

    }
}