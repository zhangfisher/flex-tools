import { Equal } from "./equal";

/**
 * 检查类型数组中是否包含某个特定类型
 *
 * 使用递归和深度相等检查（`Equal`）来判断类型 `U` 是否存在于元组类型 `T` 中。
 * 与 `U extends T[number]` 不同，这个工具类型会进行精确的类型匹配，
 * 不会因为类型的兼容性而产生误判。
 *
 * @template T extends any[] - 要检查的类型元组
 * @template U - 要查找的类型
 *
 * @returns {boolean} 如果 `U` 在 `T` 中则返回 `true`，否则返回 `false`
 *
 * @example
 * ```ts
 * // 基本用法
 * type Result1 = Includes<[1, 2, 3], 2>; // true
 * type Result2 = Includes<[1, 2, 3], 4>; // false
 *
 * // 与 extends 的区别
 * type Test1 = Includes<[{ a: 1 }], { a: 1 }>; // true
 * type Test2 = { a: 1 } extends [{ a: 1 }][number] ? true : false; // false (因为对象字面量类型的特殊性)
 *
 * // 联合类型检查
 * type Result3 = Includes<[string | number, boolean], string>; // false (string | number 不等于 string)
 * type Result4 = Includes<[string, number, boolean], string>; // true
 * ```
 */
export type Includes<T extends any[], U> = T extends [infer First, ...infer Rest]
    ? Equal<First, U> extends true
        ? true
        : Includes<Rest, U>
    : false;
