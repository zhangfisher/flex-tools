import { isClass } from "../typecheck/isClass"
import { isPlainObject } from "../typecheck/isPlainObject"
import { assignObject } from '../object/assignObject';

export interface GetClassStaticValueOptions{
    merge?:'none' | 'merge' | 'uniqueMerge'          // 指定合并策略
    default?:any                                    // 当不存在时提供一个默认值
}
/**
 *
 * 获取继承链上指定字段的值
 * 获取类的静态变量值，会沿继承链向上查找，并能自动合并数组和{}值
 *
 * calss A{
 *     static settings={a:1}
 * }
 * calss A1 extends A{
 *     static settings={b:2}
 * }
 *
 * getStaticFieldValue(new A1(),"settings") ==== {a:1,b:2}
 *
 * @param instanceOrClass
 * @param fieldName
 * @param options
 */
export function getClassStaticValue(instanceOrClass:object,fieldName:string,options?:GetClassStaticValueOptions){
    const opts = assignObject({
        // 是否进行合并,0-代表不合并，也就是不会从原型链中读取，1-使用Object.assign合并,2-使用mergeDeepRigth合并
        // 对数组,0-不合并，1-合并数组,   2-合并且删除重复项
        merge:'uniqueMerge',
        default:null                   // 提供默认值，如果{}和[]，会使用上述的合并策略
    },options) as Required<GetClassStaticValueOptions>

    let proto = isClass(instanceOrClass) ? instanceOrClass : instanceOrClass.constructor
    let fieldValue = (proto as any)[fieldName]
    // 0-{}, 1-[], 2-其他类型
    let valueType = isPlainObject(fieldValue) ? 0 : (Array.isArray(fieldValue) ? 1 : 2)
    // 如果不是数组或者{}，则不需要在继承链上进行合并
    if(opts.merge==='none' || valueType===2){
        return fieldValue
    }

    const defaultValue = valueType===0 ? Object.assign({},opts.default || {}) : (opts.default || [])

    let valueList = [fieldValue]

    // 依次读取继承链上的所有同名的字段值
    while (proto){
        proto = (proto as any).__proto__
        if((proto as any)[fieldName]){
            valueList.push((proto as any)[fieldName])
        }else{
            break
        }
    }
    // 进行合并
    let mergedResults = fieldValue
    if(valueType===0){// Object
        mergedResults =  valueList.reduce((result,item)=>{
            if(isPlainObject(item)){        // 只能合并字典
                return opts.merge ==='merge' ? Object.assign({},defaultValue,item,result) : Object.assign({},defaultValue,item,result)
            }else{
                return result
            }
        },{})
    }else{  // 数组
        mergedResults =  valueList.reduce((result,item)=>{
            if(Array.isArray(item)){ // 只能合并数组
                result.push(...item)
            }
            return result
        },[])
    }
    // 删除数组中的重复项
    if(Array.isArray(mergedResults) && opts.merge==='uniqueMerge'){
        mergedResults = Array.from(new Set(mergedResults))
        // 如果提供defaultValue并且数组成员是一个{},则进行合并
        if(isPlainObject(defaultValue)){
            mergedResults.forEach((value:any,index:number) =>{
                if(isPlainObject(value)){
                    mergedResults[index] =  Object.assign({},defaultValue,value)
                }
            })
        }
    }
    return mergedResults
}
 