// 检查 Args 是否匹配任何一个重载
export type IsMatchingOverload<Overloads extends any[], Args extends any[]> = Overloads extends [
    infer First,
    ...infer Rest,
]
    ? First extends (...args: any) => any
        ? Args extends Parameters<First>
            ? true
            : IsMatchingOverload<Rest, Args>
        : never
    : false;
