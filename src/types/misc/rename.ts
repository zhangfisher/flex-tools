import { Union } from "./union"

/**
 * 重命名类型中的属性
 * @template T 原始类型
 * @template NameMaps 属性映射对象，键为原始属性名，值为新属性名
 * 
 * @example
 * // 重命名示例
 * interface Person {
 *   name: string;
 *   age: number;
 * }
 * 
 * type RenamedPerson = Rename<Person, { age: 'years' }>;
 * // 等同于 { name: string; years: number }
 */
export type Rename<T, NameMaps extends Partial<Record<keyof T, any>>> = Union<{
    [K in keyof NameMaps as NameMaps[K] ]:K extends keyof T ? T[K] : never
} & Omit<T,keyof NameMaps>>

  