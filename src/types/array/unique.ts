/**
 * 从类型数组中移除重复项，返回保留唯一类型的元组
 * @template T - 输入的任意类型数组（元组）
 * @template Result - 内部使用的累积结果数组（默认空数组）
 * @returns {any[]} 去重后的类型元组，保留首次出现的顺序
 * 
 * @example
 * type T1 = Unique<[number, string, number]>;  // [number, string]
 * type T2 = Unique<[1, 2, 2, 3]>;              // [1, 2, 3]
 * type T3 = Unique<['a', 'b', 'a']>;           // ['a', 'b']
 */
export type Unique<T extends any[], Result extends any[] = []> = 
    T extends [infer First, ...infer Rest]
        ? First extends Result[number]
            ? Unique<Rest, Result>
            : Unique<Rest, [...Result, First]>
        : Result;
