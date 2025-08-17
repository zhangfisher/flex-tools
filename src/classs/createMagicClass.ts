import { isPlainObject } from '../typecheck'
import { isClass } from '../typecheck/isClass'
import type { Class } from '../types'

/**
 * 表示一个魔术类构造函数，既可以作为构造函数使用，也可以作为函数调用来配置选项
 * @template Base 基础类类型
 * @template Options 配置选项类型
 */
export interface MagicClassConstructor<
    Base extends Class,
    Options extends Record<string, any> = Record<string, any>,
> {
    /** 作为构造函数使用，创建基础类的实例 */
    new (...args: ConstructorParameters<Base>): InstanceType<Base>
    /** 作为函数调用，配置选项并返回配置后的构造函数 */
    (...args: ConstructorParameters<Base>): MagicClassConstructor<Base, Options>
    (): MagicClassConstructor<Base, Options>
    /** 原型属性，继承自基础类 */
    prototype: InstanceType<Base>
}

/**
 * 创建魔术类的配置选项
 * @template Base 基础类类型
 * @template Options 扩展配置选项类型
 */
export type CreateMagicClassOptions<
    Base extends Class,
    Params = ConstructorParameters<Base>
> = {
    // 提供默认的构造参数
    params?:  Params
    // 处理构造参数，例如进行参数合并等
    onParameters?: (params: Params | undefined,scopeParms:Params | undefined,baseParams:Params | undefined) => Params
    /** 实例创建前的钩子函数，可以阻止实例创建或修改类 */
    onBeforeInstance?: (cls: Base, args: Params) => void | boolean | object
    /** 实例创建后的钩子函数 */
    onAfterInstance?: (inst: InstanceType<Base>) => void
    /** 实例创建出错时的钩子函数 */
    onErrorInstance?: (error: Error, cls: Base) => void
}

/**
 * 创建一个魔术类，该类既可以作为构造函数使用，也可以作为函数调用来配置选项
 *
 * 魔术类具有以下特性：
 * 1. 可以作为构造函数使用：`new MagicClass(...args)`
 * 2. 可以作为函数调用来配置选项：`MagicClass(options)`，返回配置后的构造函数
 * 3. 支持生命周期钩子：onBeforeInstance、onAfterInstance、onErrorInstance
 *
 * @template BaseClass 基础类类型
 * @template Options 配置选项类型
 * @param classBase 要包装的基础类
 * @param options 创建魔术类的配置选项
 * @returns 魔术类构造函数
 *
 * @example
 * // 基本用法
 * class MyClass {
 *   constructor(name: string) {
 *     this.name = name;
 *   }
 * }
 *
 * const MagicMyClass = createMagicClass(MyClass);
 * const instance = new MagicMyClass("test");
 *
 * @example
 * // 使用配置选项
 * const MagicMyClass = createMagicClass(MyClass, {
 *   onBeforeInstance: (cls, args, options) => {
 *     console.log("Before instance creation", args);
 *   },
 *   onAfterInstance: (instance, options) => {
 *     console.log("Instance created", instance);
 *   }
 * });
 *
 * // 函数调用配置
 * const ConfiguredClass = MagicMyClass({ extraOption: true });
 * const instance = new ConfiguredClass("test");
 */
export function createMagicClass<BaseClass extends Class>(classBase: BaseClass, options?: CreateMagicClassOptions<BaseClass>) {
    type Params = ConstructorParameters<BaseClass>
    // 默认的参数合并方式
    const defaultMergeParams = (params:Params,scopeParms:Params,baseParams:Params):any[]=>{
        return params.map((param,i)=>{
            if(isPlainObject(param)){
                return Object.assign({},baseParams?.[i],scopeParms?.[i],param)
            }else{
                return param || baseParams?.[i] || scopeParms?.[i]
            }
        })
    }
    const { onParameters,onBeforeInstance,onAfterInstance,onErrorInstance,params:baseParams } = Object.assign({
        onParameters: defaultMergeParams
    },options)

    function makeInheritable<T extends Function>(ctor: T): T {
        
        function createNewWrapper(Wrapper:any,...args: any[]){
            const bindWrapper =  Wrapper.bind(null)                
            bindWrapper.prototype = ctor.prototype      
            const params:any[] = args
            // @ts-ignore
            params.__MAGIC_CLASS_PARAMS=true         
            const newWrapper = function(this: any, ...args: any[]) {
                if (!new.target) {
                    return createNewWrapper(newWrapper,...arguments)
                }
                // 重点: 只能通过new来创建类，而不是通过构造函数调用(不能直接执行)
                // @ts-ignore
                return new Wrapper(params,...args)
            }
            newWrapper.prototype = ctor.prototype     
            Object.defineProperty(newWrapper, 'name', {
                value: ctor.name,
                configurable: true,
            })
            return newWrapper
        }
        function Wrapper(this: any,...args: any[]) {
            if (!new.target) {
                return createNewWrapper(Wrapper,...arguments)  
            }
            // @ts-ignore
            const hasParams = args.length > 0 ? (Array.isArray(args[0]) && args[0].__MAGIC_CLASS_PARAMS) : false
            const scopeParams = (hasParams ? args[0] : {}) as Params
            const params = (hasParams ? args.slice(1) : args) as Params
            const finalParams = onParameters!(params,scopeParams,baseParams)
 
            let instance: any
            try {
                // 调用onBeforeInstance钩子
                if (typeof onBeforeInstance === 'function') {
                    const result = onBeforeInstance(
                        new.target as unknown as BaseClass,
                        finalParams as any
                    )
                    if (result === false) {
                        throw new Error('createMagicClass is blocked by onBeforeInstance hook')
                    } else if (isClass(result)) {
                        // 替换构造函数
                        instance = Reflect.construct(result as unknown as T, args)
                    } else if (result !== undefined) {
                        instance = result
                    }
                }
                if (!instance) { 
                    // 创建实例
                    instance = Reflect.construct(ctor, finalParams, new.target)
                } 

                // 调用onAfterInstance钩子
                if (typeof onAfterInstance === 'function') {
                    onAfterInstance(instance)
                }
                return instance
            } catch (e: any) {
                if (typeof onErrorInstance === 'function') {
                    onErrorInstance(e, new.target as unknown as BaseClass)
                }
                throw e // 重新抛出错误，确保错误能够传播
            }
        }
        Wrapper.prototype = ctor.prototype
        Object.defineProperty(Wrapper, 'name', {
            value: ctor.name,
            configurable: true,
        })
        return Wrapper as unknown as T
    }
    return makeInheritable(classBase as unknown as any) as unknown as MagicClassConstructor<BaseClass>
}
 