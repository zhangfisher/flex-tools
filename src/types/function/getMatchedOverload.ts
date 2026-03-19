/**
 * 获取匹配的重载并推断泛型参数
 * 根据实际传入的参数类型来实例化重载签名中的泛型参数
 *
 * 核心策略：
 * 1. 使用 TypeScript 的条件类型延迟实例化特性
 * 2. 通过 Args extends Parameters<F> 触发类型推断
 * 3. 返回带有实际参数类型的新函数签名
 *
 * @example
 * ```typescript
 * function emit<T extends "a" | "b">(msg: { type: T; payload: Events[T] }): void;
 * type Result = GetMatchingOverload<Overloads<typeof emit>, [{ type: "a"; payload: boolean }]>;
 * ```
 */
export type GetMatchedOverload<Overloads extends any[], Args extends any[]> = Overloads extends [
    infer First,
    ...infer Rest,
]
    ? First extends (...args: any) => infer R
        ? Args extends Parameters<First>
            ? (...args: Args) => R
            : GetMatchedOverload<Rest, Args>
        : GetMatchedOverload<Rest, Args>
    : never;
