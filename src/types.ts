export type Class = new (...args: any[]) => any

// 提取数组成员的类型
export type ArrayMember<T> = T extends (infer T)[] ? T : never

export type AsyncFunction = (...args: any[]) => Awaited<Promise<any>>;
// 提取函数的第1个参数
export type FirstArgument<T> = T extends (...args: any) => any ? Parameters<T>[0] : any;
// 提取函数的第2个参数
export type SecondArgument<T> = T extends (...args: any) => any ? Parameters<T>[1] : any;
// 提取函数的返回值类型
export type ReturnValueType<T> = T extends (...args: any) => any ? ReturnType<T> : any;

// 允许为空
export type AllowEmpty<T> = T | null | undefined
// 构造类
export type Constructor = { new (...args: any[]): any };

// 装饰器
export type TypedClassDecorator<T> = <T extends Constructor>(target: T) => T | void; 

// 指定返回类型的函数
export type WithReturnFunction<T> = (...args: any)=>T

// 实现某个指定的类接口
export type ImplementOf<T> = new (...args: any) => T

/**
 * 用来更名接口中的的类型
 */
export type Rename<T,NameMaps extends Partial<Record<keyof T,any>>> = {
    [K in keyof NameMaps as NameMaps[K] ]:K extends keyof T ? T[K] : never
} & Omit<T,keyof NameMaps>

  
// 文件大小
export type FileSize = number | `${number}${
    'B' | 'Byte' | 'b' | 'Bytes' 
    | 'K' | 'KB' | 'k' | 'kb' 
    | 'M' | 'MB' | 'm' | 'mb'
    | 'G' | 'GB' | 'g' | 'gb'
    | 'T' | 'TB' | 't' | 'tb' 
    | 'P' | 'PB' | 'p' | 'pb' 
    | 'E' | 'EB' | 'e' | 'eb'
}`

// 时间间隔
export type TimeDuration = number | `${number}` | `${number}${
    'ms' | 's' | 'm' | 'h'              // 毫秒/秒/分钟/小时/
    | 'Milliseconds' | 'Seconds' | 'Minutes' |'Hours' 
    | 'd' | 'D' | 'W' | 'w' | 'M' | 'Y' | 'y'                // 天/周/月/年
    | 'Days' | 'Weeks' |'Months' | 'Years'
}`
