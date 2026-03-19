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
export type DeepRequired<T> =  T extends (...args: any[]) => any
    ? T  // 函数类型保持不变
    : T extends Map<infer K, infer V>
    ? Map<DeepRequired<K>, DeepRequired<V>>  // 处理Map
    : T extends Set<infer U>
    ? Set<DeepRequired<U>>  // 处理Set
    : T extends ReadonlyArray<infer U>
    ? T extends readonly [infer First, ...infer Rest]
        ? readonly [DeepRequired<First>, ...DeepRequired<Rest>]  // 处理元组
        : ReadonlyArray<DeepRequired<U>>  // 处理数组
    : T extends object
    ? {
        [P in keyof T]-?: DeepRequired<T[P]>;
        }
    : NonNullable<T>;



    // type Example = {
    //     a?: string;
    //     b?: {
    //       c?: number;
    //       d?: {
    //         e?: boolean;
    //       };
    //     };
    //     f?: string[];
    //     g?: [number?, boolean?];
    //     h?: Map<string, { value?: number }>;
    //     i?: Set<{ id?: string }>;
    //     j?: () => void;
    //   };
      