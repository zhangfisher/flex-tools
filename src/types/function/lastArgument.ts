
/**
 * 提取函数类型的最后一个参数的类型。
 * 如果传入的类型不是函数，或者函数没有参数，则返回 never。
 * 
 * @template T - 要提取最后一个参数类型的函数类型
 * 
 * @example
 * ```typescript
 * // 基本函数
 * function greet(name: string, age: number, isAdmin: boolean) {
 *   // 函数实现
 * }
 * type LastParam = LastArgument<typeof greet>; // boolean
 * 
 * // 箭头函数
 * const calculate = (x: number, y: number, op: '+' | '-') => {};
 * type Operation = LastArgument<typeof calculate>; // '+' | '-'
 * 
 * // 可变参数函数
 * function sum(...numbers: number[]): number {
 *   return numbers.reduce((a, b) => a + b, 0);
 * }
 * type LastNumber = LastArgument<typeof sum>; // number[]
 * 
 * // 回调函数
 * interface EventHandler {
 *   (event: string, data: any, callback: () => void): void;
 * }
 * type CallbackType = LastArgument<EventHandler>; // () => void
 * 
 * // 类方法
 * class API {
 *   request(url: string, method: 'GET' | 'POST', body?: object) {}
 * }
 * type LastRequestParam = LastArgument<API['request']>; // object | undefined
 * 
 * // 非函数类型返回 never
 * type Invalid = LastArgument<string>; // never
 * ```
 */
export type LastArgument<T> = T extends (...args: infer Args) => any 
    ? (Args extends [...infer _, infer L] ? L : never) 
    : never;