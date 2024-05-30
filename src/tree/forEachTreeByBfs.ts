import { ABORT } from "../object/forEachObject"
import { DefaultTreeOptions } from "./consts"
import type { TreeNode, TreeNodeBase } from "./types"
import { assignObject } from "../object/assignObject";
import type { ForEachTreeOptions, IForEachTreeCallback } from "./forEachTree";
import { buildPathGenerator } from "./utils";
 

/**
 * 广度优先遍历
 * @param treeData 
 * @param callback 
 * @param options 
 * @returns 
 */
export function forEachTreeByBfs<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    let { startId, childrenKey, idKey, path,level:maxLevel } = assignObject({
        startId: null,
        level:0
    }, DefaultTreeOptions, options) as Required<ForEachTreeOptions>
    const generatePath = buildPathGenerator(path,idKey)

    // 当指定startId时用来标识是否开始调用callback
    let isStart = startId == null ? true : (typeof (treeData) == 'object' ? String((treeData as Node)[idKey]) === String(startId) : false)

    const queue = (Array.isArray(treeData) ? [{id:"__ROOT__",children:treeData}] : [treeData] ) as Node[]

    const levels: number[] = [];
    const paths:any[] = []
    const parents:Node[] = []
    const indexs:number[]=[]

    while (queue.length > 0) {
        const node = queue.shift() as Node;
        
        let level = 0, path =[], parent, index = 0
        
        if(node.id !== "__ROOT__"){
            level = levels.shift() || 1     
            path = paths.shift() || [generatePath(node)]         
            parent = parents.shift()  
            index = indexs.shift() || 0
        }

        if (node[childrenKey]  && (maxLevel==0 || maxLevel >0 && level<maxLevel)) {
            for (let i=0;i<node[childrenKey].length;i++) {
                const child = node[childrenKey][i]
                queue.push(child);
                levels.push(level + 1)
                paths.push([...path,generatePath(child)])
                parents.push(node)
                indexs.push(i)
            }
        }
        if (isStart === false && startId != null) {
            isStart = String(node[idKey]) === String(startId)
        }
        // skip参数决定是否执行跳过节点而不执行callback
        if (isStart && node.id !== "__ROOT__") {
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

 