declare const emptyObjectSymbol: unique symbol;

/**
 * 表示一个严格意义上的空对象类型，即只能是 `{}` 值。
 * 
 * 在 TypeScript 中，当你使用 `{}` 作为类型注解时，它可以是除 `null` 和 `undefined` 之外的任何值。
 * 这意味着你不能使用 `{}` 来表示一个空的普通对象。EmptyObject 类型解决了这个问题。
 * 
 * 注意：使用 `Record<string, never>`、`Record<keyof any, never>` 或 `Record<never, never>` 
 * 都不能完全解决这个问题。详见 [issue #395](https://github.com/sindresorhus/type-fest/issues/395)。
 * 
 * @example
 * ```typescript
 * // 使用 {} 类型的问题
 * const foo1: {} = {};        // ✓ 通过
 * const foo2: {} = [];        // ✓ 通过（不应该）
 * const foo3: {} = 42;        // ✓ 通过（不应该）
 * const foo4: {} = {a: 1};    // ✓ 通过（不应该）
 * 
 * // 使用 EmptyObject 类型
 * const bar1: EmptyObject = {};       // ✓ 通过
 * const bar2: EmptyObject = 42;       // ✗ 错误
 * const bar3: EmptyObject = [];       // ✗ 错误
 * const bar4: EmptyObject = {a: 1};   // ✗ 错误
 * 
 * // 实际应用场景
 * interface Config<T extends EmptyObject | Record<string, unknown>> {
 *   data: T;
 *   validate(): boolean;
 * }
 * 
 * // 空配置
 * const emptyConfig: Config<EmptyObject> = {
 *   data: {},
 *   validate() { return true; }
 * };
 * 
 * // 带数据的配置
 * const dataConfig: Config<{name: string}> = {
 *   data: { name: "test" },
 *   validate() { return this.data.name.length > 0; }
 * };
 * ```
 */
export type EmptyObject = {[emptyObjectSymbol]?: never};