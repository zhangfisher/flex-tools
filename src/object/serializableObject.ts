/**
 * 遍历一个{}对象，删除里面所有不能被序列化的字段，主要是类，类实例，函数
 * 最终保留下的是一个PlainObject,只有{},Array,原始数据类型会被保留
 *
 * 对{}而言，如果成员有不能被序列化的字段的字段，则会被删除
 * 对Array而言，则会将成员置为null
 *
 * @param data
 * @returns {*[]}
 */

import { isPlainObject } from "../typecheck/isPlainObject"
import { isSerializable } from "../typecheck/isSerializable"

export function serializableObject(data:any[] | object){
    let result:any = Array.isArray(data) ? [] : {}
    for(let [key,value] of Object.entries(data)){
        if(Array.isArray(value) || isPlainObject(value)){
            result[key] = serializableObject(value)
        }else{
            if(isSerializable(value)){
                result[key] = value===undefined ? null : value
            }
        }
    }
    return result
}