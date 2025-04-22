/**
 * 从数组中移除指定的值
 * 
 * @param arr - 要操作的数组
 * @param values - 要移除的值列表
 * @returns 返回移除的元素数量
 * 
 * @example
 * ```typescript
 * const arr = [1, 2, 3, 4, 5, 2, 3];
 * 
 * // 移除所有值为2和3的元素，返回移除数量
 * remove(arr, 2, 3);  // 返回: 3
 * console.log(arr);   // 输出: [1, 4, 5]
 * 
 * ```
 */
export function remove<T>(arr: T[],...args: T[]): number {
    const values = args as T[];
    const valueSet = new Set(values);
    const removed: T[] = [];
    // 从后向前遍历以避免splice导致的索引问题
    for (let i = arr.length - 1; i >= 0; i--) {
        if (valueSet.has(arr[i])) {
            removed.unshift(arr.splice(i, 1)[0]);
        }
    }
    return  removed.length;
}
 