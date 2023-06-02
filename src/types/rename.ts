/**
 * 用来更名接口中的的类型
 */
 export type Rename<T,NameMaps extends Partial<Record<keyof T,any>>> = {
    [K in keyof NameMaps as NameMaps[K] ]:K extends keyof T ? T[K] : never
} & Omit<T,keyof NameMaps>

  
