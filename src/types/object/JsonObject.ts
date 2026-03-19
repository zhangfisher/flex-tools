
/**
 * 表示一个支持嵌套的 JSON 对象类型。
 * 这个类型支持比标准 JSON 更多的数据类型，包括 Set、Map、Symbol、WeakMap、WeakSet 和 Function。
 * 
 * @example
 * ```typescript
 * // 基本使用
 * const simpleJson: JsonObject = {
 *   name: "John",
 *   age: 30,
 *   isAdmin: true,
 *   tags: ["user", "active"],
 *   metadata: null
 * };
 * 
 * // 嵌套对象
 * const nestedJson: JsonObject = {
 *   user: {
 *     id: 1,
 *     profile: {
 *       avatar: "url/to/image",
 *       settings: {
 *         theme: "dark"
 *       }
 *     }
 *   }
 * };
 * 
 * // 使用扩展类型
 * const extendedJson: JsonObject = {
 *   id: 1,
 *   tags: new Set(["tag1", "tag2"]),
 *   metadata: new Map([
 *     ["created", "2023-01-01"],
 *     ["updated", "2023-12-31"]
 *   ]),
 *   weakRefs: new WeakMap(),
 *   callback: () => console.log("Hello"),
 *   symbol: Symbol("unique")
 * };
 * 
 * // 类型检查函数
 * function isJsonObject(value: unknown): value is JsonObject {
 *   return value !== null && typeof value === "object";
 * }
 * 
 * // API 响应类型
 * interface ApiResponse {
 *   data: JsonObject;
 *   status: number;
 * }
 * ```
 */
export interface JSONObject {
    [key: string]: string 
        | number 
        | boolean 
        | null 
        | any[] 
        | Set<any> 
        | Map<any, any> 
        | symbol 
        | WeakMap<any, any> 
        | WeakSet<any> 
        | Function 
        | JSONObject;
}