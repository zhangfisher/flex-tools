import { Union } from "./union"

/**
 * 创建一个可变记录数组类型，数组中的每个元素都是一个可变记录，其具体类型由指定的类型字段（默认为'type'）决定。
 * 这个类型是 MutableRecord 的数组版本，常用于处理多态对象的集合。
 * 
 * @template Items - 包含所有可能类型的映射对象
 * @template KindKey - 用作类型标识符的字段名（默认为'type'）
 * 
 * @example
 * ```typescript
 * // 基本用法：动物列表
 * type AnimalList = MutableRecordList<{
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
 * const animals: AnimalList = [
 *   {
 *     type: "dog",
 *     bark: true,
 *     wagging: true
 *   },
 *   {
 *     type: "cat",
 *     meow: 5,
 *     purring: true
 *   },
 *   {
 *     type: "bird",
 *     sing: "tweet",
 *     wingspan: 20
 *   }
 * ];
 * 
 * // 使用自定义类型字段
 * type ShapeList = MutableRecordList<{
 *   circle: {
 *     radius: number;
 *   };
 *   rectangle: {
 *     width: number;
 *     height: number;
 *   };
 * }, 'kind'>;
 * 
 * const shapes: ShapeList = [
 *   {
 *     kind: 'circle',
 *     radius: 5
 *   },
 *   {
 *     kind: 'rectangle',
 *     width: 10,
 *     height: 20
 *   }
 * ];
 * 
 * // 实际应用：消息历史记录
 * type MessageHistory = MutableRecordList<{
 *   text: {
 *     content: string;
 *     sender: string;
 *   };
 *   image: {
 *     url: string;
 *     size: number;
 *     sender: string;
 *   };
 *   system: {
 *     action: 'join' | 'leave';
 *     username: string;
 *   };
 * }>;
 * 
 * const chatHistory: MessageHistory = [
 *   {
 *     type: 'system',
 *     action: 'join',
 *     username: 'Alice'
 *   },
 *   {
 *     type: 'text',
 *     content: 'Hello everyone!',
 *     sender: 'Alice'
 *   },
 *   {
 *     type: 'image',
 *     url: 'image.jpg',
 *     size: 1024,
 *     sender: 'Bob'
 *   }
 * ];
 * 
 * // 类型安全的数组处理
 * function processMessages(messages: MessageHistory) {
 *   return messages.map(msg => {
 *     switch (msg.type) {
 *       case 'text':
 *         return `${msg.sender}: ${msg.content}`;
 *       case 'image':
 *         return `${msg.sender} shared an image (${msg.size} bytes)`;
 *       case 'system':
 *         return `${msg.username} ${msg.action}ed the chat`;
 *     }
 *   });
 * }
 * ```
 */
 export type MutableRecordList<Items,KindKey extends string='type',Share=unknown> = {
    [ Kind in keyof Items]:Union<{
        [type in KindKey]: Kind;
    } & Items[Kind] & Share>
}[keyof Items][]



// type Animals = MutableRecordList<{
//     dog:{bark:boolean,wagging:boolean},
//     cat:{mew:number},
//     chicken:{egg:number}      
// },'type',{x?:number,y?:boolean,z?:string}>
// // (
// //     {type:'dog',bark:boolean,wagging:boolean } 
// //     | {type: 'cat', mew:number}
// //     | {type: 'chicken', egg:number}
// // )[]

// let animals:Animals = [
//     { type:"dog", bark:true,wagging:true},
//     { type:"cat", mew:23 } 
// ]