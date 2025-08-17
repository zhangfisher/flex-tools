import { isClass } from '../typecheck/isClass'
import { isInstance } from '../typecheck/isInstance'
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
    (options?: Options): MagicClassConstructor<Base, Options>
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
    Options extends Record<string, any> = Record<string, any>,
> = Options & {
    /** 实例创建前的钩子函数，可以阻止实例创建或修改类 */
    onBeforeInstance?: (cls: Base, args: any[], options: Options) => void | boolean | object
    /** 实例创建后的钩子函数 */
    onAfterInstance?: (inst: InstanceType<Base>, options: Options) => void
    /** 实例创建出错时的钩子函数 */
    onErrorInstance?: (error: Error, cls: Base, options: Options) => void
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
export function createMagicClass<
    BaseClass extends Class,
    Options extends Record<string, any> = Record<string, any>,
>(classBase: BaseClass, options?: CreateMagicClassOptions<BaseClass, Options>) {
    function makeInheritable<T extends Function>(ctor: T): T {
        
        function Wrapper(this: any, ...args: any[]) {
            if (!new.target) {
                // 如果是函数调用而非构造函数调用，存储传入的options                
                const wrapperFunction =  Wrapper.bind(null)
                // @ts-expect-error
                wrapperFunction._magicClassOptions=Object.assign({},options,arguments[0] )            
                wrapperFunction.prototype = ctor.prototype    
                return wrapperFunction
            }
            // 合并选项：基础选项 + 实例的魔术类选项
            // @ts-expect-error
            const finalOptions = Object.assign({}, options, new.target._magicClassOptions || {})

            let instance: any
            try {
                // 调用onBeforeInstance钩子
                if (typeof options?.onBeforeInstance === 'function') {
                    const result = options.onBeforeInstance(
                        new.target as unknown as BaseClass,
                        args,
                        finalOptions,
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
                    //@ts-ignore
                    new.target._magicClassOptions = finalOptions
                    // 创建实例
                    instance = Reflect.construct(ctor, args, new.target)
                }
                //instance._magicClassOptions = finalOptions

                // 调用onAfterInstance钩子
                if (typeof options?.onAfterInstance === 'function') {
                    options.onAfterInstance(instance, finalOptions)
                }
                return instance
            } catch (e: any) {
                if (typeof options?.onErrorInstance === 'function') {
                    options.onErrorInstance(e, new.target as unknown as BaseClass, finalOptions)
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

    return makeInheritable(classBase as unknown as any) as unknown as MagicClassConstructor<
        BaseClass,
        Options
    >
}

export function getMagicClassOptions<T = Record<string, any>>(instance: any): T {
    // 优先返回实例自身的_magicClassOptions，如果没有则返回构造函数的_magicClassOptions
    return (instance._magicClassOptions || instance.constructor?._magicClassOptions) as T
}
