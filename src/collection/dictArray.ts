import { deepMerge } from "../object"
import { isNothing } from "../typecheck/isNothing"
import { isPlainObject } from "../typecheck/isPlainObject"


export interface  DictArrayOptions{
    defaultField:string             // 声明默认字段，允许在items里面只写默认字段而不用完整的{}
    includeDefaultField:boolean     // 如果此值=true，则会为每一个item增加一个default字段，并且保证整个items里面至少有一项default=true
}

/**
 * 对成员是{}的数组内容进行规范化处理
 *  [{},{},"",{},{}]
 *  dictArray具有以下特征:
 *  1. 每一项均是一个{}
 *  2. 数组成员可以写省略项，如[{name:"xx“，...},{name:"",},"tom",{name:"",...}]，
 *   其中的tom代表是{}中的某个字段，在进行处理后将变成[{name:"xx“，...},{name:"",},{name:"tom",..默认项.},{name:"",...}]
 *  3. 如果输入的是{}，则转换成[{..}]
 *  4. 如果是其他非{}和Array，则按省略项进行处理，如dictArray("tom")==> [{name:"tom",..默认项.}]
 *  5. 可以指定其中的一个为default=true
 *
 *
 *
 *  dictArray
 *
 *
 *
 * @param items
 * @param defaultItem           提供默认值
 * @param options ={
 *  defaultField:<声明默认字段，>>}
 * @constructor
 */
 export function dictArray<Item>(items:any[],defaultItem:Partial<Item> & {default?:boolean},options?:DictArrayOptions){
    const opts = Object.assign({
        defaultField:"",                    // 声明默认字段，允许在items里面只写默认字段而不用完整的{}
        includeDefaultField:false,          // 如果此值=true，则会为每一个item增加一个default字段，并且保证整个items里面至少有一项default=true
    },options || {}) as Required<DictArrayOptions>
    if(isNothing(items)){
        return []
    }
    if(opts.includeDefaultField){
        defaultItem["default"]=false
    }
    let result = Array.isArray(items) ? items : [items]
    result.forEach((value,index)=>{
        result[index] =deepMerge(defaultItem,isPlainObject(value) ? value : {[opts.defaultField]:value})
    })
    //  确保至少有一项default=true
    if(opts.includeDefaultField && (result.reduce((preValue,curItem)=>curItem.default ? preValue+1 : preValue,0)===0) && result.length>0){
        result[0].default=true
    }
    return result
}