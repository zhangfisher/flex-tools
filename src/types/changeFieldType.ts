import { Expand } from "./Expand"

/**
 * 修改对象中指定字段的类型，保持其他字段不变。
 * 
 * @template Record - 要修改的对象类型
 * @template Name - 要修改的字段名称（必须是字符串类型）
 * @template Type - 字段的新类型（默认为 any）
 * 
 * @example
 * ```typescript
 * // 基本用法
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 * 
 * // 将 id 字段的类型从 number 改为 string
 * type UserWithStringId = ChangeFieldType<User, 'id', string>;
 * // 结果等同于：
 * // {
 * //   id: string;
 * //   name: string;
 * //   age: number;
 * // }
 * 
 * // 修改多个字段类型
 * type UserWithModifiedFields = ChangeFieldType<
 *   ChangeFieldType<User, 'id', string>,
 *   'age',
 *   string
 * >;
 * // 结果等同于：
 * // {
 * //   id: string;
 * //   name: string;
 * //   age: string;
 * // }
 * ```
 */
export type ChangeFieldType<Record, Name extends string, Type = any> = Expand<Omit<Record, Name> & {
    [K in Name]: Type
}>