/**
 * 改变函数的返回类型
 */
export type ChangeReturns<T extends (...args: any[]) => any, R> = (...args: Parameters<T>) => R;
