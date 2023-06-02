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

import type { JsonObject } from "./JsonObject"

// 不支持 a.b.c[222]数组索引的形式
// type KeyPath<T extends Record<string, any>, P extends string = ''> =(
//   {
//     [K in keyof T as (
//       (T[K] extends JsonObject 
//         ? ((keyof KeyPath<T[K],K extends string ? CutPrefix<P,K> : (K extends string ? `${P}.${K}` : never)>) | (K extends string ? CutPrefix<P,K> : never))
//         : (K extends string ? CutPrefix<P,K> : K)
//       ) 
//     ) ]: string
//   }
// )
type CutPrefix<P  extends string,K extends string> = P extends '' ? `${K}` : `${P}.${K}`
type Key<P extends string,K> = K extends string ? CutPrefix<P,K> : never

type KeyPath<T extends Record<string, any>, P extends string = ''> =(
  {
    [K in keyof T as (
      (T[K] extends JsonObject 
        ? (keyof KeyPath<T[K],K extends string ? CutPrefix<P,K> : (K extends string ? `${P}.${K}` : never)>) | Key<P,K>
        : (
            T[K] extends any[] ? (K extends string ? 
                `${CutPrefix<P,K>}[${number}]`: never
            ) | Key<P,K> 
            : Key<P,K> 
        )
      ) 
    ) ]: never
  }
)
export type ObjectPath<T extends Record<string, any>> = keyof KeyPath<T>

// const obj = {
//     a: {
//         b: {
//             b1: '1',
//             b2: '1',
//             b3: 1,
//             b4:{
//               b41:1,b42:2,b43:[1,2]
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
//     d2:new Set(),
//     d3:new Map(),
//     d4: Symbol()
// }




// type paths = ObjectPath<typeof obj>
