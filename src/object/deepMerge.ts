
/**
 * 简单进行对象深度合并
 * 
 * 对lodash的merge的最大差别在于对数据进行替换与合并或去重
 * 
 * @param {*} toObj 
 * @param {*} formObj 
 * @returns 合并后的对象
 */
export interface DeepMergeOptions{
    array:number,                           // 数组合并策略，0-替换，1-合并，2-去重合并
}
export function deepMerge(toObj:any,formObj:any,options:DeepMergeOptions={array:2}){
    let results:any = Object.assign({},toObj)
    Object.entries(formObj).forEach(([key,value])=>{
        if(key in results){
            if(typeof value === "object" && value !== null){
                if(Array.isArray(value)){
                    if(options.array === 0){
                        results[key] = value
                    }else if(options.array === 1){
                        results[key] = [...results[key],...value]
                    }else if(options.array === 2){
                        results[key] = [...new Set([...results[key],...value])]
                    }
                }else{
                    results[key] = deepMerge(results[key],value,options)
                }
            }else{
                results[key] = value
            }
        }else{
            results[key] = value
        }
    })
    return results
}