/**
 *
 *   返回指定名称的方法是否是一个属性
 *  而不是一个函数
 *
 * @param inst
 * @param name
 * @returns {boolean}
 */
export function isPropertyMethod(inst:object, name:string){
    try{
        const descriptor = Object.getOwnPropertyDescriptor(inst,name)
        return descriptor && (descriptor.get || descriptor.set)
    }catch(e){}
    return false
}
 