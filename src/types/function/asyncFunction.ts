/**
 * 表示一个异步函数类型.
 * const fetchData: AsyncFunction = async (url: string) => {};

// 用作参数类型
function executeAsync(fn: AsyncFunction) {
  return fn();
}
executeAsync(async ()=>{}) ✅ Correct 
executeAsync(()=>{})❌ Error 

// 限制返回值类型
function executeAsync(fn: AsyncFunction<boolean>) {
  return fn();
}
executeAsync(async ()=>true)✅ Correct
executeAsync(()=>true) ❌ Error 
 */
export type AsyncFunction<Returns=void | any> = (...args: any[]) => Promise<Returns>;
 