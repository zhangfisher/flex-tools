
/**
 * 获取指定对象的所有包含原型链上的所有属性列表 * 
 * @param obj 
 * @param includePrototype 是否包含原型链上的属性，默认为true
 * @returns 
 */
 export function getPropertyNames(obj: any, includePrototype: boolean = true): string[]{
    const propertyNames: string[] = [];
    do {
        propertyNames.push(...Object.getOwnPropertyNames(obj));
        if(!includePrototype) break;
        obj = Object.getPrototypeOf(obj);        
    } while (obj!==Object.prototype);
    return Array.from(new Set<string>(propertyNames));
} 
