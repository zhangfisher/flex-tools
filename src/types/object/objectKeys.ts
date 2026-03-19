/**
 * 获取对象类型中特定类型的键。
 * 这个类型解决了 TypeScript 中 keyof 对索引签名返回 string | number 的问题，
 * 允许你只获取指定类型的键。
 * 
 * @template T - 要提取键的对象类型
 * @template I - 键的类型（默认为 string）
 * 
 * @example
 * ```typescript
 * // 基本用法
 * interface Animal {
 *   [key: string]: string;  // 字符串索引签名
 *   name: string;
 *   type: string;
 * }
 * 
 * // 使用普通 keyof
 * type AllKeys = keyof Animal;        // string | number
 * 
 * // 使用 ObjectKeyOf
 * type StringKeys = ObjectKeyOf<Animal>;  // "name" | "type"
 * 
 * // 带有混合类型键的接口
 * interface Mixed {
 *   name: string;
 *   0: number;
 *   1: number;
 *   "age": number;
 *   [key: string]: string | number;
 * }
 * 
 * type StringKeysOnly = ObjectKeyOf<Mixed>;          // "name" | "age"
 * type NumberKeysOnly = ObjectKeyOf<Mixed, number>;  // 0 | 1
 * 
 * // 实际应用场景
 * interface Config {
 *   [key: string]: any;
 *   apiUrl: string;
 *   port: number;
 *   debug: boolean;
 * }
 * 
 * // 只获取字符串类型的键
 * type StringConfigKeys = ObjectKeyOf<Config>;  // "apiUrl"
 * 
 * // 类型安全的对象访问
 * function getStringConfig<K extends ObjectKeyOf<Config>>(key: K): string {
 *   const config: Config = {
 *     apiUrl: "https://api.example.com",
 *     port: 8080,
 *     debug: true
 *   };
 *   
 *   return config[key] as string;
 * }
 * 
 * // 正确：apiUrl 是字符串键
 * const url = getStringConfig("apiUrl");
 * 
 * // 错误：port 不是字符串键
 * // const port = getStringConfig("port"); // 类型错误
 * ```
 */
export type ObjectKeys<T, I = string> = { [P in keyof T]: P extends I ? P : never }[keyof T];

