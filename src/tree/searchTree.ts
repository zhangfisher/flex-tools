import { ABORT } from "../object/forEachObject"
import type { ForEachTreeOptions, IForEachTreeCallback  } from "./forEachTree"
import { TreeNode,TreeNodeOptions } from "./types"
import { forEachTreeByDfs } from "./forEachTreeByDfs";

export interface SerachTreeOptions extends TreeNodeOptions,ForEachTreeOptions {
    matchOne?:boolean               //   只匹配一个就退出搜索
}

/**
 *    遍历树的每一个节点，执行mather({node,level,parent,path,index})，如果
 *    返回true，则调用picker函数返回结果
 * 
 *   
 *   matchOne:只匹配一个
 *   path: 完整路径，默认情况返回的所在节点以及其祖先节点的集合
 *   如果提供了pathKey参数，则fullpath返回的 所在节点以及其祖先节点的集合的名称数组
 *   如果没有提供pathKey参数，则fullpath返回的 所在节点以及其祖先节点的集合
 * 
  * 
  * @param treeData 
  * @param matcher 
  * @param picker
  * @param matchOne 只匹配一个就退出,匹配所有,默认只匹配一个
  * 
  */
export function serachTree<Node extends TreeNode=TreeNode,Returns=Node[]>(treeData:Node[] | Node,matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions):Returns[]{
    let result:Returns[] = []
    const pickerFunc = picker || (({node})=>node) as IForEachTreeCallback<Node>
    const opts = Object.assign({matchOne:true},options || {})   
    forEachTreeByDfs<Node>(treeData,({node,level,parent,path,index})=>{
       if(matcher({node,level,parent,path,index})){
           result.push(pickerFunc({node,level,parent,path,index}))
           return opts.matchOne==false ? undefined : ABORT  
       }
    },opts)
    return result as  Returns[]
}
