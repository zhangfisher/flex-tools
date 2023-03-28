 
import { isNothing } from "../typecheck/isNothing";
import type { IForEachTreeCallback } from "./forEachTree";
import { getById } from "./getById";
import { getTreeNodeInfo } from "./getTreeNodeInfo";
import { moveTreeNode, MoveTreeNodePosition } from "./moveTreeNode";
import { removeTreeNodes } from "./removeTreeNodes";
import { serachTree, SerachTreeOptions } from "./searchTree";
import { TreeNode, TreeNodeOptions } from "./types";
import { forEachTreeByDfs } from "./forEachTreeByDfs";

export interface FlexTreeOptions<Node extends TreeNode = TreeNode,IdKey extends string = "id"> extends TreeNodeOptions {
    idGenerator(node:Partial<Node>):Node[IdKey]
}

export class FlexTree<Node extends TreeNode = TreeNode,IdKey extends string = "id",ChildrenKey extends string = "children">{
    #treeObj:Node[] | Node
    #options:FlexTreeOptions<Node,IdKey>
    constructor(nodes:Node[] | Node,options?:FlexTreeOptions<Node,IdKey>){
        this.#treeObj = nodes
        this.#options = Object.assign({},options) as Required<FlexTreeOptions>
    }
    get root(): Node | undefined {
        return Array.isArray(this.#treeObj) ? undefined : this.#treeObj
    }
    get nodes(): Node[]{
        return Array.isArray(this.#treeObj) ? this.#treeObj : (isNothing(this.#treeObj) ? [] : [this.#treeObj])
    }
    [Symbol.iterator](){        
        type ParamsType = Parameters<IForEachTreeCallback<Node>>[0] 
        let nodes:ParamsType[] = []
        forEachTreeByDfs<Node>(this.#treeObj,({node,parent,index,level,path})=>{
            nodes.push({node,parent,index,level,path})
        },this.#options)
        let index = 0
        return {
            next: function ():{value: Parameters<IForEachTreeCallback<Node>>[0] ,done:boolean} {
              return {
                value: nodes[index++],
                done: index > nodes.length
              };
            }
          };        
    }
    /**
     * 返回指定id的节点
     * @param nodeId 
     * @returns 
     */
    getNode(nodeId:Node[IdKey]):Node | null{
        return getById<Node,IdKey>(this.#treeObj,nodeId,this.#options)
    }
    addNode(nodeData: Partial<Node> ,refNodeId:Node[IdKey],pos:MoveTreeNodePosition = MoveTreeNodePosition.LastChild):Node {
        const {idKey='id',childrenKey='children'} = this.#options        
        if(isNothing(nodeData[idKey])) {
            if(typeof this.#options.idGenerator === 'function'){
                (nodeData as any)[idKey] = this.#options.idGenerator(nodeData)
            }
            if(isNothing(nodeData[idKey])){
                throw new Error("必须指定有效的节点ID")
            }            
        }
        let refNodeInfo =  getTreeNodeInfo<Node,IdKey>(this.#treeObj,refNodeId,this.#options)
        if(refNodeInfo){
            let { parent,node:refNode,index}  = refNodeInfo
            if(pos==MoveTreeNodePosition.FirstChild){
                if(!(childrenKey in (refNode as Node))) (refNode as any)[childrenKey] = [];
                (refNode as any)[childrenKey].splice(0,0,nodeData)
            }else if(pos==MoveTreeNodePosition.LastChild){
                if(!(childrenKey in (refNode as Node))) (refNode as any)[childrenKey] = [];
                (refNode as any)[childrenKey].push(nodeData)
            }else if(pos==MoveTreeNodePosition.Next){
                let children : Node[] 
                if(isNothing(parent)){// 根节点
                    this.#treeObj =Array.isArray(this.#treeObj) ? this.#treeObj : [this.#treeObj as Node]
                    children = this.#treeObj 
                    index = 0
                }else{
                    children = (parent as Node)[childrenKey]
                }
                children.splice(index+1 ,0,nodeData as Node)
            }else if(pos==MoveTreeNodePosition.Previous){
                let children : Node[] 
                if(isNothing(parent)){// 根节点
                    this.#treeObj =Array.isArray(this.#treeObj) ? this.#treeObj : [this.#treeObj as Node]
                    children = this.#treeObj 
                    index = 0
                }else{
                    children = (parent as Node)[childrenKey]
                }
                children.splice(index>0 ? index-1 : 0 ,0,nodeData as Node)
            }else{
                throw new TypeError()
            }
       }
       return nodeData as  Node
    }
    removeNode(nodeId:Node[IdKey]):void {      
        const {idKey='id',childrenKey='children'} = this.#options
       removeTreeNodes<Node>(this.#treeObj,({node})=>{
            if(node[idKey] ==  nodeId){
                return true
            }
        },{
            onlyRemoveOne:true,
            ...this.#options
        })
    }
    moveNode(nodeId: Node[IdKey],refNodeId:Node[IdKey],pos:MoveTreeNodePosition){
        return moveTreeNode<Node,IdKey>(this.#treeObj,nodeId,refNodeId,pos,this.#options) 
    }
    /**
     * 搜索节点
     */
    search(matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions){
        const { matchOne } = options as Required<SerachTreeOptions>
        return serachTree<Node,Node[]>(this.#treeObj,matcher,picker,{
            matchOne,
            ...this.#options
        })
    }
}