import { ABORT } from "../object/forEachObject"

export  type IForEachTreeCallback<Node> = ({node,level,parent}:{node:Node,level:number,parent:Node | null,fullpath:(string | Node)[]})=> any

export  interface ForEachTreeOptions{
    startId?:string | number | null     // 从哪一个节点id开始进行遍历
    childrenKey?:string                // 子节点集的键名
    idKey?:string                      // 节点id字段名称
    pathKey?:string | null                     // 遍历组装完整路径时使用节点的哪一个键名，如果没有提供，则返回的fullpath是完整的路径上的节点列表
 }
 
export interface TreeNode{    
     children?:TreeNode[]
     [key:string]:any
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
export function forEachTree<T extends TreeNode = TreeNode>(treeData:T[] | T,callback:IForEachTreeCallback<T>,options?:ForEachTreeOptions){
    let {startId,childrenKey,idKey,pathKey} = Object.assign({startId:null,pathKey:null,childrenKey:"children",idKey:"id"},options || {}) as Required<ForEachTreeOptions>    
    // 当指定startId时用来标识是否开始调用callback
    let isStart= startId==null ? true : (typeof(treeData)=='object' ? String((treeData as T)[idKey])===String(startId) : false)
    let isAbort = false
    function forEachNode(node:T,level=1,parent:T | null,parentPath:string[]):boolean | undefined{
        if(isAbort) return
        let result:any=true
        if(isStart===false && startId!=null){
            isStart=String(node[idKey])===String(startId)
        }
        // skip参数决定是否执行跳过节点而不执行callback
        if(isStart) {
            //如果在Callback中返回false则
            result=callback({node,level,parent,fullpath:[...parentPath,pathKey ? node[pathKey] : node]})
            if(result===ABORT){
                isAbort = true
                return 
            }
        }
        let children=node[childrenKey]
        if(children && Array.isArray(children) && children.length>0){
            level+=1            
            for(let subnode of children){
                result = forEachNode(subnode,level,node,[...parentPath,pathKey ? node[pathKey] : node])
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
