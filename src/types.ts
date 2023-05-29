
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

// 改变成员类型
export type ChangeFieldType<Record,Name extends string,Type=any> = Omit<Record,Name> & {
    [K in Name]:Type
}
  

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


/**
 * 可变记录,其类型由是type字段推断的
 * 
 * type Animal = MutableRecord<{
 *    dog:{bark:boolean,wagging:boolean},
 *    cat:{mew:number},
 *    chicken:{egg:number}      
 * }>
 * 
 * let animals:Animal = {
 *      type:"dog",
 *      bark:true,
 *      wagging:true
 * }
 * let animals:Animal = {
 *      type:"cat",
 *      mew:23
 * }
 * 
 */
export type MutableRecord<Items,KindKey extends string='type'> = {
    [ Kind in keyof Items]: {
        [type in KindKey]: Kind;
    } & Items[Kind]
}[keyof Items]


/**
 * 可变记录数组,其类型由是type字段推断的
 * 
 * type Animal = MutableRecordList<{
 *    dog:{bark:boolean,wagging:boolean},
 *    cat:{mew:number},
 *    chicken:{egg:number}      
 * }>
 * 
 * let animals:Animal = [
 * {
 *      type:"dog",
 *      bark:true,
 *      wagging:true
 * },
 *  {
 *      type:"cat",
 *      mew:23
 * }
 * ]
 * 
 */
export type MutableRecordList<Items,KindKey extends string='type'> = {
    [ Kind in keyof Items]: {
        [type in KindKey]: Kind;
    } & Items[Kind]
}[keyof Items][]


export type Collection<T=any> = Record<string|number|symbol,T> | T[] | Set<T> | Map<string,T>  

 
/**
 * 合并输入的多个类型
 * type Foo = { a: number};
type Bar = { b: string };
type Baz = { c: boolean };

type Merged = Merge<[Foo, Bar, Baz]>;

返回 { a: string; b: number; c: boolean; } ，它包含了输入数组中所有类型的属性。
 */
export type Merge<T extends any[]> =  T extends [infer I, ...infer rest] ?  I & Merge<rest> : {}

  


declare global {
    interface String {
        params(vars:Record<string,any> | any[] | Set<any> | Map<string,any>): string;
        params(...vars: any[]): string; 
        replaceAll(searchValue: string | RegExp, replaceValue: string): string;
    }
}



