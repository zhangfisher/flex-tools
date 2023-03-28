import { ABORT } from "../object/forEachObject"
import { DefaultTreeOptions } from "./consts"
import type { TreeNode, TreeNodeBase } from "./types"
import { isPlainObject } from '../typecheck/isPlainObject';
import { assignObject } from "../object/assignObject";
import type { ForEachTreeOptions, IForEachTreeCallback } from "./forEachTree";
 

/**
 * 深度优先的树遍历
 * @param treeData 
 * @param callback 
 * @param options 
 * @returns 
 */
 export function forEachTreeByDfs<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    let { startId, childrenKey, idKey, pathKey, pathDelimiter } = assignObject({
        startId: null,
    }, DefaultTreeOptions, options) as Required<ForEachTreeOptions>

    // 当指定startId时用来标识是否开始调用callback
    let isStart = startId == null ? true : (typeof (treeData) == 'object' ? String((treeData as Node)[idKey]) === String(startId) : false)

    const stack = (isPlainObject(treeData) ? [treeData] : treeData as Node[]) as Node[]
    const levels: number[] = [];
    const paths:any[] = []
    const parents:Node[] = []
    const indexs:number[]=[]

    while (stack.length > 0) {
        const node = stack.pop() as Node;
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
} 