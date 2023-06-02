
// 提取数组成员的类型
export type ArrayMember<T> = T extends (infer T)[] ? T : never