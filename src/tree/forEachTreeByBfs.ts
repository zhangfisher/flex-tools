import { ABORT } from "../object/forEachObject"
import { DefaultTreeOptions } from "./consts"
import type { TreeNode, TreeNodeBase } from "./types"
import { isPlainObject } from '../typecheck/isPlainObject';
import { assignObject } from "../object/assignObject";
import type { ForEachTreeOptions, IForEachTreeCallback } from "./forEachTree";
 

/**
 * 广度优先遍历
 * @param treeData 
 * @param callback 
 * @param options 
 * @returns 
 */
export function forEachTreeByBfs<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    let { startId, childrenKey, idKey, pathKey, pathDelimiter } = assignObject({
        startId: null,
    }, DefaultTreeOptions, options) as Required<ForEachTreeOptions>

    // 当指定startId时用来标识是否开始调用callback
    let isStart = startId == null ? true : (typeof (treeData) == 'object' ? String((treeData as Node)[idKey]) === String(startId) : false)

    const queue = (isPlainObject(treeData) ? [treeData] : treeData as Node[]) as Node[]
    const levels: number[] = [];
    const paths:any[] = []
    const parents:Node[] = []
    const indexs:number[]=[]

    while (queue.length > 0) {
        const node = queue.shift() as Node;
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
}

 