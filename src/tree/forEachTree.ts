import { DefaultTreeOptions } from "./consts"
import { TreeNode, TreeNodeBase, TreeNodeOptions } from "./types"
import { assignObject } from "../object/assignObject";
import { forEachTreeByDfs } from "./forEachTreeByDfs";
import { forEachTreeByBfs } from "./forEachTreeByBfs";
import { forEachTreeByDfsRecursion } from "./forEachTreeByDfsRecursion";

export type IForEachTreeCallback<Node> = ({ node, level, parent, path, index }: { node: Node, level: number, parent?: Node | null, path: string, index: number }) => any

export interface ForEachTreeOptions extends TreeNodeOptions {
    startId?: string | number | null                 // 从哪一个节点id开始进行遍历
    algorithm?:'dfs' | 'bfs' | 'dfsRecursion'         // 遍历算法：深度优先遍历、广度优先遍历、深度优先遍历（递归）
}
export function forEachTree<Node extends TreeNodeBase = TreeNode>(treeData: Node[] | Node, callback: IForEachTreeCallback<Node>, options?: ForEachTreeOptions) {
    const opts = assignObject({
        startId: null,
        algorithm:'dfs'
    }, DefaultTreeOptions, options) as Required<ForEachTreeOptions>
    if(opts.algorithm=='dfs'){
        return forEachTreeByDfs(treeData,callback,options)
    }else if(opts.algorithm=='bfs'){
        return forEachTreeByBfs(treeData,callback,options)
    }else if(opts.algorithm=='dfsRecursion'){
        return forEachTreeByDfsRecursion(treeData,callback,options)
    }
}