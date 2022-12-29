
/**
 * 获取指定对象的所有包含原型链上的所有属性列表 * 
 * @param obj 
 * @returns 
 */
 export function getPropertyNames(obj: any) {
    const propertyNames: string[] = [];
    do {
        propertyNames.push(...Object.getOwnPropertyNames(obj));
        obj = Object.getPrototypeOf(obj);
    } while (obj);
    // get unique property names
    return Array.from(new Set<string>(propertyNames));
} 
