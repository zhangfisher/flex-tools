
/**
 * 
 * 映射对象生成新的对象
 * 
 * 不支持深度映射
 * 
 * data = {a:1,b:2}
 * mapObject(data,(k,v)=>v+1)   == {a:2,b:2}
 * 
 * @param obj 
 * @param callback 
 * @param keys   只处理指定键
 * @returns 
 */
export function mapObject<T=any>(obj:Record<string,T>,callback:(value:T,key?:string)=>T,keys?:string[]){
    let result:Record<string,T> = {}
    Object.entries<T>(obj).forEach(([key,value])=>{
        try{
            if(Array.isArray(keys)){
                result[key]= (keys.includes(key)) ? callback(value,key) : value  
            }else{
                result[key]=callback(value,key) 
            }            
        }catch{
            result[key]=value
        }
    })
    return result
}
