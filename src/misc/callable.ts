/**
 * callable 函数的配置选项
 */
export interface CallableOptions<T> {
    /** 指定实例中被调用的方法名称，默认为 'call' */
    callMethod?: keyof T | string;
    /** 指定实例中用于展开和属性访问的数据对象属性名，默认为 'data' */
    dataKey?: keyof T | string;
}

/**
 * 提取方法的函数签名类型
 */
type MethodSignature<T, K extends keyof T | string> = K extends keyof T
    ? T[K] extends (...args: infer A) => infer R
        ? (...args: A) => R
        : never
    : (...args: any[]) => any;

/**
 * 提取 values 属性的类型
 */
type PickDataType<T, V extends keyof T | undefined> = V extends keyof T
    ? T[V] extends Record<string, any>
        ? { [K in keyof T[V]]: T[V][K] }
        : never
    : {};

/**
 * callable 函数 - 将任意实例包装为可调用对象
 * 使用 Proxy 拦截函数调用，this 始终指向原实例
 * 支持对象展开语法 {...callableInstance}
 * 根据 callMethod 自动推断函数签名
 * 根据 values 自动推断可解构的属性类型
 *
 * @param instance 要包装的实例
 * @param options 配置选项
 * @returns 可调用的实例
 */
export function callable<
    T extends Record<string, any>,
    K extends keyof T = "call",
    V extends keyof T = "data",
>(
    instance: T,
    options?: CallableOptions<T> & { callMethod?: K; dataKey?: V },
): T & MethodSignature<T, K> & PickDataType<T, V>;

export function callable<T extends Record<string, any>>(
    instance: T,
    options?: CallableOptions<T>,
): T & { (...args: any[]): any } {
    const { callMethod = "call", dataKey = "data" } = options || {};

    // 创建一个包装函数，这个函数就是可调用的主体
    const wrapper = function (...args: any[]) {
        // 获取调用方法
        const method = (instance as any)[callMethod];
        if (typeof method === "function") {
            // 调用时 this 指向原实例
            return method.apply(instance, args);
        }
        throw new Error(`Method '${String(callMethod)}' not found on instance`);
    };

    // 显式给函数添加属性，避免被 ESLint 识别为纯函数
    (wrapper as any).isCallableObject = true;

    // 使用 Proxy 包装这个函数，拦截属性访问，转发到原实例
    return new Proxy(wrapper, {
        /**
         * 拦截属性访问，data 对象的属性优先于实例属性
         */
        get(_target, prop, receiver) {
            // 先从 data 对象获取属性（优先）
            if (typeof prop === "string") {
                const dataObj = (instance as any)[dataKey];
                if (dataObj && typeof dataObj === "object" && prop in dataObj) {
                    const value = dataObj[prop];
                    return value;
                }
            }

            // 如果 data 对象中没有该属性，从原实例获取
            let value = Reflect.get(instance, prop, receiver);

            // 如果是方法，绑定 this 到原实例
            if (typeof value === "function" && prop !== "constructor" && "bind" in value) {
                return (value as any).bind(instance);
            }

            return value;
        },

        /**
         * 拦截属性设置，转发到原实例
         */
        set(_target, prop, value, receiver) {
            return Reflect.set(instance, prop, value, receiver);
        },

        /**
         * 拦截 in 操作符
         */
        has(_target, prop) {
            return Reflect.has(instance, prop);
        },

        /**
         * 拦截 Object.getOwnPropertyDescriptor()
         * 用于对象展开语法，只返回 data 对象的属性描述符
         * 对于其他属性，返回实际的描述符但标记为不可枚举
         */
        getOwnPropertyDescriptor(target, prop) {
            // 从 data 对象获取属性描述符
            const dataObj = (instance as any)[dataKey];
            if (
                typeof prop === "string" &&
                dataObj &&
                typeof dataObj === "object" &&
                Object.prototype.hasOwnProperty.call(dataObj, prop)
            ) {
                const descriptor = Reflect.getOwnPropertyDescriptor(dataObj, prop);
                if (descriptor) {
                    // 确保是可枚举的
                    descriptor.enumerable = true;
                    return descriptor;
                }
            }

            // 对于函数的固有属性（prototype、name、length 等），返回实际描述符但标记为不可枚举
            const targetDescriptor = Reflect.getOwnPropertyDescriptor(target, prop);
            if (targetDescriptor) {
                // 设置为不可枚举，这样展开时不会包含这些属性
                targetDescriptor.enumerable = false;
                return targetDescriptor;
            }

            // 对于实例的属性，也设置为不可枚举
            const instanceDescriptor = Reflect.getOwnPropertyDescriptor(instance, prop);
            if (instanceDescriptor) {
                instanceDescriptor.enumerable = false;
                return instanceDescriptor;
            }

            return undefined;
        },

        /**
         * 拦截 Object.keys()、Object.getOwnPropertyNames()、for...in 和对象展开
         * 对于对象展开，只返回 data 对象的键和必要的函数固有属性
         */
        ownKeys(target) {
            // 获取 data 对象的键
            const dataObj = (instance as any)[dataKey];
            const valueKeys = dataObj && typeof dataObj === "object" ? Object.keys(dataObj) : [];

            // 只获取函数的必要固有属性（prototype、name、length）
            const necessaryTargetKeys = Reflect.ownKeys(target).filter(
                (key) =>
                    key === "prototype" ||
                    key === "name" ||
                    (typeof key === "string" && key === "length"),
            );

            // 合并去重
            const allKeys = new Set([...valueKeys, ...necessaryTargetKeys]);

            return Array.from(allKeys);
        },

        /**
         * 拦截 getPrototypeOf
         * 用于对象展开和类型检查
         */
        getPrototypeOf(_target) {
            return Reflect.getPrototypeOf(instance);
        },

        /**
         * 拦截 setPrototypeOf
         */
        setPrototypeOf(_target, proto) {
            return Reflect.setPrototypeOf(instance, proto);
        },
    }) as T & { (...args: any[]): any };
}
