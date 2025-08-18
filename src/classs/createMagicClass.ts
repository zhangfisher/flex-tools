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
    Args  extends any[] = ConstructorParameters<Base>
> {
    /** 作为构造函数使用，创建基础类的实例 */
    new (...args: Args): InstanceType<Base>
    /** 作为函数调用，配置选项并返回配置后的构造函数 */
    <RefactorArgs extends any[] = ConstructorParameters<Base> >(
        ...args: ConstructorParameters<Base>): MagicClassConstructor<Base,RefactorArgs>
    <RefactorArgs extends any[] = ConstructorParameters<Base> >(
        createOptions:CreateMagicClassOptions<Base>): MagicClassConstructor<Base,RefactorArgs>    
    (): MagicClassConstructor<Base>
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
    // 处理类构造参数
    params?:  Params | ((params: Params,scopeParms:Params ) => Params)
    /** 实例创建前的钩子函数，可以阻止实例创建或修改类 */
    onBeforeInstance?: (cls: Base, params: Params) => void | boolean | object
    /** 实例创建后的钩子函数 */
    onAfterInstance?: (inst: InstanceType<Base>) => void
    /** 实例创建出错时的钩子函数 */
    onErrorInstance?: (error: Error, cls: Base) => void
}

export type MagicClassScope = CreateMagicClassOptions<any> & {
    __MAGIC_CLASS_SCOPE: boolean
    finalParams:any[]
}

function isMagicClassOptions(args:any[]):boolean {
    if(args.length!==1) return false
    const params = args[0] as CreateMagicClassOptions<any>
    return typeof(params)=='object' && (
        'params' in params 
        || 'onBeforeInstance' in params 
        || 'onAfterInstance' in params 
        || 'onErrorInstance' in params
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
export function createMagicClass<BaseClass extends Class>(classBase: BaseClass, options?: CreateMagicClassOptions<BaseClass>) {
    type Params = ConstructorParameters<BaseClass>
    const { params,onBeforeInstance,onAfterInstance,onErrorInstance } = Object.assign({
        
    },options)

    const defaultParams = Array.isArray(params) ? params : undefined

    // 默认的参数合并方式
    const defaultHandleParams =   (params:Params,scopeParms:Params | undefined):Params=>{
        return params.map((param,i)=>{
            if(isPlainObject(param)){
                return Object.assign({},scopeParms?.[i],param)
            }else{
                return param || scopeParms?.[i] || defaultParams?.[i] 
            }
        }) as Params
    }

    const handleParameters = (typeof params === 'function' ? options?.params : defaultHandleParams) as Function

    function getClassScope(this:any,args:any[]){
        const isMagicOptions = isMagicClassOptions(args)
        const scope:MagicClassScope = Object.assign({          
            __MAGIC_CLASS_SCOPE:false, 
            finalParams:[]
        },isMagicOptions ? args[0] : undefined) 

        if(isMagicOptions){
            scope.__MAGIC_CLASS_SCOPE = true
            return scope
        }else{
            // @ts-ignore
            const hasMagicScope = args.length > 0 ? (typeof (args[0])==='object' && args[0].__MAGIC_CLASS_SCOPE) : false
            if(hasMagicScope){
                Object.assign(scope,args[0])
                const scopeParams = args[0].finalParams
                const params = args.slice(1) as Params
                const handleScopeParams = typeof args[0].params==='function' ? args[0].params : handleParameters
                const finalParams = handleScopeParams.call(this,params,scopeParams)                       
                scope.finalParams = finalParams
                scope.__MAGIC_CLASS_SCOPE = true
            }else{
                scope.finalParams = args as Params
            }
        }
        return scope

        // const scopeParams = (hasMagicScope ? args[0] : defaultParams || []) as Params
        // const params = (hasMagicScope ? args.slice(1) : args) as Params
        // const finalParams = handleParameters.call(this,params,scopeParams)    

        // return [finalParams,params,scopeParams] 
        // }
        // return scope
        // 检查参数中第一个参数是否是MagicClassScope

                    
       


        // const hasMagicScope = args.length > 0 ? (Array.isArray(args[0]) && args[0].__MAGIC_CLASS_SCOPE) : false
        // const scopeParams = (hasMagicScope ? args[0] : defaultParams || []) as Params
        // const params = (hasMagicScope ? args.slice(1) : args) as Params
        // const finalParams = handleParameters.call(this,params,scopeParams)
        // return [finalParams,params,scopeParams] 


    }
    function makeInheritable<T extends Function>(ctor: T): T {
        function createCallWrapper(Wrapper:any,...args: any[]){
            const bindWrapper =  Wrapper.bind(null)                
            bindWrapper.prototype = Wrapper.prototype      
            const  scope = getClassScope.call(bindWrapper,args)    
            const newWrapper = function(this: any, ...args: Params) { 
                const newArgs = (scope.__MAGIC_CLASS_SCOPE ? [scope,...args] : args) as Params
                if (!new.target) {
                    return createCallWrapper(bindWrapper,...newArgs)
                }                
                return new Wrapper(...newArgs)
            }
            newWrapper.prototype = Wrapper.prototype  
            Object.defineProperty(newWrapper, 'name', {
                value: ctor.name,
                configurable: true,
            })
            return newWrapper
        }
        function Wrapper(this: any,...args: any[]) {
            if (!new.target) { // 函数调用方式
                return createCallWrapper(Wrapper,...arguments)  
            }
            const scope  = getClassScope.call(new.target,args)
            let instance: any
            try {
                // 调用onBeforeInstance钩子
                if (typeof onBeforeInstance === 'function') {
                    const result = onBeforeInstance(
                        new.target as unknown as BaseClass,
                        scope.finalParams as any
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
                    instance = Reflect.construct(ctor,scope.finalParams, new.target)
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
 