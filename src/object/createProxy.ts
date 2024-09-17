/**

    创建对象的代理

    const newObj = createProxy(obj,{
        // 读取对象之前
        onReadBefore:(key,value)=>{}


    })



* 
 * 
 */

 
export type CreateProxyOptions =
{

}


export function createProxy<T extends Record<string | number | symbol,any> = Record<string | number | symbol,any>>(obj:object,options?:CreateProxyOptions){

    return new Proxy(obj,{
        get(target,key){
            return Reflect.get(target,key)
        },
        set(target,key,value){
            return Reflect.set(target,key,value)
        }
    })


}