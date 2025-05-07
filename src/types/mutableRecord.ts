

/**
 * 创建一个可变记录类型，其具体类型由指定的类型字段（默认为'type'）决定。
 * 这个类型工具常用于实现类型安全的多态对象，每个对象都包含一个类型标识符和对应的属性。
 * 
 * @template Items - 包含所有可能类型的映射对象
 * @template KindKey - 用作类型标识符的字段名（默认为'type'）
 * 
 * @example
 * ```typescript
 * // 基本用法：动物类型系统
 * type Animal = MutableRecord<{
 *   dog: {
 *     bark: boolean;
 *     wagging: boolean;
 *   };
 *   cat: {
 *     meow: number;
 *     purring: boolean;
 *   };
 *   bird: {
 *     sing: string;
 *     wingspan: number;
 *   };
 * }>;
 * 
 * // 使用示例
 * const dog: Animal = {
 *   type: "dog",      // 类型标识符
 *   bark: true,       // dog 特有属性
 *   wagging: true
 * };
 * 
 * const cat: Animal = {
 *   type: "cat",      // 类型标识符
 *   meow: 5,         // cat 特有属性
 *   purring: true
 * };
 * 
 * // 使用自定义类型字段
 * type Shape = MutableRecord<{
 *   circle: {
 *     radius: number;
 *   };
 *   rectangle: {
 *     width: number;
 *     height: number;
 *   };
 * }, 'kind'>;  // 使用 'kind' 作为类型字段
 * 
 * const circle: Shape = {
 *   kind: 'circle',   // 使用 'kind' 而不是 'type'
 *   radius: 5
 * };
 * 
 * // 实际应用：消息系统
 * type Message = MutableRecord<{
 *   text: {
 *     content: string;
 *   };
 *   image: {
 *     url: string;
 *     width: number;
 *     height: number;
 *   };
 *   file: {
 *     url: string;
 *     size: number;
 *     name: string;
 *   };
 * }>;
 * 
 * function processMessage(message: Message) {
 *   switch (message.type) {
 *     case 'text':
 *       console.log(message.content);  // TypeScript 知道这里是 text 消息
 *       break;
 *     case 'image':
 *       console.log(message.url, message.width);  // TypeScript 知道这里是 image 消息
 *       break;
 *     case 'file':
 *       console.log(message.name, message.size);  // TypeScript 知道这里是 file 消息
 *       break;
 *   }
 * }
 * ```
 */
 export type MutableRecord<Items,KindKey extends string='type'> = {
    [ Kind in keyof Items]: {
        [type in KindKey]: Kind;
    } & Items[Kind]
}[keyof Items]
