import { TreeNodeOptions } from "./types"
import { forEachTreeByDfs } from "./forEachTreeByDfs"; 

export type IForEachTreeCallback<Node,Path=string> = ({ node, level, parent, path, index }: { node: Node, level: number, parent?: Node | null, path: Path[], index: number }) => any

export interface ForEachTreeOptions extends TreeNodeOptions {
    startId?: string | number | null                 // 从哪一个节点id开始进行遍历
}
export const forEachTree = forEachTreeByDfs