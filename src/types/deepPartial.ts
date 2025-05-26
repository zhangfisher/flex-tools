export type DeepPartial<T> =  T extends (...args: any[]) => any
? T
: T extends Map<infer K, infer V>
  ? Map<DeepPartial<K>, DeepPartial<V>>
: T extends Set<infer U>
  ? Set<DeepPartial<U>>
: T extends ReadonlyArray<infer U>
  ? T extends readonly [infer First, ...infer Rest]
    ? readonly [DeepPartial<First>?, ...DeepPartial<Rest>]
    : ReadonlyArray<DeepPartial<U>>
: T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    } & (T extends { [key: string]: infer V } 
      ? { [key: string]: DeepPartial<V> } 
      : {})
: T;
export type DeepOptional<T> = DeepPartial<T> 
 