
import { Paths } from "type-fest"

export type ObjectKeyPaths<T> =Exclude<Paths<T,{maxRecursionDepth:30}>,number>







/**
 *  提取对象的键路径类型
 * 
 
const obj = {
    a: {
        b: {
            b1: '1',
            b2: '1',
            b3: 1,
            b4:{
              b41:1,b42:2,b43:[1,2]
            }
        },
        e: 1,
        y:1
    },
    f: 1,
    e:8,
    y:'',
    z:[],
    d1:()=>{},
    d2:new Set(),
    d3:new Map(),
    d4: Symbol()
} 

type paths = ObjectPath<ObjType>
// ===>
type paths = "a" | "f" | "e" | "y" | "z" | "d1" | "d2" | "d3" | "d4" 
| "a.b" | "a.b.b1" | "a.b.b2" | "a.b.b3" | "a.b.b4" | "a.b.b4.b41" | "a.b.b4.b42" 
| "a.b.b4.b43" | "a.e" | "a.y"


*/ 

// const obj = {
//   a: {
//         b: {
//             b1: '1',
//             b2: '1',
//             b3: 1,
//             b4:{
//               b41:1,b42:2,b43:[1,2],
//               b44:{
//                 b441:{
//                   b4411:{
//                     b44111:1,
//                     b44112:2
//                   }
//                 }
//               }
//             }
//         },
//         e: 1,
//         y:1
//     },
//     f: 1,
//     e:8,
//     y:'',
//     z:[],
//     d1:()=>{}, 
//   users:[
//     {name:'c',age:3},
//     { 
//       name:'c',age:5,x:1,
//       c:{x:1}
//     }
//   ],
    
// }




// type paths = ObjectPaths<typeof obj>

// const p:paths = "users.0.name"
// const p2:paths = "a.b.b4.b43.1"
// const p3:paths = "users.0.c.x"

