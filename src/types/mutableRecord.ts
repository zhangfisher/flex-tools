

/**
 * 可变记录,其类型由是type字段推断的
 * 
 * type Animal = MutableRecord<{
 *    dog:{bark:boolean,wagging:boolean},
 *    cat:{mew:number},
 *    chicken:{egg:number}      
 * }>
 * 
 * let animals:Animal = {
 *      type:"dog",
 *      bark:true,
 *      wagging:true
 * }
 * let animals:Animal = {
 *      type:"cat",
 *      mew:23
 * }
 * 
 */
 export type MutableRecord<Items,KindKey extends string='type'> = {
    [ Kind in keyof Items]: {
        [type in KindKey]: Kind;
    } & Items[Kind]
}[keyof Items]

