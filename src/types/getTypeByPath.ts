import { Get } from "type-fest"
import { Dict } from "./dict"

/**
 * 根据点分隔的路径字符串获取对象中指定位置的类型。
 * 如果路径为空或未定义，则返回整个对象的类型。
 * 
 * @template State - 要获取类型的对象（必须是 Dict 类型）
 * @template Path - 点分隔的路径字符串
 * 
 * @example
 * ```typescript
 * // 基本对象类型
 * interface State {
 *   user: {
 *     profile: {
 *       name: string;
 *       age: number;
 *     };
 *     settings: {
 *       theme: 'light' | 'dark';
 *       notifications: boolean;
 *     };
 *   };
 *   posts: {
 *     [id: string]: {
 *       title: string;
 *       content: string;
 *     };
 *   };
 * }
 * 
 * // 获取不同路径的类型
 * type UserProfile = GetTypeByPath<State, 'user.profile'>;
 * // 结果: { name: string; age: number; }
 * 
 * type UserName = GetTypeByPath<State, 'user.profile.name'>;
 * // 结果: string
 * 
 * type Theme = GetTypeByPath<State, 'user.settings.theme'>;
 * // 结果: 'light' | 'dark'
 * 
 * type Post = GetTypeByPath<State, 'posts'>;
 * // 结果: { [id: string]: { title: string; content: string; } }
 * 
 * // 空路径返回整个状态类型
 * type EntireState = GetTypeByPath<State, ''>;
 * // 结果: State
 * 
 * // 实际使用场景
 * function getValueByPath<T extends Dict, P extends string>(
 *   obj: T,
 *   path: P
 * ): GetTypeByPath<T, P> {
 *   return path.split('.').reduce((acc, key) => acc[key], obj) as any;
 * }
 * ```
 */
import { ChangePathDelimiter } from "./objectKeyPaths"

export type GetTypeByPath<State extends Dict, Path extends string,Delimiter extends string = '.'> = 
    Path extends '' | undefined ? State : Get<State, ChangePathDelimiter<Path,'.',Delimiter>>;