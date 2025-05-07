/**
 * 表示任意类的构造函数类型。可用于需要接受任意类作为参数的场景。
 * 
 * @example
 * ```typescript
 * // 基本用法
 * class MyClass {
 *   constructor(name: string) {
 *     this.name = name;
 *   }
 *   name: string;
 * }
 * 
 * // 函数接受任意类作为参数
 * function createInstance(ClassType: Class) {
 *   return new ClassType();
 * }
 * 
 * // 用于类型约束
 * interface ClassDecorator {
 *   (target: Class): void;
 * }
 * 
 * // 用于泛型约束
 * function getInstance<T extends Class>(ClassType: T): InstanceType<T> {
 *   return new ClassType();
 * }
 * 
 * // 实际使用示例
 * const myInstance = getInstance(MyClass); // MyClass 的实例
 * ```
 */
export type Class<T = any> = new (...args: any[]) => T;

 