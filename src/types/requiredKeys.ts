 

/**
 * 
 * 用于获取对象 T 中指定的属性键 Keys，并将这些键对应的属性设置为必选
 * 
 * @example
 * 假设有一个接口 Person {
 *   name?: string;
 *   age?: number;
 * }
 * 我们想要创建一个新的类型，其中 name 属性是必选的：
 * type PersonWithRequiredName = RequiredKeys<Person, 'name'>;
 * 这将创建一个新的类型，等同于：
 * type PersonWithRequiredName = {
 *   name: string;
 *   age?: number;
 * }
 * 
 * @param T 必须是一个对象类型
 * @param keys 必须是 T 的键的联合类型
 * 
 */
export type RequiredKeys<T extends object, Keys extends keyof T> = T & Required<Pick<T,Keys>>
 

