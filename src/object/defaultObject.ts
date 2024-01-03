/**
 * 
 * 当对象提供默认值
 * 
 * 当对象在target中不存在时，才会使用默认值
 * 
 * Object.assign({a:1},{) === {a:undefined}
 *  
 * 由于a已经有值了，所以不会使用默认值
 * defaultObject({a:1},{a:2,c:2}) === {a:1,c:2}
  
  此函数用在传参时，如果传入的对象中不存在指定值或undefined时，用默认值覆盖填充
 * 
 * 
 */

export function defaultObject<T extends Record<any,any> = Record<any,any>>(target:T , ...sources: any[]): T{   
    if(sources.length === 0) return target as any;
    sources.forEach((source) =>{
        const sourceEntries = Object.entries(source || {})
        sourceEntries.forEach(([key,value])=>{
            if(!(key in target) || (target[key]== undefined)){
                (target as any)[key] =  value
            }
        })        
    })
    return  target as T
}

 