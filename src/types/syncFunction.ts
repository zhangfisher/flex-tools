/**
 * 表示一个具有指定返回类型的函数类型。该函数可以接受任意参数，但必须返回指定类型的值。
 * 
 * @template T - 函数的返回类型
 * 
 * @example

function getCount(fn:SyncFunction<number>){
}
getCount(()=>100)  // ✅ Correct
getCount(()=>true) // ❌ ERROR
getCount(async ()=>100)  // ❌ Correct
getCount(async()=>true) // ❌ ERROR
 */
export type SyncFunction<T> = (...args: any) => Exclude<T, Promise<any>>;
