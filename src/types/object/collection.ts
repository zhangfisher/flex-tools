/**
 * 表示各种数据集合类型的联合类型，包括对象、数组、Set 和 Map。
 * 
 * @template V - 集合中存储的值的类型（默认为 any）
 * @template K - 键的类型，用于 Record 和 Map（默认为 string | symbol | number）
 * 
 * @example
 * ```typescript
 * // 使用默认类型参数
 * const recordCollection: Collection = { key: 'value' };
 * const arrayCollection: Collection = ['value1', 'value2'];
 * const setCollection: Collection = new Set(['value1', 'value2']);
 * const mapCollection: Collection = new Map([['key', 'value']]);
 * 
 * // 指定值类型
 * type NumberCollection = Collection<number>;
 * const numbers: NumberCollection = [1, 2, 3];  // 数组形式
 * const numberSet: NumberCollection = new Set([1, 2, 3]);  // Set形式
 * const numberRecord: NumberCollection = { a: 1, b: 2 };  // Record形式
 * const numberMap: NumberCollection = new Map([['a', 1]]);  // Map形式
 * 
 * // 指定键和值的类型
 * type UserCollection = Collection<{ name: string }, 'user1' | 'user2'>;
 * const users: UserCollection = {
 *   user1: { name: 'Alice' },
 *   user2: { name: 'Bob' }
 * };
 * ```
 */
export type Collection<
    V = any,
    K extends string | symbol | number = string | symbol | number
> = Record<K, V> | V[] | Set<V> | Map<K, V>;