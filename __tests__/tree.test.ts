import { test,expect} from "vitest"
import { FlexTree, forEachTree, mapTree } from "../src"
import { fromPidTree } from "../src/tree/fromPidTree"
import { getRelatedTreeNode, RelatedTreeNode } from "../src/tree/getRelatedTreeNode"
import { getTreeNodeRelation, TreeNodeRelation } from "../src/tree/getTreeNodeRelation"
import { moveTreeNode, MoveTreeNodePosition } from "../src/tree/moveTreeNode"
import { toPidTree } from "../src/tree/toPidTree"
import { TreeNode } from "../src/tree/types"

// 共30个节点的数据，不要变更，后续用户例依赖此数据
type Book = {id:number, title:string}
const books = {
    id:1,
    title:"A",
    children: [
        {id:11,title:"A1"},
        {id:12,title:"A2",
            children:[
                {id:121,title:"A21"},
                {id:122,title:"A22"},
                {id:123,title:"A23"},
                {id:124,title:"A24",
                    children:[
                        {id:1241,title:"A241"},
                        {id:1242,title:"A242"},
                        {id:1243,title:"A243"},
                        {id:1244,title:"A244"},
                        {id:1245,title:"A245"},
                        {id:1246,title:"A246"}
                    ]
                },
                {id:125,title:"A25"},
                {id:126,title:"A26"}
            ]
        },
        {id:13,title:"A3"},
        {id:14,title:"A4"},
        {id:15,title:"A5",
            children:[
                {id:151,title:"A51"},
                {id:152,title:"A52"},
                {id:153,title:"A53"},
                {id:154,title:"A54"},
                {id:155,title:"A55"},
                {id:156,title:"A56",
                    children:[
                        {id:1561,title:"A1561"},
                        {id:1562,title:"A1562"},
                        {id:1563,title:"A1563"},
                        {id:1564,title:"A1564"},
                        {id:1565,title:"A1565"}
                    ]
                }
            ]
        },
        {id:16,title:"A6"}
    ]
} as TreeNode<Book>

  

test("遍历树",()=>{
    let ids = [],titles:string[] = [],paths:string[] = []
    forEachTree(books,({node,level,parent,path})=>{
        ids.push(node.id)
        titles.push(node.title)
        paths.push(path)
    },{pathKey:"title"})
    expect(ids.length).toBe(30)
    expect(titles.length).toBe(30)
})



test("映射树结构",()=>{ 
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
        }, { pathKey: "title",
            to:{
                idKey:'key',childrenKey:"books"
            } 
        }) as mapedBook
    expect(Object.keys(mapedTree).length).toBe(5)
    expect(mapedTree.key).toBe("1")
    expect(mapedTree.name).toBe("A")
    expect(mapedTree.path).toBe("A")

})

test("获取树节点关系",()=>{ 
    let R = getTreeNodeRelation<Book>(books,1,11)
    expect(R).toBe(TreeNodeRelation.Parent)
    R = getTreeNodeRelation<Book>(books,11,1)
    expect(R).toBe(TreeNodeRelation.Child)
    R = getTreeNodeRelation<Book>(books,1,2)
    expect(R).toBe(TreeNodeRelation.Unknown)
    R = getTreeNodeRelation<Book>(books,11,12)
    expect(R).toBe(TreeNodeRelation.Sibling)
    R = getTreeNodeRelation<Book>(books,12,11)
    expect(R).toBe(TreeNodeRelation.Sibling)
    R = getTreeNodeRelation<Book>(books,121,1)
    expect(R).toBe(TreeNodeRelation.Descendants)
    
    R = getTreeNodeRelation<Book>(books,121,1)
    expect(R).toBe(TreeNodeRelation.Descendants)

    R = getTreeNodeRelation<Book>(books,1564,1)
    expect(R).toBe(TreeNodeRelation.Descendants)

    R = getTreeNodeRelation<Book>(books,1563,1564)
    expect(R).toBe(TreeNodeRelation.Sibling)
    //
    R = getTreeNodeRelation<Book>(books,1241,1561)
    expect(R).toBe(TreeNodeRelation.Unknown)
 })


 test("移动树节点",()=>{ 

    // 121 -> 122.Children
    moveTreeNode<Book>(books,121,122)
    expect(getTreeNodeRelation(books,121,122)).toBe(TreeNodeRelation.Child)

    // 122 -> 15.Children
    moveTreeNode<Book>(books,122,15,MoveTreeNodePosition.FirstChild)
    expect(getTreeNodeRelation(books,122,15)).toBe(TreeNodeRelation.Child)

    //
    moveTreeNode<Book>(books,152,153,MoveTreeNodePosition.Next)
    expect(getTreeNodeRelation(books,152,153)).toBe(TreeNodeRelation.Sibling)

    moveTreeNode<Book>(books,153,152,MoveTreeNodePosition.Next)
    expect(getTreeNodeRelation(books,152,153)).toBe(TreeNodeRelation.Sibling)


    moveTreeNode<Book>(books,1561,1563,MoveTreeNodePosition.Previous)
    expect(getTreeNodeRelation(books,1561,1563)).toBe(TreeNodeRelation.Sibling)
 })


 test("转为pid树",()=>{ 

    let nodes = toPidTree<Book>(books,{includePath:true})
    expect(nodes.length).toBe(30)

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
    expect(storyNodes.length).toBe(30)
    let books2 = fromPidTree(storyNodes)
 })

 test("增加节点树",()=>{ 
    let tree = new FlexTree<Book>(books,{
        idGenerator:()=>Math.random() * 1000
    })

    tree.addNode({
        title:"RootNext"
    },1,MoveTreeNodePosition.Next)

    expect(Array.isArray(tree.nodes)).toBeTruthy()
    expect(tree.nodes.length).toBe(2)

    tree.addNode({
        title:"RootPrevious"
    },1,MoveTreeNodePosition.Previous)
    expect(tree.nodes.length).toBe(3)

    tree.addNode({
        title:"RootChild1"
    },1,MoveTreeNodePosition.LastChild)

    tree.addNode({
        title:"RootChild2"
    },1,MoveTreeNodePosition.FirstChild)




})

test("删除节点",()=>{ 
    let tree = new FlexTree<Book>(books)

    tree.removeNode(1)

    expect(tree.nodes.length).toBe(0)

})

test("遍历树节点",()=>{ 
    let tree = new FlexTree<Book>(books)
    let nodes =[]
    for(let node of tree){
        nodes.push(node)
    }    
    expect(nodes.length).toBe(30)
})


test("遍历删除所有节点",()=>{ 
    let tree = new FlexTree<Book>(books)
    for(let { node } of tree){
        tree.removeNode(node.id)
    }    
    expect(tree.nodes.length).toBe(0)
})