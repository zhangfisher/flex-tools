
// 提取函数的最后一个参数 

export type LastArgument<T> = T extends (...args:infer Args) => any ? (Args extends [...infer _,infer L] ? L :never) : never
