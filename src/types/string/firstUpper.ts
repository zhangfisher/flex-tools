export type FirstUpper<T extends string> = T extends `${infer F}${infer R}`
    ? `${Uppercase<F>}${R}`
    : T
