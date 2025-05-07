
/**
 * 提取函数的第 n 个参数的类型。当索引为 -1 时，返回最后一个参数的类型。
 * 
 * @template T - 要提取参数类型的函数类型
 * @template index - 要提取的参数索引（从0开始），使用 -1 表示最后一个参数
 * 
 * @example
 * ```typescript
 * function greet(name: string, age: number, isAdmin: boolean) {
 *   // 函数实现
 * }
 * 
 * // 提取各个位置参数的类型
 * type FirstParam = Argument<typeof greet, 0>;   // string
 * type SecondParam = Argument<typeof greet, 1>;  // number
 * type ThirdParam = Argument<typeof greet, 2>;   // boolean
 * type LastParam = Argument<typeof greet, -1>;   // boolean
 * ```
 */

import { LastArgument } from "./lastArgument";


export type Argument<T extends (...args:any[])=>any,index extends number> = index extends -1 ? LastArgument<T> : Parameters<T>[index]