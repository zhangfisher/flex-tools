import { Constructor } from "./constructor";

// 装饰器
export type TypedClassDecorator<T> = <T extends Constructor>(target: T) => T | void; 


