
# 树工具

树数据结构是非常常见的，比较常见的有两种数据结构来表示树。

- **引入方式**

```typescript
import { <函数名称> } from "flex-tools/tree"
```

- **数据结构**

```typescript
// 嵌套树结构
const tree = {
    id:1,
    name:"a",
    children:[
        {id:2,name:"b"},
        {id:3,name:"c"}
    ]
}
// pid树结构
const tree = [
    [id:1,pid:null,name:"a"],
    [id:2,pid:1,name:"b"],
    [id:3,pid:1,name:"c"],
]
```

**本函数功能集均统一采用`嵌套树结构`**

- **约定**

两种树结构各有优缺点,在实际项目均有应用,我们提供了一系工具函数来处理树结构。

为了提供统一的树操作体验，我们约定：

- 每一个树节点均具有唯一ID
- 每一个树节点均具有可选的`children`字段数组来用表示子节点
- 如果约定`id`、`children`字段名称不符合要求同，以下大部份的API均可以通过`options.idKey`和`options.childrenKey`来指定这两个核心字段的键名称。
- `id`、`children`字段也支持通过泛型指定字段名称.

## getById

通过节点Id返回节点数据

```typescript
getById<Node extends TreeNode = TreeNode,IdKey extends string = "id">(treeObj:Node | Node[],nodeId:Node[IdKey],options?:GetByIdOptions):Node | null  
```

## getByPath

通过路径名称（如`a/b/c`）返回指定的节点对象。

```typescript
function getByPath<Node extends TreeNode = TreeNode>(treeObj:Node | Node[],fullpath: string,options?:GetByPathOptions):Node | undefined 
```

**示例**

```typescript
const tree = {
    id:1,
    name:"a",
    children:[
        {id:2,name:"b"},
        {id:3,name:"c"}
    ]
} 
// 指定路由采用name值进行组合
getByPath(treeData,"a/b",,{path:"name"})       
// 指定路径采用id值进行组合
getByPath(treeData,"1/2",{path:"id"})           
```

## forEachTree

采用深度优先(循环算法而非递归)的方法遍历树节点。

```typescript
forEachTreeByDfs<Node extends TreeNodeBase = TreeNode,Path=string>(
        treeData: Node[] | Node, 
        callback: IForEachTreeCallback<Node,Path>, 
        options?: ForEachTreeOptions) 
type IForEachTreeCallback<Node,Path=string> = ({ node, level, parent, path, index }: { node: Node, level: number, parent?: Node | null, path: Path[], index: number }) => any

```

**说明**

- 遍历过程中可以在`callback`中返回`ABORT`来中止遍历。
- `callback`提供四个参数，分别是`node=<当前节点>`,`level=<节点层级>`,`parent=<父节点>`,`path=<当前节点的路径>`,`index=<子节点序号>`}。
-  `startId`参数可以用来指定遍历起点。
- `IForEachTreeCallback`函数返回值可以用来指定遍历的路径，` { node: Node, level: number, parent?: Node | null, path: Path[], index: number }`如果返回`ABORT`则中止遍历。

## forEachTreeBfs

采用广度优先(循环算法而非递归)的方法遍历树节点，其他功能与`forEachTree`相同。

## forEachTreeByDfsRecursion

采用深度优先的方法遍历树节点，但是采用的是递归算法，其他功能与`forEachTree`相同。
一般情况下，不推荐使用该函数，因此在使用深度优先递归遍历树时无法做尾递归优化，所以当树深度较大时可能造成栈溢出。

## mapTree

转换树结构。

```typescript
function mapTree<FromNode extends TreeNodeBase = TreeNode,ToNode extends TreeNodeBase = FromNode>(treeData:FromNode[] | FromNode,mapper:ITreeNodeMapper<FromNode,ToNode>,options?:MapTreeOptions):ToNode[] | ToNode

type ITreeNodeMapper<FromNode,ToNode> = ({node,parent,level,path,index}:{node:FromNode,parent:FromNode | null,level:number,path:any[],index:number})=>ToNode

interface MapTreeOptions extends TreeNodeOptions{
    path?:(node:Node)=>any
    from?:{
        idKey?:string,childrenKey?:string
    }
    to?:{
        idKey?:string,childrenKey?:string
    }
}
```

**示例**

```typescript
    type mapedBook = TreeNode<{ key: string; name: string; level: number; path: string},'key','books'>
    let mapedTree = mapTree<Book,mapedBook >(
        Object.assign({}, books),
        ({ node, level, parent, path }) => {
            return {
                key:String(node.id),
                name: node.title,
                level: level,
                path: path.join("/")
            }
        }, { 
            path: "title",
            to:{
                idKey:'key',childrenKey:"books"
            } 
        }) as mapedBook

```

## searchTree

遍历树的每一个节点，执行`mather({node,level,parent,path,index})`，如果返回`true`，则调用`picker({node,level,parent,path,index})`函数返回结果

```typescript
function searchTree<Node extends TreeNode=TreeNode,Returns=Node[]>(treeData:Node[] | Node,matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions):Returns[]
interface SerachTreeOptions extends TreeNodeOptions,ForEachTreeOptions {
    matchOne?:boolean               //   只匹配一个就退出搜索
}
```

## removeTreeNodes

删除满足条件的节点

```typescript
function removeTreeNodes<Node extends TreeNode>(treeObj:Node | Node[],matcher:IForEachTreeCallback<Node>,options?:RemoveTreeNodes):void  
```

**说明**

- 当`mather`函数返回`true`时，删除该节点。
- 当`mather`函数返回`ABORT`时，中止遍历过程。

## toPidTree

将嵌套树结构转换为PID结构。

```typescript
function toPidTree<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
>(treeObj:FromNode | FromNode[],options?:ToPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):PidTreeNode<Omit<ToNode,ChildrenKey>,IdKey>[]

interface ToPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{
     includeLevel?: boolean
     includePath?: boolean
     mapper?:({node,level,parent,path,index}:{node:FromNode,level:number,parent:FromNode | null,path:string,index:number}) => Omit<ToNode,ChildrenKey | IdKey>
 }
```
**说明**

-  转换时可选指定`mapper`函数，用来返回新的节点数据
- 当`includePath=true`时，在目标节点中包括path节点路径
- 当`includeLevel=true`时，在目标节点中包括节点层级


**示例**

```typescript
    // 节点数据结构一致
    let nodes = toPidTree<Book>(books,{includePath:true})    
    
    // 转换为不同的数据结构
    type StoryBook = TreeNode<{
        name: string,
        publisher: string,
    }>    
    let storyNodes = toPidTree<Book,StoryBook>(books,{
        includePath:true,
        mapper:({node,level})=>{
            return {               
                name:node.title,
                publisher:`MEEYI ${level}` 
            }
        }
    })
```

## fromPidTree

将PID树结构转换为嵌套树结构。

```typescript
function fromPidTree<
    FromNode extends PidTreeNode = PidTreeNode,
    ToNode extends TreeNode = TreeNode<Omit<FromNode,'pid'>>,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
    >(pidNodes:FromNode[],options?:FromPidTreeOptions<FromNode,ToNode,IdKey,ChildrenKey>):ToNode[]   

interface FromPidTreeOptions<
    FromNode extends TreeNodeBase = TreeNode,
    ToNode extends TreeNodeBase = FromNode,
    IdKey extends string = 'id',
    ChildrenKey extends string = 'children'
> extends TreeNodeOptions{ 
     mapper?:(node:FromNode) => ToNode
 }
```

**说明**:
- 默认情况下转换为保持原节点的所有数据
- 可以通过`mapper`函数来返回新的节点数据.

## getTreeNodeInfo

获取节点基本信息，包括节点数据、父节点、路径、层级、和子节点序号。

```typescript
interface TreeNodeInfo<Node>{
    node:Node
    parent:Node | undefined | null
    path:string
    level:number
    index:number
}
export function getTreeNodeInfo<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetTreeNodeInfoOptions):TreeNodeInfo<Node> | undefined 
```


## getTreeNodeRelation

返回两个节点之间的关系。

```typescript
enum TreeNodeRelation{
    Same = 0,                               // 相同节点
    Child = 1,                              // 子节点
    Parent = 2,                             // 父节点     
    Descendants = 3,                        // 后代    
    Ancestors = 4,                          // 祖先
    Sibling = 5,                            // 兄弟节点    
    Unknown = 9                             // 未知
}
export function getTreeNodeRelation<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId:Node[IdKey],refNodeId:Node[IdKey],options?:GetTreeNodeRelationOptions):TreeNodeRelation
   
```
## moveTreeNode

移动节点到新的位置。

```typescript
enum MoveTreeNodePosition{
    LastChild = 0,                           // 移动为目标节点的最后一个子节点
    FirstChild = 1,                          //
    Next= 2,                                 //  下一个兄弟节点
    Previous = 3                             // 上一个兄弟
}

function moveTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],fromNodeId: Node[IdKey],toNodeId:Node[IdKey],pos:MoveTreeNodePosition=MoveTreeNodePosition.LastChild, options?:MoveTreeNodeOptions):void   
```

## getRelatedTreeNode

获取指定节点的关联节点。

```typescript
enum RelatedTreeNode{
    Parent = 1,
    Next = 2,
    Previous = 3 
}
function getRelatedTreeNode<Node extends TreeNode = TreeNode,IdKey extends string = 'id' 
>(treeObj: Node | Node[],nodeId:Node[IdKey],pos:RelatedTreeNode , options?:GetRelatedTreeNodeOptions):Node | null   
```
## getAncestors

获取节点的所有祖节点.

```typescript    
export interface GetAncestorsOptions extends TreeNodeOptions{
        includeSelf?:boolean            //  返回结果是否包含自身节点
    }
export function getAncestors<Node extends TreeNodeBase = TreeNode,IdKey extends string = 'id'>(treeObj:Node | Node[],nodeId: Node[IdKey],options?:GetAncestorsOptions):Node[] 

    let nodes = getAncestors<Book>(books,1563) 
    let nodes = getAncestors<Book>(books,1563,{includeSelf:true}) 
```

## FlexTree

`FlexTree`是一个树结构类

```typescript

class FlexTree{
    constructor(nodes:Node[] | Node,options:FlexTreeOptions<Node,IdKey>)
    get root(): Node | undefined
    get nodes(): Node[]
    getNode(nodeId:Node[IdKey]):Node | null
    addNode(nodeData: Partial<Node> ,refNodeId:Node[IdKey],pos:MoveTreeNodePosition = MoveTreeNodePosition.LastChild):Node 
    removeNode(nodeId:Node[IdKey]):void 
    moveNode(nodeId: Node[IdKey],refNodeId:Node[IdKey],pos:MoveTreeNodePosition)
    search(matcher:IForEachTreeCallback<Node>,picker?:IForEachTreeCallback<Node>,options?:SerachTreeOptions)
}

// 遍历节点
let tree = new FlexTree({
    id:1,
    title:"a",
    children: [
        {id:2},
        {id:3}
    ]
})
for(let node of nodes){
    console.log(node)
}

```

