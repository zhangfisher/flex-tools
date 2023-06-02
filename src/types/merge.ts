 
/**
 * 合并输入的多个类型
 * type Foo = { a: number};
type Bar = { b: string };
type Baz = { c: boolean };

type Merged = Merge<[Foo, Bar, Baz]>;

返回 { a: string; b: number; c: boolean; } ，它包含了输入数组中所有类型的属性。
 */
export type Merge<T extends any[]> =  T extends [infer I, ...infer rest] ?  I & Merge<rest> : {}

  
