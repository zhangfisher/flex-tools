import { test,expect} from "vitest"
import { forEachTree, mapTree } from "../src"
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
        paths.push(path.join("/"))
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
    expect(mapedTree.key).toBe(1)
    expect(mapedTree.name).toBe("A")
    expect(mapedTree.path).toBe("A")

})



