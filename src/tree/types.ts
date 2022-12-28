// 树结构
export type TreeNodeChildren<Node extends Record<string,any>,IdKey extends string,ChildrenKey extends string> = {
    [key in ChildrenKey]?: TreeNode<Node,IdKey,ChildrenKey>[]
}
export type TreeNodeId<IdKey extends string = 'id', IdType=number> = {
    [key in IdKey]: IdType
}    
  
export type TreeNode<
    Node extends Record<string,any> = {[key: string]: any},          // 节点数据
    IdKey extends string  = 'id',
    ChildrenKey extends string = 'children'
> = { [key in IdKey]: Node[IdKey] }                         // 节点ID
    & TreeNodeChildren<Node,IdKey,ChildrenKey>              // 节点Children
    & Node      
    & TreeNodeId<IdKey,Node[IdKey]>  
  

export type TreeNodeBase = TreeNode<Record<string,any>,string>

export type EmptyTree = {}              // 没有任何节点

export type Tree<
    Node extends Record<string,any> = {[key: string]: any},          // 节点数据
    IdKey extends string  = 'id',
    ChildrenKey extends string = 'children'
> = EmptyTree | TreeNode<Node,IdKey,ChildrenKey> | TreeNode<Node,IdKey,ChildrenKey>[]


export interface TreeNodeOptions{
    childrenKey?:string                             // 子节点集的键名
    idKey?:string                                   // 节点id字段名称
    pathKey?:string                                 // 当生成路径时使用的节点键名
    pathDelimiter?:string                           // 路径分割符
}
  
  
 



// let node1:TreeNode<{id:number,name:string}> = {
//     id:1,
//     name:"fdf",
//     children:[] 
// }
// let node2:TreeNode<{id:string}> = {
//     id:"1",
//     children:[
//         {id:"2"},
//         {id:"3"}
//     ] 
// }
// let node3:TreeNode<{key:string},'key'> = {
//     key:"1",
//     children:[
//         {key:"2"},
//         {key:"3"}
//     ] 
// }
// let node4:TreeNode<{key:string},'key','folder'> = {
//     key:"ddd",
//     folder:[
//         {key:"2"},
//         {key:"3"}
//     ] 
// }


// let node5:TreeNode = {
//     id:"1",
//     x:1,
//     y:"a"
// }

// function test<T extends TreeNode = TreeNode>(node:T):T {  
//     node["x"]=1
//     node["children"]=[]
//     node["id"]="2"
//     node.a=1

//     node.children=[]
//     node.id=""     
//     return node
// }



// test({id:"1",a:"d"})
// test<TreeNode<{id:number,name:string,[key:string]:boolean | string | number}>>({id:1,name:"fdf",x:true,y:1,z:"ddd"})
// test<TreeNode<{id:string,age:number}>>({id:"",age:1})
// test<TreeNode<{id:string,a:string}>>({id:"2",a:"ds",children:[]})
// test<TreeNode<{id:'a' | 'b'}>>({id:'a'})
// test<TreeNode<{id:'a' | 'b'}>>({id:'b'})
// test<TreeNode<{id:'a' | 'b'}>>({id:'c'})
