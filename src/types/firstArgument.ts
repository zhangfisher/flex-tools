


// 提取函数的第1个参数
export type FirstArgument<T extends (...args:any[])=>any> = Parameters<T>[0]