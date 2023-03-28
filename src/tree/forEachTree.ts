import { ABORT } from "../object/forEachObject"
import { DefaultTreeOptions } from "./consts"
import { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types"
import { isPlainObject } from '../typecheck/isPlainObject';
import { assignObject } from "../object/assignObject";

export type IForEachTreeCallback<Node> = ({ node, level, parent, path, index }: { node: Node, level: number, parent: Node | undefined | null, path: string, index: number }) => any

export interface ForEachTreeOptions extends TreeNodeOptions {
    startId?: string | number | null                 // 从哪一个节点id开始进行遍历
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
export function forEachTree<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    let { startId, childrenKey, idKey, pathKey, pathDelimiter } = Object.assign(
        { startId: null }, DefaultTreeOptions, options || {}) as Required<ForEachTreeOptions>
    // 当指定startId时用来标识是否开始调用callback
    let isStart = startId == null ? true : (typeof (treeData) == 'object' ? String((treeData as Node)[idKey]) === String(startId) : false)
    let isAbort = false
    function forEachNode(node: Node, level = 1, parent: Node | null, parentPath: any[], index: number): boolean | undefined {
        let curPath = [...parentPath, String(pathKey in node ? node[pathKey] : node[idKey])]
        if (isAbort) return
        let result: any = true
        if (isStart === false && startId != null) {
            isStart = String(node[idKey]) === String(startId)
        }
        // skip参数决定是否执行跳过节点而不执行callback
        if (isStart) {
            //如果在Callback中返回false则
            result = callback({ node, level, parent, path: curPath.join(pathDelimiter), index })
            if (result === ABORT) {
                isAbort = true
                return
            }
        }
        let children = node[childrenKey]
        if (children && Array.isArray(children) && children.length > 0) {
            level += 1
            for (let i = 0; i < children.length; i++) {
                result = forEachNode(children[i], level, node, curPath, i)
                if (result === ABORT) return false
            }
        }
    }
    if (Array.isArray(treeData)) {
        treeData.forEach((node, index) => forEachNode(node, 1, null, [], index))
    } else {
        forEachNode(treeData, 1, null, [], -1)
    }
}

/**
 * 广度优先遍历
 * @param treeData 
 * @param callback 
 * @param options 
 * @returns 
 */
export function bfsForEachTree<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    let { startId, childrenKey, idKey, pathKey, pathDelimiter } = assignObject({
        startId: null,
    }, DefaultTreeOptions, options) as Required<ForEachTreeOptions>

    // 当指定startId时用来标识是否开始调用callback
    let isStart = startId == null ? true : (typeof (treeData) == 'object' ? String((treeData as Node)[idKey]) === String(startId) : false)

    const queue = (isPlainObject(treeData) ? [treeData] : treeData as Node[]) as Node[]
    const result: any[] = [];
    const levels: number[] = [];
    const paths:any[] = []
    const parents:Node[] = []
    const indexs:number[]=[]

    while (queue.length > 0) {
        const node = queue.shift() as Node;
        result.push(node);
        let level = levels.shift() || 1     
        let path = paths.shift() || node[pathKey]       
        let parent = parents.shift()  
        let index = indexs.shift() || 0
        if (node[childrenKey]) {
            for (let i=0;i<node[childrenKey].length;i++) {
                const child = node[childrenKey][i]
                queue.push(child);
                levels.push(level + 1)
                paths.push(`${path}${pathDelimiter}${child[pathKey]}`)
                parents.push(node)
                indexs.push(i)
            }
        }
        if (isStart === false && startId != null) {
            isStart = String(node[idKey]) === String(startId)
        }
        // skip参数决定是否执行跳过节点而不执行callback
        if (isStart) {
            //如果在Callback中返回false则
            if (callback({ 
                node, 
                level, 
                parent,
                path, 
                index
            }) === ABORT) {
                break
            }
        }
    }

    return result;
}



/**
 * 深度优先的树遍历
 * @param treeData 
 * @param callback 
 * @param options 
 * @returns 
 */
export function dfsForEachTree<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    let { startId, childrenKey, idKey, pathKey, pathDelimiter } = assignObject({
        startId: null,
    }, DefaultTreeOptions, options) as Required<ForEachTreeOptions>

    // 当指定startId时用来标识是否开始调用callback
    let isStart = startId == null ? true : (typeof (treeData) == 'object' ? String((treeData as Node)[idKey]) === String(startId) : false)

    const stack = (isPlainObject(treeData) ? [treeData] : treeData as Node[]) as Node[]
    const result: any[] = [];
    const levels: number[] = [];
    const paths:any[] = []
    const parents:Node[] = []
    const indexs:number[]=[]

    while (stack.length > 0) {
        const node = stack.pop() as Node;
        result.push(node);
        const level = levels.pop() || 1; 
        let path = paths.pop() || node[pathKey]       
        let parent = parents.pop()  
        let index = indexs.pop() || 0
        if (node[childrenKey]) {
            for (let i = node[childrenKey].length - 1; i >= 0; i--) {
                const child = node[childrenKey][i]
                stack.push(child);
                levels.push(level + 1);
                paths.push(`${path}${pathDelimiter}${child[pathKey]}`)
                parents.push(node)
                indexs.push(i)
            }
        }
        if (isStart === false && startId != null) {
            isStart = String(node[idKey]) === String(startId)
        }
        // skip参数决定是否执行跳过节点而不执行callback
        if (isStart) {
            //如果在Callback中返回false则
            if (callback({ 
                node, 
                level, 
                parent,
                path, 
                index
            }) === ABORT) {
                break
            }
        }
        
    }

    return result;
}


//   export function forEachTree<Node extends TreeNodeBase = TreeNode>(treeData:Node[] | Node,callback:IForEachTreeCallback<Node>,options?:ForEachTreeOptions){
//     let {startId,childrenKey,idKey,pathKey,pathDelimiter} = Object.assign(
//         {startId:null },DefaultTreeOptions,options || {}) as Required<ForEachTreeOptions>
//     // 当指定startId时用来标识是否开始调用callback
//     let isStart= startId==null ? true : (typeof(treeData)=='object' ? String((treeData as Node)[idKey])===String(startId) : false)
//     let isAbort = false
//     function forEachNode(node:Node,level=1,parent:Node | null,parentPath:any[],index:number):boolean | undefined{
//         let curPath = [...parentPath,String(pathKey in node ? node[pathKey] : node[idKey])]
//         if(isAbort) return
//         let result:any=true
//         if(isStart===false && startId!=null){
//             isStart=String(node[idKey])===String(startId)
//         }
//         // skip参数决定是否执行跳过节点而不执行callback
//         if(isStart) {
//             //如果在Callback中返回false则
//             result=callback({node,level,parent,path:curPath.join(pathDelimiter),index})
//             if(result===ABORT){
//                 isAbort = true
//                 return
//             }
//         }
//         let children=node[childrenKey]
//         if(children && Array.isArray(children) && children.length>0){
//             level+=1
//             for(let i=0;i<children.length;i++){
//                 result = forEachNode(children[i],level,node,curPath,i)
//                 if(result===ABORT) return false
//             }
//         }
//     }
//     if(Array.isArray(treeData)){
//         treeData.forEach((node,index)=>forEachNode(node,1,null,[],index))
//     }else{
//         forEachNode(treeData,1,null,[],-1)
//     }
//  }
