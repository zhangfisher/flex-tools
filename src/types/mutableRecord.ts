import { Union } from "./union"


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
export type MutableRecord<Items,KindKey extends string='type',Share = unknown,DefaultKind extends keyof Items = never> = {
    [ Kind in keyof Items]: Union<{
        [type in KindKey]: Kind;
    } & Items[Kind] & Share>
}[Exclude<keyof Items, DefaultKind>]  | (
    DefaultKind extends never ? never : (
        Union<{[K in KindKey]?:DefaultKind} & Items[DefaultKind] & Share> 
    )
)



 
type AnimalWithDefault = MutableRecord<{
    dog: { bark: boolean; wagging: boolean };
    cat: { mew: number };
    chicken: { egg: number };
  }, 'type', { a?: 1; b?: 2; c?: 3 },'cat'>;
  
  // 测试用例
  let animals: AnimalWithDefault = {  // ✅ 显式指定 type="dog"
    type: "dog",
    bark: true,
    wagging: true,
    a: 1
  };
  
  let animals2: AnimalWithDefault = {  // ✅ 显式指定 type="cat"
    type: "cat",
    mew: 23,
    b: 2
  };
  
  let animals3: AnimalWithDefault = {  // ✅ 默认 type="cat"（无 type 字段）
    mew: 23, 
    c: 3
  };
  animals3.type==='cat'
  
function getAnimal(ani: AnimalWithDefault): AnimalWithDefault{
    return ani
}
type f = keyof AnimalWithDefault 
   
getAnimal({
    type:'cat',
    mew:''
})

// type Animal = MutableRecord<{
//     dog: { bark: boolean; wagging: boolean };
//     cat: { mew: number };
//     chicken: { egg: number };
//   }, 'type', { a?: 1; b?: 2; c?: 3 }>;
  
//   // 测试用例
//   let animals21: Animal = {  // ✅ 显式指定 type="dog"
//     type: "dog",
//     bark: true,
//     wagging: true,
//     a: 1
//   };
  
//   let animals22: Animal = {  // ✅ 显式指定 type="cat"
//     type: "cat",
//     mew: 23,
//     b: 2
//   };
  
//   let animals23: Animal = {  // ✅ 默认 type="cat"（无 type 字段）
//     type:'cat',
//     mew: 23, 
//     c: 3
//   };
   