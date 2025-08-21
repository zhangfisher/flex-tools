import { isPlainObject } from '../typecheck'
import { isClass } from '../typecheck/isClass'
import type { Class, Fallback } from '../types'

type StrictTuple<T> = T extends readonly [...infer E] ? E : [...never]

/**
 * 表示一个魔术类构造函数，既可以作为构造函数使用，也可以作为函数调用来配置选项
 * @template Base 基础类类型
 * @template Options 配置选项类型
 */
/**
 * 表示一个魔术类构造函数，既可以作为构造函数使用，也可以作为函数调用来配置选项
 * @template Base 基础类类型
 * @template Options 配置选项类型
 */
export interface MagicClassConstructor<Base extends Class, Args = ConstructorParameters<Base>> {
    /** 作为构造函数使用，创建基础类的实例 */
    new (...args: StrictTuple<Args>): InstanceType<Base>
    /** 作为函数调用，配置选项并返回配置后的构造函数 */
    <RefArgs = never>(
        ...args: StrictTuple<Args>
    ): MagicClassConstructor<Base, Fallback<RefArgs, Args>>
    <RefArgs = never>(
        createOptions: CreateMagicClassOptions<Base, RefArgs>,
    ): MagicClassConstructor<Base, Fallback<RefArgs, Args>>
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
    RefParams = ConstructorParameters<Base>,
    Params = ConstructorParameters<Base>,
> = {
    // 处理类构造参数
    params?: Params | ((params: RefParams, scopeParms: Params) => Params)
    /** 实例创建前的钩子函数，可以阻止实例创建或修改类 */
    onBeforeInstance?: (cls: Base, params: Params) => void | boolean | object
    /** 实例创建后的钩子函数 */
    onAfterInstance?: (inst: InstanceType<Base>) => void
    /** 实例创建出错时的钩子函数 */
    onErrorInstance?: (error: Error, cls: Base, params: Params) => void
}

export type MagicClassScope = CreateMagicClassOptions<any> & {
    __MAGIC_CLASS_SCOPE: boolean
    finalParams: any[]
}

function isMagicClassOptions(args: any[]): boolean {
    if (args.length !== 1) return false
    const params = args[0] as CreateMagicClassOptions<any>
    return (
        typeof params === 'object' &&
        ('params' in params ||
            'onBeforeInstance' in params ||
            'onAfterInstance' in params ||
            'onErrorInstance' in params)
    )
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
export function createMagicClass<BaseClass extends Class>(
    classBase: BaseClass,
    options?: CreateMagicClassOptions<BaseClass>,
) {
    type Params = ConstructorParameters<BaseClass>
    const { params, onBeforeInstance, onAfterInstance, onErrorInstance } = Object.assign(
        {},
        options,
    )

    const defaultParams = Array.isArray(params) ? params : undefined

    // 默认的参数合并方式
    const defaultHandleParams = (params: Params, parentParms: Params | undefined): Params => {
        const len = Math.max(params.length, parentParms?.length || 0)
        return Array.from({ length: len }).map((_, i) => {
            const param = params[i]
            if (isPlainObject(param)) {
                return Object.assign({}, defaultParams?.[i], parentParms?.[i], param)
            } else {
                return param || parentParms?.[i] || defaultParams?.[i]
            }
        }) as Params
    }
    const handleParameters = (
        typeof params === 'function' ? params : defaultHandleParams
    ) as Function

    function makeInheritable<T extends Function>(ctor: T): T {
        function createCallWrapper(Wrapper: any, ...args: any[]) {
            if (isMagicClassOptions(args)) {
                return createMagicClass(Wrapper, Object.assign({}, options, args[0]))
            }
            const bindWrapper = Wrapper.bind(null)
            bindWrapper.prototype = Wrapper.prototype
            const newWrapper = function (this: any, ...args: Params) {
                if (isMagicClassOptions(args)) {
                    return createMagicClass(bindWrapper, args[0])
                }
                const handleParams =
                    newWrapper._magic_class_options?.paramHandler || handleParameters
                const newArgs = handleParams(args, newWrapper._magic_class_options.params) as Params
                if (!new.target) {
                    return createCallWrapper(bindWrapper, ...newArgs)
                }
                return new bindWrapper(...newArgs)
            }
            // 魔术类选项
            newWrapper._magic_class_options = Object.assign(
                {},
                options,
                {
                    paramHandler: handleParameters,
                    params: handleParameters(args, defaultParams),
                },
                Wrapper._magic_class_options,
            )
            newWrapper.prototype = bindWrapper.prototype
            Object.defineProperty(newWrapper, 'name', {
                value: ctor.name,
                configurable: true,
            })
            return newWrapper
        }
        function Wrapper(this: any, ...args: any[]) {
            if (!new.target) {
                // 函数调用方式
                return createCallWrapper(Wrapper, ...arguments)
            }
            //@ts-expect-error
            const isMagicing: boolean = new.target._magicing ?? false
            let instance: any
            // @ts-expect-error
            const finalArgs = new.target._magicing ? args : handleParameters(args, defaultParams)

            try {
                if (typeof onBeforeInstance === 'function' && !isMagicing) {
                    const result = onBeforeInstance(
                        new.target as unknown as BaseClass,
                        finalArgs as any,
                    )
                    if (result === false) {
                        throw new Error('createMagicClass is blocked by onBeforeInstance hook')
                    } else if (isClass(result)) {
                        // 替换构造函数
                        instance = Reflect.construct(result as unknown as T, finalArgs)
                    } else if (result !== undefined) {
                        instance = result
                    }
                }

                if (!instance) {
                    // 创建实例
                    // @ts-expect-error
                    new.target._magicing = true
                    instance = Reflect.construct(ctor, finalArgs, new.target)
                }

                // 调用onAfterInstance钩子
                if (typeof onAfterInstance === 'function' && !isMagicing) {
                    onAfterInstance(instance)
                }
                return instance
            } catch (e: any) {
                if (typeof onErrorInstance === 'function' && !isMagicing) {
                    onErrorInstance(e, new.target as unknown as BaseClass, finalArgs)
                }
                throw e // 重新抛出错误，确保错误能够传播
            } finally {
                // @ts-expect-error
                new.target._magicing = false
            }
        }
        Wrapper.prototype = ctor.prototype
        Object.defineProperty(Wrapper, 'name', {
            value: ctor.name,
            configurable: true,
        })
        return Wrapper as unknown as T
    }
    return makeInheritable(
        classBase as unknown as any,
    ) as unknown as MagicClassConstructor<BaseClass>
}
