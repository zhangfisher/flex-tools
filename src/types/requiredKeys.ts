import { Expand } from "./Expand"

 

/**
 * 将对象类型中指定的属性设置为必选
 * @template T 原始对象类型
 * @template Keys 要设置为必选的属性键的联合类型
 * 
 * @description
 * 此工具类型接受一个对象类型 T 和其键的联合类型 Keys，
 * 返回一个新类型，其中指定的 Keys 对应的属性变为必选，
 * 其他属性保持原样。
 * 
 * @example
 * ```ts
 * interface Person {
 *   name?: string;
 *   age?: number;
 *   address?: string;
 * }
 * 
 * // 将'name'和'address'设为必选
 * type RequiredPerson = RequiredKeys<Person, 'name' | 'address'>;
 * // 等同于:
 * // {
 * //   name: string;
 * //   age?: number;
 * //   address: string;
 * // }
 * ```
 */
export type RequiredKeys<T extends object, Keys extends keyof T> = Expand<T & Required<Pick<T,Keys>>>
 
