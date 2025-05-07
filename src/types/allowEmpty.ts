
/**
 * 将类型转换为可为空（null 或 undefined）的类型
 * 
 * @template T - 要转换的原始类型
 * @example
 * ```typescript
 * // 可以为 string、null 或 undefined 的类型
 * type MaybeString = AllowEmpty<string>;
 * 
 * const str1: MaybeString = "hello";     // ✓ 正确
 * const str2: MaybeString = null;        // ✓ 正确
 * const str3: MaybeString = undefined;   // ✓ 正确
 * const str4: MaybeString = 123;         // ✗ 错误：不能将类型 'number' 分配给类型 'MaybeString'
 * ```
 */
export type AllowEmpty<T> = T | null | undefined