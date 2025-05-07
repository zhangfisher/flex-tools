/**
 * 获取函数的所有重载类型，返回一个包含所有重载签名的联合类型。
 * 这个类型解决了 TypeScript 中 `typeof` 操作符只能获取第一个重载签名的问题。
 * 
 * @template T - 要获取重载的函数类型
 * 
 * @example
 * ```typescript
 * // 基本用法
 * function parseInput(input: string): string;
 * function parseInput(input: number): number;
 * function parseInput(input: boolean): boolean;
 * function parseInput(input: any): any {
 *   // 实现
 * }
 * 
 * // 使用 typeof 只能获取第一个重载
 * type FirstOverload = typeof parseInput;  // (input: string) => string
 * 
 * // 使用 Overloads 获取所有重载
 * type AllOverloads = Overloads<typeof parseInput>;
 * // 结果：
 * // ((input: string) => string) | 
 * // ((input: number) => number) | 
 * // ((input: boolean) => boolean) | 
 * // ((input: any) => any)
 * 
 * // 实际应用场景
 * interface StringOrNumber {
 *   (value: string): string;
 *   (value: number): number;
 * }
 * 
 * const fn: StringOrNumber = (value: any) => value;
 * 
 * type FnOverloads = Overloads<typeof fn>;
 * // 结果：
 * // ((value: string) => string) | ((value: number) => number)
 * 
 * // 高级用法：创建类型安全的调用函数
 * function callWithOverloads<T extends (...args: any[]) => any>(
 *   fn: T,
 *   ...args: Parameters<Overloads<T>>
 * ): ReturnType<Overloads<T>> {
 *   return fn(...args);
 * }
 * 
 * // 可以安全地调用所有重载
 * const result1 = callWithOverloads(parseInput, "hello");  // string
 * const result2 = callWithOverloads(parseInput, 42);      // number
 * const result3 = callWithOverloads(parseInput, true);     // boolean
 * 
 * // 内置方法示例
 * type ParseIntOverloads = Overloads<typeof parseInt>;
 * // 结果：
 * // ((string: string, radix?: number) => number) | 
 * // ((string: string) => number)
 * 
 * // 类方法重载
 * class Calculator {
 *   add(x: number, y: number): number;
 *   add(x: string, y: string): string;
 *   add(x: any, y: any): any {
 *     return x + y;
 *   }
 * }
 * 
 * type AddOverloads = Overloads<Calculator['add']>;
 * // 结果：
 * // ((x: number, y: number) => number) | 
 * // ((x: string, y: string) => string)
 * 
 * // 实用工具类型
 * type OverloadParameters<T> = Parameters<Overloads<T>>;
 * type OverloadReturnType<T> = ReturnType<Overloads<T>>;
 * ```
 */

import { Unique } from "./Unique";


export type Overloads<T> =Unique<
T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; 
    (...args: infer A4): infer R4
    (...args: infer A5): infer R5;
    (...args: infer A6): infer R6
    (...args: infer A7): infer R7;
    (...args: infer A8): infer R8
  } ?
  [(...args: A1) => R1 , ((...args: A2) => R2) , ((...args: A3) => R3) , ((...args: A4) => R4) , ((...args: A5) => R5) , ((...args: A6) => R6) , ((...args: A7) => R7) , ((...args: A8) => R8)] :
T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; 
    (...args: infer A4): infer R4
    (...args: infer A5): infer R5;
    (...args: infer A6): infer R6
    (...args: infer A7): infer R7
  } ?
  [(...args: A1) => R1 , ((...args: A2) => R2) , ((...args: A3) => R3) , ((...args: A4) => R4) , ((...args: A5) => R5) , ((...args: A6) => R6) , ((...args: A7) => R7)]:  
  T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; 
    (...args: infer A4): infer R4
    (...args: infer A5): infer R5;
    (...args: infer A6): infer R6
  } ?
  [(...args: A1) => R1 , ((...args: A2) => R2) , ((...args: A3) => R3) , ((...args: A4) => R4) , ((...args: A5) => R5) , ((...args: A6) => R6)]:  
    T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; 
    (...args: infer A4): infer R4
    (...args: infer A5): infer R5
  } ?
  [(...args: A1) => R1 , ((...args: A2) => R2) , ((...args: A3) => R3) , ((...args: A4) => R4) , ((...args: A5) => R5)]:
  T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; 
    (...args: infer A4): infer R4
  } ?
  [(...args: A1) => R1 , ((...args: A2) => R2) , ((...args: A3) => R3) , ((...args: A4) => R4) ]:
  T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3
  } ?
  [((...args: A1) => R1) , ((...args: A2) => R2) , ((...args: A3) => R3) ]:
  T extends {
    (...args: infer A1): infer R1; 
    (...args: infer A2): infer R2
  } ?
  [((...args: A1) => R1) , ((...args: A2) => R2) ]:
  T extends {
    (...args: infer A1): infer R1
  } ?
  [(...args: A1) => R1] :
  [T]
>

// function foo(a: string): string;
// function foo(a: number): number;
// function foo(a: any): any {}


// type d = Unique<Overloads<typeof foo>> 
// type Unique<T extends any[], Result extends any[] = []> = 
//     T extends [infer First, ...infer Rest]
//         ? First extends Result[number]
//             ? Unique<Rest, Result>
//             : Unique<Rest, [...Result, First]>
//         : Result;

