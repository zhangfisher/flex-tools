/**
 * 检查给定的类型是否为数字或数字字符串。
 * 支持整数、负数和浮点数的字符串表示。
 * 
 * @template N - 要检查的类型
 * 
 * @example
 * ```typescript
 * // 基本数字类型
 * type A = IsNumberLike<number>;        // true
 * type B = IsNumberLike<1>;             // true
 * type C = IsNumberLike<-1>;            // true
 * type D = IsNumberLike<1.5>;           // true
 * 
 * // 数字字符串
 * type E = IsNumberLike<'1'>;           // true
 * type F = IsNumberLike<'-1'>;          // true
 * type G = IsNumberLike<'1.5'>;         // true
 * type H = IsNumberLike<'-1.5'>;        // true
 * 
 * // 非数字类型
 * type I = IsNumberLike<'abc'>;         // false
 * type J = IsNumberLike<'1a'>;          // false
 * type K = IsNumberLike<true>;          // false
 * type L = IsNumberLike<{}>;            // false
 * 
 * // 实际应用场景
 * interface Config {
 *   port: IsNumberLike<string | number> extends true ? string | number : never;
 *   timeout: IsNumberLike<string | number> extends true ? string | number : never;
 * }
 * 
 * const config: Config = {
 *   port: '8080',      // 有效
 *   timeout: 5000      // 有效
 * };
 * 
 * // 类型守卫中使用
 * function isNumberLike(value: unknown): value is string | number {
 *   return (
 *     typeof value === 'number' ||
 *     (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value))
 *   );
 * }
 * ```
 */
export type IsNumberLike<N> =
	N extends number ? true
		:	N extends `${number}`
			? true
			: N extends `${number}.${number}`
				? true
				: false;