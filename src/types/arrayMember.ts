
/**
 * 提取数组成员的类型。如果传入的类型不是数组，则返回 never。
 * 
 * @template T - 要提取成员类型的数组类型
 * @example
 * ```typescript
 * // 基本类型数组
 * type NumberArray = number[];
 * type NumberType = ArrayMember<NumberArray>;  // number
 * 
 * // 对象数组
 * type User = { id: number; name: string };
 * type Users = User[];
 * type UserType = ArrayMember<Users>;  // { id: number; name: string }
 * 
 * // 联合类型数组
 * type MixedArray = (string | number)[];
 * type MixedType = ArrayMember<MixedArray>;  // string | number
 * 
 * // 非数组类型
 * type NotArray = string;
 * type Result = ArrayMember<NotArray>;  // never
 * ```
 */
export type ArrayMember<T> = T extends (infer T)[] ? T : never