/**
 * 深度必填类型转换工具
 * 
 * 将类型T及其所有嵌套属性（包括数组元素和对象属性）转换为必填（Required）类型
 * 
 * @template T - 需要转换的原始类型
 * 
 * @example
 * // 转换嵌套可选类型为必填
 * type Example = {
 *   a?: {
 *     b?: number;
 *   };
 *   c?: string[];
 * };
 * 
 * type RequiredExample = DeepRequired<Example>;
 * // 结果类型：
 * // {
 * //   a: {
 * //     b: number;
 * //   };
 * //   c: string[];
 * // }
 * 
 * @example
 * // 处理数组类型
 * type ArrayExample = Array<{ id?: number }>;
 * type RequiredArray = DeepRequired<ArrayExample>; // 结果为Array<{ id: number }>
 */
export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
} 