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

export type ConcreteClass<T = object> = new (...args: any[]) => T;
export type AbstractClass<T = object> = abstract new (...args: any[]) => T;
export type Class<T = object> = ConcreteClass<T> | AbstractClass<T>;

// abstract class A {
//   abstract methodA(): void;
// }

// class B {
//   methodB() {
//     return "B";
//   }
// }

// class B1 extends B {
//   methodB1() {
//     return "B1";
//   }
// }

// // 正确的泛型约束方式
// function test2<T extends B>(cls: Class<T>): void {
//   // 现在 cls 必须返回 T 类型，而 T 必须是 B 或其子类
// }

// test2(B); // ✅ 正确
// test2(B1); // ✅ 正确 - B1 是 B 的子类
// test2(A); // ❌ 错误 - A 不是 B 的子类
