export type Dict<T=any> = T extends (...args:any[])=>any ? never : Record<string,T>
