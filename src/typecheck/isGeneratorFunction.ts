/**
 * 判断是否是异步生成器函数
 * @param fn 
 * @returns 
 */
export function isGeneratorFunction(fn:any):boolean{
    if (typeof fn !== 'function') {
		return false;
	}
	if(Object.prototype.toString.call(fn)==="[object GeneratorFunction]"){
        return true
    }
    if(Object.getPrototypeOf(fn)===Object.getPrototypeOf(function*(){})){
        return true
    }
    if(fn.constructor.name==="GeneratorFunction"){
        return true
    }
    const fnStr = fn.toString()
    if(/^\s*(?:function)?\*/gm.test(fnStr)) {
		return true;
	}   
    return false;
}
