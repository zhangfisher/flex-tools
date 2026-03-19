export type FirstLower<T extends string> = T extends `${infer F}${infer R}`
    ? `${Lowercase<F>}${R}`
    : T
