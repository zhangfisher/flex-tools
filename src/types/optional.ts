/**
 * 将类型中的所有属性变为可选属性，排除指定的键名。
 */

import { Expand } from "./Expand";

/**
 * 将类型中的所有属性变为可选属性，同时可以指定某些属性保持必需。
 * 这个类型工具在创建部分更新或配置对象时非常有用。
 * 
 * @template T - 要处理的原始类型
 * @template K - 要保持必需的属性键（默认为 never，即所有属性都变为可选）
 * 
 * @example
 * ```typescript
 * // 基本用法：用户信息
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   age?: number;
 * }
 * 
 * // 创建更新类型 - 只有id是必需的，其他都是可选的
 * type UserUpdate = Optional<User, 'id'>;
 * 
 * const update1: UserUpdate = {
 *   id: '123',       // 必需
 *   name: 'Alice'    // 可选
 * };
 * 
 * const update2: UserUpdate = {
 *   id: '456'        // 必需
 *                   // 其他字段可选
 * };
 * 
 * // 错误示例
 * // const invalidUpdate: UserUpdate = {
 * //   name: 'Bob'    // 错误：缺少必需的 id
 * // };
 * 
 * // 配置对象示例
 * interface Config {
 *   apiKey: string;
 *   endpoint: string;
 *   timeout?: number;
 *   retries?: number;
 * }
 * 
 * // 创建部分配置类型 - apiKey 是必需的
 * type PartialConfig = Optional<Config, 'apiKey'>;
 * 
 * // 实际应用：表单验证
 * interface FormValues {
 *   username: string;
 *   password: string;
 *   rememberMe: boolean;
 * }
 * 
 * // 登录表单 - 用户名和密码是必需的，记住我是可选的
 * type LoginForm = Optional<FormValues, 'username' | 'password'>;
 * 
 * const form1: LoginForm = {
 *   username: 'user1',
 *   password: 'secret'
 * };
 * 
 * const form2: LoginForm = {
 *   username: 'user2',
 *   password: 'secret',
 *   rememberMe: true
 * };
 * 
 * // 高级用法：嵌套对象
 * interface Product {
 *   id: string;
 *   name: string;
 *   details: {
 *     price: number;
 *     stock: number;
 *   };
 * }
 * 
 * // 更新产品 - 只有id是必需的
 * type ProductUpdate = Optional<Product, 'id'>;
 * 
 * const productUpdate: ProductUpdate = {
 *   id: 'prod-123',
 *   details: {        // 整个嵌套对象是可选的
 *     price: 99.99    // 但一旦提供了details，price和stock都是可选的
 *   }
 * };
 * ```
 */
export type Optional<T, ExcludeKeys extends keyof T = never> = Expand<Partial<T> & Required<Pick<T, ExcludeKeys>>>;

// export interface SiteOptions{
//     id:string                           // 站点ID   
//     icon:string                         // 站点图标
//     logo:string                         // 站点logo
//     title:string                        //
//     path:string                         // 站点路径        
// }


// type mysite = Optional<SiteOptions,'id' | 'path'>


// let site:mysite = {
//     id:"1",
//     path:"ddd"
// }


// type mysite2 = Optional<SiteOptions>


// let site2:mysite2 = {
//     id:"1"
// }
