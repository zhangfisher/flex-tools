/**
 * 创建一个字典类型，键为字符串，值为指定类型（不允许为函数类型）。
 * 
 * @template T - 字典值的类型（默认为 any）。如果传入函数类型，将返回 never
 * 
 * @example
 * ```typescript
 * // 基本用法
 * type StringDict = Dict<string>;
 * const dict1: StringDict = {
 *   key1: "value1",
 *   key2: "value2"
 * };
 * 
 * // 使用复杂类型
 * interface User {
 *   name: string;
 *   age: number;
 * }
 * type UserDict = Dict<User>;
 * const dict2: UserDict = {
 *   user1: { name: "Alice", age: 25 },
 *   user2: { name: "Bob", age: 30 }
 * };
 * 
 * // 函数类型会返回 never
 * type FuncDict = Dict<() => void>; // never
 * 
 * // 默认为 any 类型
 * const dict3: Dict = {
 *   key1: "string",
 *   key2: 123,
 *   key3: true
 * };
 * ```
 */
export type Dict<T = any> = T extends (...args: any[]) => any ? never : Record<string, T>;