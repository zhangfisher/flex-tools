/**
 * 获取对象所有值的联合类型
 * @template T 对象类型
 * 
 * @description
 * 此工具类型接受一个对象类型T，返回其所有属性值的联合类型。
 * 相当于`T[keyof T]`的语法糖，但更易读。
 * 
 * @example
 * ```ts
 * const colors = {
 *   red: '#ff0000',
 *   green: '#00ff00',
 *   blue: '#0000ff'
 * } as const;
 * 
 * type ColorValues = ValueOf<typeof colors>;
 * // 等同于: '#ff0000' | '#00ff00' | '#0000ff'
 * 
 * // 与Pick/Extract等工具类型结合使用
 * function getColorValue(key: keyof typeof colors): ValueOf<typeof colors> {
 *   return colors[key];
 * }
 * ```
 */
export type ValueOf<T> = T[keyof T];