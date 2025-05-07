
import { Paths } from "type-fest"

/**
 * 获取对象所有可能的键路径（点分隔的字符串）。
 * 这个类型基于 type-fest 的 Paths 类型，但排除了数字索引（数组索引）。
 * 
 * @template T - 要提取路径的对象类型
 * @param options.maxRecursionDepth - 递归深度限制（默认为30）
 * 
 * @example
 * ```typescript
 * // 基本对象结构
 * interface User {
 *   id: number;
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *     coordinates: {
 *       lat: number;
 *       lng: number;
 *     };
 *   };
 *   orders: Array<{
 *     id: string;
 *     items: Array<{
 *       sku: string;
 *       quantity: number;
 *     }>;
 *   }>;
 * }
 * 
 * // 获取所有路径
 * type UserPaths = ObjectKeyPaths<User>;
 * // 结果：
 * // "id" | "name" | "address" | "address.street" | "address.city" 
 * // | "address.coordinates" | "address.coordinates.lat" | "address.coordinates.lng"
 * // | "orders" | "orders.id" | "orders.items" | "orders.items.sku" | "orders.items.quantity"
 * 
 * // 实际应用场景
 * function getValueByPath<T>(obj: T, path: ObjectKeyPaths<T>): unknown {
 *   return path.split('.').reduce((acc, key) => acc?.[key], obj);
 * }
 * 
 * const user: User = { ... };
 * 
 * // 类型安全的路径访问
 * const city = getValueByPath(user, "address.city");  // string
 * const lat = getValueByPath(user, "address.coordinates.lat");  // number
 * 
 * // 错误示例（类型检查会报错）
 * // const invalid1 = getValueByPath(user, "invalid.path");  // 错误
 * // const invalid2 = getValueByPath(user, "orders.0.items.1");  // 错误（排除了数字索引）
 * 
 * // 复杂嵌套结构
 * interface AppState {
 *   auth: {
 *     user?: {
 *       id: string;
 *       profile: {
 *         name: string;
 *         avatar: string;
 *       };
 *     };
 *     token?: string;
 *   };
 *   ui: {
 *     theme: 'light' | 'dark';
 *     loading: boolean;
 *   };
 * }
 * 
 * type AppStatePaths = ObjectKeyPaths<AppState>;
 * // 结果：
 * // "auth" | "auth.user" | "auth.user.id" | "auth.user.profile" 
 * // | "auth.user.profile.name" | "auth.user.profile.avatar" | "auth.token"
 * // | "ui" | "ui.theme" | "ui.loading"
 * 
 * // 用于表单验证
 * function validateField(state: AppState, field: AppStatePaths): boolean {
 *   const value = getValueByPath(state, field);
 *   // 验证逻辑...
 *   return true;
 * }
 * ```
 */


export type ChangePathDelimiter<
  T extends string,
  D extends string = "/",
  S extends string = '.'
> = T extends `${infer Head}${S}${infer Tail}`
  ? `${Head}${D}${ChangePathDelimiter<Tail, D>}`
  : T;

export type ObjectKeyPaths<T extends object,Delimiter extends string = '.'> 
    = ChangePathDelimiter<Exclude<Paths<T, { maxRecursionDepth: 30 }>, number>,Delimiter>

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


  