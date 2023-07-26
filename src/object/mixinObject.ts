/**
 * 
 * 在混入对象
 * 
 */

import { isPropertyMethod } from "../classs/isPropertyMethod"
import { isAsyncFunction } from "../typecheck/isAsyncFunction"
import { isClass } from "../typecheck/isClass"
import { isPlainObject } from "../typecheck/isPlainObject"



// 冲突策略
export type ConflictStrategy ='ignore' | 'replace' | 'merge' | 'error' | ((key:string, target:object, source:object)=>'ignore' | 'replace' | 'merge' | 'error' | undefined)

export interface MixinObjectOptions{
    excludes?: string[]                                             // 排除的字段名称列表
    injectStatic?:boolean                                           // 是否注入静态变量,当source是一个类时,确认如何处理静态变量
    conflict?: ConflictStrategy                                     // 冲突处理策略
}

/**
 * 
 * 同步两个对象的成员值，
 * 
 * 将source成员同步到target中
 * 
 * 按一定的策略对指定的字段进行混入同步处理
 * 
 * -  
 * @param {*} key 
 * @param {*} target 
 * @param {*} source 
 * @param {*} param3 
 * @returns 
 */
 function syncObjectProperty(key:string, target:any, source:any, { conflict }:{conflict:ConflictStrategy}) {
    if (key in target) {
        const conflictValue = (typeof (conflict) == "function" ? conflict(key,target,source) : conflict) || 'ignore'

        if (conflictValue === 'ignore') {                                      // 跳过
            return
        } else if (conflictValue === 'replace') {                               // 替换
            Object.defineProperty(target, key,Object.getOwnPropertyDescriptor(source, key) as any) 
        } else if (conflictValue === 'merge') {                               // 合并
            if (isPlainObject(target[key]) && isPlainObject(source[key])) {         // 数组合并
                target[key] = { ...target[key], ...source[key] }
            } else if (Array.isArray(target[key]) && Array.isArray(source[key])) {  // 对象合并
                target[key] = [...new Set([...target[key], ...source[key]])]
            } else if (isPropertyMethod(target, key) && isPropertyMethod(source, key)) { // 属性替换
                Object.defineProperty(target, key,Object.getOwnPropertyDescriptor(source, key) as any)
            } else if (typeof (target[key]) === "function" && typeof (source[key]) === "function") {  
                // 将两个冲突的函数合并在一起，使两个函数均可以得到执行                
                let targetFunc = target[key], sourceFunc = source[key]
                if(isAsyncFunction(targetFunc) && isAsyncFunction(sourceFunc)){
                    target[key] = async function () {
                        return await Promise.all([targetFunc.call(this, ...arguments), sourceFunc.call(this, ...arguments)])
                    }
                }else{
                    target[key] = function (...args:any[]) {
                        return  Promise.allSettled([
                            ()=>targetFunc.apply(this, args),
                            ()=>sourceFunc.apply(this, args)
                        ]) 
                    }
                }                
            }
        }else if (conflictValue === 'error') { 
            throw new Error(`Mixin ${String(source)}.${key} to ${String(target)}.${key} conflict`)
        }       
    } else {
        let desc = Object.getOwnPropertyDescriptor(source, key) || Object.getOwnPropertyDescriptor(source.prototype, key)
        if (desc && !(key in target)) {
            Object.defineProperty(target, key, desc)
        }
    }
}




/**
 * 
 *   本方法可以用来为类或实例混入属性/方法等
 *   将source混入到target *  
 * 
 * @param {Object} target        目标对象
 * @param {Object} source        将source混入到target
 * @param {Array } excludes      排除的字段名称列表
 * @param {Boolean} injectStatic  是否注入静态变量,当source是一个类时,确认如何处理静态变量
 *                   如果target和source均是一个类，则source的静态属性也混入到target的构造中
 *                  如果target是一个实例，则source的静态属性应该混入到哪里比较合理？
 *                      - 如果混入到target.construct，则会影响到target类的所有实例，明显是比较不合理的,会对其他实例产生不可预知的影响，因此默认将不会混入
 *                      - 但是如果target是一个单例，则混入不会产生重大影响
 *              因此通过一个参数injectStatic来配置当target是一个实例时是否将静态属性混入到其构造中，一般仅仅在target是一个单例时使用
 *              当injectStatic=true时,会将source的静态属性和方法均混入到target.construct
 *  
 * @param {*} conflict      冲突处理策略
 *      0：忽略,即不进行混入         
 *      1：替换，用source中的字段替换target中的
 *      2：合并，按一定策略进行合并
 *           - 如果两者均是{}，则进行深度合并
 *           - 如果两者均是[]，则进行合并去重
 *           - 如果两者均是类属性，则采用替换方式
 *           - 如果两者均是函数，则生成一个()=>Promise.all([source fn],[target fn])的函数，即会同时执行这两个函数并返回结果集
 *      3: 出错,直接抛出错误导致混入过程中断
 *      Function：自定义混入策略, 调用(key,target,source)返回合并后的结果
 *                 conflict(key,target,source){
 *                      - 定义新的属性： Object.defineProperty(target, key,descript)
 *                      - 返回默认的冲空处理策略： return <0|1|2|3>
 *                 }
 *       4. 
 *                                         
 * 
 */


 export function mixinObject(target:any, source:any,  options?:MixinObjectOptions) {
    const { excludes = [], conflict = 'merge',injectStatic=false }  = Object.assign({},options) as Required<MixinObjectOptions>
    excludes.push(...['constructor', 'prototype', 'name', 'length'])
    for (let key of Reflect.ownKeys(source)) {
        if (excludes.includes(String(key))) continue
        syncObjectProperty(String(key), target, source, { conflict})
    }
    if (source.constructor && source.constructor !== Object) {
        for (let key of Reflect.ownKeys(source.constructor)) {
            if (excludes.includes(String(key))) continue
            if(isClass(target) || injectStatic){
                syncObjectProperty(String(key), target.constructor, source.constructor, { conflict })
            }            
        }
    }
    // 复制原型链上的数据
    if (source.prototype) {
        mixinObject(target, source.prototype, { excludes, conflict,injectStatic })
    } else if (source.__proto__ && source.__proto__ != (Function as any).__proto__ && source.__proto__ != Object.prototype) {
        mixinObject(target, source.__proto__, { excludes, conflict,injectStatic})
    }
}

