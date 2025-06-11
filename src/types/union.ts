
/**
 * 将复杂的类型展开为扁平的对象类型，使其更易读和理解。
 * 主要用于处理交叉类型（&）和条件类型的展开。
 * 
 * @template T - 需要展开的类型
 * 
 * @example
 * ```typescript
 * // 展开交叉类型
 * type A = { a: string };
 * type B = { b: number };
 * type AB = A & B;
 * type ExpandedAB = Union<AB>;
 * // 结果：{ a: string; b: number }
 * 
 * // 展开嵌套的交叉类型
 * type C = { c: boolean };
 * type Complex = AB & C & { d: Date };
 * type ExpandedComplex = Union<Complex>;
 * // 结果：{ a: string; b: number; c: boolean; d: Date }
 * 
 * // 展开条件类型
 * type ConditionalType<T> = T extends string
 *   ? { type: "string"; value: string }
 *   : { type: "other"; value: unknown };
 * 
 * type StringCase = Union<ConditionalType<string>>;
 * // 结果：{ type: "string"; value: string }
 * 
 * // 展开带有可选属性的类型
 * type WithOptional = {
 *   required: string;
 *   optional?: number;
 * } & {
 *   another?: boolean;
 * };
 * 
 * type ExpandedOptional = Union<WithOptional>;
 * // 结果：{
 * //   required: string;
 * //   optional?: number;
 * //   another?: boolean;
 * // }
 * ```
 */
export type Union<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;