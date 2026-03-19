/**
 * 表示 JavaScript 中的所有原始类型值。
 * 原始类型是 JavaScript 中最基础的数据类型，不是对象且没有方法。
 * 
 * 包含的类型：
 * - null
 * - undefined
 * - string
 * - number
 * - boolean
 * - symbol (ES6+)
 * - bigint (ES2020+)
 * 
 * @example
 * ```typescript
 * // 基本用法
 * function isPrimitive(value: unknown): value is Primitive {
 *   return (
 *     value === null ||
 *     typeof value !== 'object' && 
 *     typeof value !== 'function'
 *   );
 * }
 * 
 * // 类型守卫使用
 * const value: unknown = "hello";
 * if (isPrimitive(value)) {
 *   // 这里 value 的类型被缩小为 Primitive
 *   console.log(value.toUpperCase()); // 安全
 * }
 * 
 * // 实际应用场景
 * interface Config {
 *   id: string;
 *   settings: Record<string, Primitive>;
 * }
 * 
 * const config: Config = {
 *   id: "app-123",
 *   settings: {
 *     debug: true,
 *     version: "1.0.0",
 *     timeout: 5000,
 *     featureFlags: Symbol("flags")
 *   }
 * };
 * 
 * // 序列化函数
 * function serializePrimitives(obj: Record<string, Primitive>): string {
 *   return JSON.stringify(obj);
 * }
 * 
 * // 错误处理
 * function validateInput(input: unknown): Primitive {
 *   if (isPrimitive(input)) {
 *     return input;
 *   }
 *   throw new Error("Input must be a primitive value");
 * }
 * 
 * // 高级用法：排除对象类型
 * type NonObject<T> = T extends object ? never : T;
 * type StrictPrimitive = NonObject<Primitive>;
 * // 结果：所有原始类型（因为原始类型都不是对象）
 * ```
 */
export type Primitive =
	| null
	| undefined
	| string
	| number
	| boolean
	| symbol
	| bigint;