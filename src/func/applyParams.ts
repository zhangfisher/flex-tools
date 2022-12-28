 
/**
 *
 * 包装一个函数使之调用指定的参数
 *
 *  function myfunc(a,b){...}
 *  wrapedFunc = applyParams(myfunc,1,2)
 *  wrapedFunc() === myfunc(1,1)
 *
 * @param fn
 * @return {function(): *}
 */
export function applyParams(fn:Function,...params:any[]):Function{
    if(params.length===0) {
        return fn 
    }
    return function (this:any){
        return fn.apply(this,params)
    }
}
 