/**
 * 修改函数的返回类型，保持参数类型不变。
 * 
 * @template T - 要修改的函数类型（必须是一个函数）
 * @template R - 新的返回类型
 * 
 * @example
 * ```typescript
 * // 原始函数类型
 * function getData(): number {
 *   return 42;
 * }
 * 
 * // 修改返回类型为字符串
 * type StringReturn = ChangeReturns<typeof getData, string>;
 * // 等同于 () => string
 * 
 * // 使用带参数的函数
 * function add(a: number, b: number): number {
 *   return a + b;
 * }
 * 
 * // 修改返回类型为布尔值
 * type BooleanReturn = ChangeReturns<typeof add, boolean>;
 * // 等同于 (a: number, b: number) => boolean
 * 
 * // 实际使用示例
 * const convertToString: ChangeReturns<typeof add, string> = (a, b) => {
 *   return `${a + b}`;
 * };
 * ```
 */
export type ChangeReturns<T extends (...args: any[]) => any, R> = (...args: Parameters<T>) => R;