import { ABORT } from "../object/forEachObject"
import { DefaultTreeOptions } from "./consts"
import { TreeNode, TreeNodeOptions } from "./types"

export  type IForEachTreeCallback<Node> = ({node,level,parent,path}:{node:Node,level:number,parent:Node | null,path:any[]})=> any

export  interface ForEachTreeOptions extends TreeNodeOptions{
    startId?:string | number | null                 // 从哪一个节点id开始进行遍历
 }
 
 
/**
 *
 * 对树节点依次进行遍历，并分别将节点数据传递给callback函数
 * 
 * 当callback返回ABORT时中止遍历
 * 
 * @param treeData
 * @param callback    
 * @param startId  从指定的id的节点开始进行遍历，之前的节点会跳过不会执行callback
 * @param idKey 树节点id字段名称
 * @param childrenName  子节点集合的属性名称，一般是children
 * @idName 节点id的名称，默认为是id
 */
export function forEachTree<Node extends TreeNode = TreeNode>(treeData:Node[] | Node,callback:IForEachTreeCallback<Node>,options?:ForEachTreeOptions){
    let {startId,childrenKey,idKey,pathKey} = Object.assign({startId:null,pathKey:null},DefaultTreeOptions,options || {}) as Required<ForEachTreeOptions>    
    // 当指定startId时用来标识是否开始调用callback
    let isStart= startId==null ? true : (typeof(treeData)=='object' ? String((treeData as Node)[idKey])===String(startId) : false)
    let isAbort = false
    function forEachNode(node:Node,level=1,parent:Node | null,parentPath:any[]):boolean | undefined{
        let curPath = [...parentPath,pathKey ? node[pathKey] : node] 
        if(isAbort) return
        let result:any=true
        if(isStart===false && startId!=null){
            isStart=String(node[idKey])===String(startId)
        }
        // skip参数决定是否执行跳过节点而不执行callback
        if(isStart) {
            //如果在Callback中返回false则
            result=callback({node,level,parent,path:curPath})
            if(result===ABORT){
                isAbort = true
                return 
            }
        }
        let children=node[childrenKey]
        if(children && Array.isArray(children) && children.length>0){
            level+=1            
            for(let subnode of children){
                result = forEachNode(subnode,level,node,curPath)
                if(result===ABORT) return false
            }
        }
    }
    if(Array.isArray(treeData)){
        treeData.forEach(node=>forEachNode(node,1,null,[]))
    }else{
        forEachNode(treeData,1,null,[])
    }    
 }
