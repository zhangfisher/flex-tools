import { Union } from "./union";

 
/**
 * 将数组中的多个类型合并为一个交叉类型。
 * 这个类型工具可以将多个接口或类型合并为一个包含所有属性的新类型。
 * 
 * @template T - 要合并的类型数组
 * 
 * @example
 * ```typescript
 * // 基本用法
 * interface User {
 *   name: string;
 * }
 * 
 * interface UserAge {
 *   age: number;
 * }
 * 
 * interface UserEmail {
 *   email: string;
 * }
 * 
 * type FullUser = Merge<[User, UserAge, UserEmail]>;
 * // 结果：
 * // {
 * //   name: string;
 * //   age: number;
 * //   email: string;
 * // }
 * 
 * // 处理重叠属性
 * interface BaseConfig {
 *   debug: boolean;
 *   version: string;
 * }
 * 
 * interface DevConfig {
 *   debug: boolean;
 *   devTools: boolean;
 * }
 * 
 * interface ProdConfig {
 *   cache: boolean;
 * }
 * 
 * type Config = Merge<[BaseConfig, DevConfig, ProdConfig]>;
 * // 结果：
 * // {
 * //   debug: boolean;    // 来自 DevConfig（后面的覆盖前面的）
 * //   version: string;
 * //   devTools: boolean;
 * //   cache: boolean;
 * // }
 * 
 * // 实际应用场景
 * interface Theme {
 *   primary: string;
 *   secondary: string;
 * }
 * 
 * interface ThemeExtension {
 *   success: string;
 *   error: string;
 * }
 * 
 * interface CustomTheme {
 *   custom: string;
 * }
 * 
 * // 创建完整的主题类型
 * type FullTheme = Merge<[Theme, ThemeExtension, CustomTheme]>;
 * 
 * const theme: FullTheme = {
 *   primary: '#007bff',
 *   secondary: '#6c757d',
 *   success: '#28a745',
 *   error: '#dc3545',
 *   custom: '#ff4081'
 * };
 * ```
 */
export type Merge<T extends any[]> = Union<T extends [infer I, ...infer rest] ? I & Merge<rest> : {}>