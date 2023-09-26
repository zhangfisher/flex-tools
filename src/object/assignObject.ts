/**
 * 
 * 使用方法与object.assign一样，差别在于
 * 
 *  Object.assign({a:1},{a:undefined}) === {a:undefined}
 * 
 *  assignObject({a:1},{a:undefined}) === {a:1}
 * 
 * 会忽略掉里面的undefined
 * 
 *  当最后一参数是函数时传入(key)=>boolean，表示只有返回true时才会覆盖
 * 
 
 * 

 * 
 */

export function assignObject<T extends Record<any,any> = Record<any,any>>(target:object , ...sources: any[]): T{   
    if(sources.length === 0) return target as any;
    let mapSources = sources.map((source,index) =>{
        const sourceEntries = Object.entries(source || {})
        if(sourceEntries.some(([k,v]) =>v ===undefined)){
            return sourceEntries.reduce((result:any,[k,v])=>{
                if(v!==undefined){
                    result[k] = v
                }
                return result
            },{})
        }else{
            return source
        }
    })
    return  Object.assign(target as any, ...mapSources);
}

 