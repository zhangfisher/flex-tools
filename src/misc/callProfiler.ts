/**
 * 用于标记已封装对象的 Symbol
 */
// 存储 包装方法 -> context 的映射
const METHOD_CONTEXT_MAP = new WeakMap<Function, ProfilerContext>();
// 存储 对象 -> { 原始方法映射, 是否已包装 } 的映射
const ORIGINAL_METHODS_MAP = new WeakMap<object, Map<string, Function>>();

/**
 * 获取高精度时间戳（跨平台）
 * 在浏览器和 Node.js 环境中都可用
 */
function getHighPrecisionTime(): number {
    // 优先使用 performance API（浏览器和 Node.js 8+）
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        return performance.now();
    }
    // 兜底方案：使用 Date.now()
    return Date.now();
}

/**
 * 已封装对象的 WeakMap，用于跟踪包装状态
 */
const wrappedObjects = new WeakMap<object, Set<string>>();

/**
 * 调用分析器选项
 */
export interface CallProfilerOptions {
    /** 预热次数（默认 5） */
    warmup?: number;
    /** 执行次数（默认 100） */
    executionCount?: number;
    /** 是否自动附加（默认 true） */
    autoAttach?: boolean;
}

/**
 * 树形结构的调用分析节点（report 中的每个元素）
 */
export interface CallProfileNode {
    /** 唯一标识符 */
    id: number;
    /** 被调用的方法名 */
    callee: string;
    /** 调用深度（0表示顶层调用） */
    depth: number;
    /** 调用者方法名 */
    caller?: string;
    /** 调用者所在文件和行号（如 "file.js:123"） */
    file?: string;
    /** 平均执行时长（毫秒） */
    duration: number;
    /** 最大执行时长（毫秒） */
    max: number;
    /** 最小执行时长（毫秒） */
    min: number;
    /** 子调用列表 */
    children: CallProfileNode[];
}

/**
 * 内部使用的平面调用分析结果
 */
interface FlatCallProfile {
    id: number;
    callee: string;
    parentId: number | null; // 内部使用，构建树时需要
    depth: number;
    caller?: string;
    file?: string;
    duration: number;
    /** 最大执行时长（毫秒） */
    max: number;
    /** 最小执行时长（毫秒） */
    min: number;
}

/**
 * 调用分析器类
 */
export class CallProfiler {
    // Context 字段直接展开为类字段
    private callStack: CallStackItem[] = [];
    private flatResults: FlatCallProfile[] = [];
    private enabledValue: { value: boolean } = { value: false };

    callRecords: FlatCallProfile[] = [];
    private _duration: number = 0;
    private _max: number = 0;
    private _min: number = 0;
    private objectMethodPairs: [object, string[]][];
    private useObjectPrefix: boolean;
    private isBound: boolean = false;
    private _timeConsuming: { avg: number; max: number; min: number } = {
        avg: 0,
        max: 0,
        min: 0,
    };
    /**
     * 单对象重载：简化单对象场景的 API
     * @param obj 要测量的对象
     * @param methods 需要测量的方法名数组
     * @param options 选项
     */
    constructor(obj: object, methods: string[], options?: CallProfilerOptions);

    /**
     * 通用构造函数：支持单对象和多对象场景
     * @param objOrObjs 单个对象、对象数组、或元组数组
     * @param options 选项（methods 通过元组语法传递）
     */
    constructor(
        objOrObjs: object | ([object, string[]?] | object)[],
        options?: CallProfilerOptions,
    );

    constructor(
        objOrObjs: object | ([object, string[]?] | object)[],
        methodsOrOptions?: string[] | CallProfilerOptions,
        options?: CallProfilerOptions,
    ) {
        // 判断调用的是哪个重载
        const isSingleObjectOverload =
            typeof methodsOrOptions === "object" && Array.isArray(methodsOrOptions);
        const { autoAttach = true } = isSingleObjectOverload
            ? (options as CallProfilerOptions) || {}
            : (methodsOrOptions as CallProfilerOptions) || {};

        if (isSingleObjectOverload) {
            // 单对象重载：new CallProfiler(obj, ['method1'], options)
            this.objectMethodPairs = [[objOrObjs as object, methodsOrOptions as string[]]];
            this.useObjectPrefix = false; // 单对象不添加前缀
        } else {
            // 通用构造函数：new CallProfiler([[obj, ['method1']]], options)
            this.objectMethodPairs = parseInputToMethodPairs(objOrObjs, undefined);
            const isArray = Array.isArray(objOrObjs);
            const inputType = detectInputType(objOrObjs, isArray);
            this.useObjectPrefix =
                isArray &&
                (inputType === InputType.TupleArray || inputType === InputType.ObjectArray) &&
                objOrObjs.length > 1;
        }

        // 自动附加
        if (autoAttach) {
            this.attach();
        }
    }

    /**
     * 是否启用测量
     */
    get enabled(): boolean {
        return this.enabledValue.value;
    }

    set enabled(value: boolean) {
        this.enabledValue.value = value;
    }

    /**
     * 平均执行时长（毫秒）
     */
    get timeConsuming() {
        return this._timeConsuming;
    }

    /**
     * 调用结果列表（树形结构，根节点数组）
     */
    get report(): CallProfileNode[] {
        return buildTree(this.callRecords);
    }

    /**
     * 运行测量
     */
    async run(
        callback: () => void | Promise<void>,
        options: CallProfilerOptions = {},
    ): Promise<void> {
        const { warmup: warmupCount = 5, executionCount = 100 } = options;

        // 每次运行前清空数据
        this.clear();

        // 预热阶段
        for (let i = 0; i < warmupCount; i++) {
            await callback();
        }

        // 清空调用栈和结果
        this.callStack.length = 0;
        this.flatResults.length = 0;
        idCounter = 0;

        // 启用测量
        this.enabledValue.value = true;

        // 测量阶段 - 收集每次执行的 flatResults
        const allFlatResults: FlatCallProfile[][] = [];
        const durations: number[] = [];

        for (let i = 0; i < executionCount; i++) {
            // 清空调用栈，但保持ID计数器不变，确保每次执行的ID一致
            this.callStack.length = 0;
            const startId = idCounter + 1;

            const startTime = getHighPrecisionTime();
            await callback();
            const endTime = performance.now();

            const duration = endTime - startTime;
            durations.push(duration);

            // 保存这次执行的 flatResults 副本
            const copy = [...this.flatResults];
            allFlatResults.push(copy);

            // 清空调用栈和结果，准备下一次执行
            this.flatResults.length = 0;
            idCounter = startId;
        }

        // 禁用测量
        this.enabledValue.value = false;

        // 合并所有 flatResults
        this.callRecords = this.mergeFlatResults(allFlatResults);

        // 计算整体统计数据
        const sum = durations.reduce((a, b) => a + b, 0);
        this._timeConsuming.avg = sum / durations.length;
        this._timeConsuming.max = Math.max(...durations);
        this._timeConsuming.min = Math.min(...durations);
    }

    /**
     * 获取指定方法的所有调用
     */
    getCalls(methodName: string): CallProfileNode[] {
        const tree = this.report;
        // 递归查找所有匹配的节点
        const findCalls = (nodes: CallProfileNode[]): CallProfileNode[] => {
            const result: CallProfileNode[] = [];
            for (const node of nodes) {
                if (node.callee === methodName) {
                    result.push(node);
                }
                if (node.children.length > 0) {
                    result.push(...findCalls(node.children));
                }
            }
            return result;
        };

        return findCalls(tree);
    }

    /**
     * 将结果渲染为树形字符串（用于终端输出）
     */
    render(): string {
        const tree = this.report;
        return renderTree(tree);
    }

    /**
     * 清空测量结果
     */
    clear(): void {
        this.flatResults.length = 0;
        this.callRecords = [];
        this._duration = 0;
        this._max = 0;
        this._min = 0;
    }

    /**
     * 分离 - 移除对对象方法的包装，恢复原始方法
     */
    detach(): void {
        if (!this.isBound) {
            return; // 已经解绑，直接返回
        }

        for (const [obj, methods] of this.objectMethodPairs) {
            const originalMethods = ORIGINAL_METHODS_MAP.get(obj);
            if (!originalMethods) continue;

            for (const methodName of methods) {
                const methodNameStr = String(methodName);
                const originalMethod = originalMethods.get(methodNameStr);
                if (originalMethod) {
                    (obj as any)[methodNameStr] = originalMethod;
                }
            }

            // 清除包装方法记录
            const wrappedMethods = wrappedObjects.get(obj);
            if (wrappedMethods) {
                for (const methodName of methods) {
                    wrappedMethods.delete(String(methodName));
                }
            }
        }

        // 禁用测量
        this.enabled = false;
        this.isBound = false;
    }

    /**
     * 附加 - 重新包装对象方法
     */
    attach(): void {
        // 创建 context 对象传递给包装函数
        const context = {
            callStack: this.callStack,
            flatResults: this.flatResults,
            enabled: this.enabledValue,
        };

        // 重新包装所有对象的方法
        wrapAllObjectMethods(this.objectMethodPairs, context, this.useObjectPrefix);

        // 启用测量
        this.enabled = true;
        this.isBound = true;
    }

    /**
     * 合并多次执行的 flatResults
     */
    private mergeFlatResults(allFlatResults: FlatCallProfile[][]): FlatCallProfile[] {
        if (allFlatResults.length === 0) return [];

        // 按 id 分组收集所有节点的 duration
        const durationGroups = new Map<number, number[]>();

        for (const flatResults of allFlatResults) {
            for (const node of flatResults) {
                if (!durationGroups.has(node.id)) {
                    durationGroups.set(node.id, []);
                }
                durationGroups.get(node.id)!.push(node.duration);
            }
        }

        // 使用第一份 flatResults 作为模板，计算统计值
        const template = allFlatResults[0];
        const merged: FlatCallProfile[] = [];

        for (const node of template) {
            const durations = durationGroups.get(node.id)!;
            const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
            const max = Math.max(...durations);
            const min = Math.min(...durations);

            merged.push({
                ...node,
                duration: avg,
                max,
                min,
            });
        }

        return merged;
    }
}

/**
 * 全局调用栈，用于追踪调用关系
 */
interface CallStackItem {
    id: number;
    methodName: string;
    depth: number;
}

/**
 * ID 生成器（全局递增纯数字）
 */
let idCounter = 0;
function generateId(): number {
    return ++idCounter;
}

/**
 * 解析栈信息，提取方法名和文件路径
 */
function parseStackTrace(stackLine: string | undefined): { caller?: string; file?: string } {
    if (!stackLine) return {};

    const trimmed = stackLine.trim();
    if (!trimmed) return {};

    // 栈信息格式: "at methodName (path/to/file:line:col)" 或 "at path/to/file:line:col"
    const methodNameMatch = trimmed.match(/at\s+(\w+)\s+\(([^)]+)\)/);
    const fileOnlyMatch = trimmed.match(/at\s+([^:]+:\d+:\d+)/);

    if (methodNameMatch) {
        // 格式: "at methodName (path/to/file:line:col)"
        const caller = methodNameMatch[1];
        const fileAndLine = methodNameMatch[2];
        // 提取文件路径和行号，去掉列号
        const file = fileAndLine.replace(/:\d+$/, "");
        return { caller, file };
    } else if (fileOnlyMatch) {
        // 格式: "at path/to/file:line:col" (没有方法名)
        const fileAndLine = fileOnlyMatch[1];
        const file = fileAndLine.replace(/:\d+$/, "");
        return { file };
    }

    return {};
}

/**
 * 为方法添加测量行为（支持调用树追踪）
 */
function measureMethod(
    target: Function,
    context: ProfilerContext,
    objectPrefix?: string,
): Function {
    const original = target;
    const name = target.name;
    const fullName = objectPrefix ? `${objectPrefix}:${name}` : name;

    // 创建包装函数
    const wrapped = function (this: any, ...args: any) {
        // 直接使用闭包中的 context
        const { enabled, callStack, flatResults } = context;

        // 如果未启用测量，直接执行原方法
        if (!enabled.value) {
            return original.apply(this, args);
        }

        const id = generateId();

        // 获取父调用信息
        const parentItem = callStack.length > 0 ? callStack[callStack.length - 1] : null;
        const depth = parentItem ? parentItem.depth + 1 : 0;
        const parentId = parentItem ? parentItem.id : null;

        // 将当前调用压入栈
        const currentItem: CallStackItem = { id, methodName: fullName, depth };
        callStack.push(currentItem);

        // 获取调用者信息（从调用栈中提取）
        const stack = new Error().stack;
        const stackLines = stack?.split("\n") || [];
        // 找到第一个不是我们内部函数的栈帧
        let callerInfo: { caller?: string; file?: string } = {};
        for (let i = 2; i < stackLines.length; i++) {
            const line = stackLines[i]?.trim();
            if (line && !line.includes("callProfiler.ts") && !line.includes("measureMethod")) {
                callerInfo = parseStackTrace(line);
                break;
            }
        }
        const startTime = getHighPrecisionTime();
        // 执行原方法
        const result = original.apply(this, args);

        // 处理异步函数
        if (result && typeof result.then === "function") {
            return result.finally(() => {
                const endTime = getHighPrecisionTime();
                const duration = endTime - startTime;

                // 创建平面结果记录
                const flatResult: FlatCallProfile = {
                    id,
                    callee: fullName,
                    parentId,
                    depth,
                    caller: callerInfo.caller,
                    file: callerInfo.file,
                    duration,
                    max: duration,
                    min: duration,
                };

                flatResults.push(flatResult);
                // 弹出当前调用
                callStack.pop();
            });
        }

        // 同步函数
        const endTime = getHighPrecisionTime();
        const duration = endTime - startTime;

        // 创建平面结果记录
        const flatResult: FlatCallProfile = {
            id,
            callee: fullName,
            parentId,
            depth,
            caller: callerInfo.caller,
            file: callerInfo.file,
            duration,
            max: duration,
            min: duration,
        };

        flatResults.push(flatResult);

        // 弹出当前调用
        callStack.pop();

        return result;
    };

    // 将包装函数和 context 的映射存储到 WeakMap
    METHOD_CONTEXT_MAP.set(wrapped, context);

    return wrapped;
}

/**
 * 将平面结果列表转换为树形结构
 */
function buildTree(flatResults: FlatCallProfile[]): CallProfileNode[] {
    const nodeMap = new Map<number, CallProfileNode>();
    const rootNodes: CallProfileNode[] = [];

    // 创建所有节点
    for (const result of flatResults) {
        const node: CallProfileNode = {
            ...result,
            children: [],
            max: result.duration,
            min: result.duration,
        };
        nodeMap.set(result.id, node);
    }

    // 构建树形结构
    for (const result of flatResults) {
        const node = nodeMap.get(result.id)!;

        if (result.parentId === null) {
            // 顶层节点
            rootNodes.push(node);
        } else {
            // 子节点，添加到父节点的children中
            const parentNode = nodeMap.get(result.parentId);
            if (parentNode) {
                parentNode.children.push(node);
            }
        }
    }

    return rootNodes;
}

/**
 * 将树形节点渲染为字符串
 */
function renderNode(node: CallProfileNode, prefix: string = "", isLast: boolean = true): string {
    const connector = isLast ? "└──" : "├──";
    const durationStr = node.duration.toFixed(2);

    let result = `${prefix}${connector} ${node.callee} (${durationStr}ms)\n`;

    // 处理子节点
    const childPrefix = prefix + (isLast ? "    " : "│   ");
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isLastChild = i === node.children.length - 1;
        result += renderNode(child, childPrefix, isLastChild);
    }

    return result;
}

/**
 * 将树形结构渲染为字符串（用于终端输出）
 */
function renderTree(nodes: CallProfileNode[]): string {
    if (nodes.length === 0) {
        return "(no measurements)\n";
    }

    let result = "";
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isLast = i === nodes.length - 1;
        result += renderNode(node, "", isLast);
    }
    return result;
}

/**
 * 获取对象的名称（用于方法名前缀）
 */
function getObjectName(obj: object): string {
    if (!obj) return "Unknown";

    // 获取构造函数名称
    const constructor = obj.constructor;
    if (constructor && constructor.name) {
        return constructor.name;
    }

    // 兜底：使用对象类型
    const type = typeof obj;
    if (type === "object") {
        return "Object";
    }

    return type;
}

/**
 * 获取对象的所有方法名（排除构造方法、私有方法和访问器）
 */
function getAllMethodNames(obj: object): string[] {
    const methodNames: string[] = [];

    // 获取对象原型链上的所有属性
    const proto = Object.getPrototypeOf(obj);
    const allKeys = new Set([
        ...Object.keys(obj),
        ...Object.getOwnPropertyNames(proto),
        ...Object.keys(proto),
    ]);

    for (const key of allKeys) {
        // 排除构造方法
        if (key === "constructor") continue;

        // 排除以下划线开头的私有方法
        // if (key.startsWith("_")) continue;

        const descriptor =
            Object.getOwnPropertyDescriptor(obj, key) ||
            Object.getOwnPropertyDescriptor(proto, key);

        if (!descriptor) continue;

        // 排除访问器（get/set）
        if (descriptor.get || descriptor.set) continue;

        // 只包含可调用的方法
        const value = (obj as any)[key];
        if (typeof value === "function") {
            methodNames.push(key);
        }
    }

    return methodNames;
}

/**
 * 测量上下文接口
 */
interface ProfilerContext {
    callStack: CallStackItem[];
    flatResults: FlatCallProfile[];
    enabled: { value: boolean };
}

/**
 * 输入类型枚举
 */
enum InputType {
    EmptyArray,
    TupleArray,
    ObjectArray,
    SingleObject,
}

/**
 * 判断输入类型
 */
function detectInputType(
    objOrObjs: object | [object, string[]][] | [object][],
    isArray: boolean,
): InputType {
    if (!isArray) return InputType.SingleObject;

    const arr = objOrObjs as any[];
    if (arr.length === 0) return InputType.EmptyArray;
    if (Array.isArray(arr[0])) return InputType.TupleArray;
    if (typeof arr[0] === "object") return InputType.ObjectArray;

    return InputType.SingleObject;
}

/**
 * 解析输入为统一的对象-方法对格式
 */
function parseInputToMethodPairs(
    objOrObjs: object | [object, string[]][] | [object][],
    methods?: (string | keyof object)[],
): [object, string[]][] {
    const isArray = Array.isArray(objOrObjs);
    const inputType = detectInputType(objOrObjs, isArray);

    switch (inputType) {
        case InputType.EmptyArray:
            return [];

        case InputType.TupleArray:
            // 元组数组语法: createMeasure([[obj1, ['m1', 'm2']], [obj2]])
            const input = objOrObjs as ([object] | [object, string[]])[];
            return input.map(([obj, methods]) => [obj, methods || getAllMethodNames(obj)]);

        case InputType.ObjectArray:
            // 简化语法: createMeasure([obj1, obj2])
            const objs = objOrObjs as object[];
            return objs.map((obj) => [obj, getAllMethodNames(obj)]);

        case InputType.SingleObject:
            // 单对象签名: createMeasure(obj, ['m1', 'm2']) 或 createMeasure(obj)
            const obj = objOrObjs as object;
            const methodsList = methods || getAllMethodNames(obj);
            return [[obj, methodsList]];
    }
}

/**
 * 包装单个对象的方法
 */
function wrapSingleObjectMethods(
    obj: object,
    methods: string[],
    context: ProfilerContext,
    useObjectPrefix: boolean,
): void {
    // 获取或创建该对象的已包装方法集合
    let wrappedMethods = wrappedObjects.get(obj);
    if (!wrappedMethods) {
        wrappedMethods = new Set<string>();
        wrappedObjects.set(obj, wrappedMethods);
    }

    // 获取或创建该对象的原始方法映射
    let originalMethods = ORIGINAL_METHODS_MAP.get(obj);
    if (!originalMethods) {
        originalMethods = new Map<string, Function>();
        ORIGINAL_METHODS_MAP.set(obj, originalMethods);
    }

    // 多对象模式时，使用对象名称作为前缀
    const objectPrefix = useObjectPrefix ? getObjectName(obj) : undefined;

    // 为指定方法包装测量行为
    for (const methodName of methods) {
        const methodNameStr = String(methodName);

        // 如果该方法已经被包装过，跳过
        if (wrappedMethods.has(methodNameStr)) {
            continue;
        }

        const method = (obj as any)[methodName];
        if (typeof method === "function") {
            // 保存原始方法
            originalMethods.set(methodNameStr, method);

            // 创建包装后的方法
            const wrapped = measureMethod(method as Function, context, objectPrefix);
            // 保留方法名
            Object.defineProperty(wrapped, "name", {
                value: methodNameStr,
                configurable: true,
            });
            // 替换原方法
            (obj as any)[methodName] = wrapped;
            // 标记为已包装
            wrappedMethods.add(methodNameStr);
        }
    }
}

/**
 * 包装所有对象的方法
 */
function wrapAllObjectMethods(
    objectMethodPairs: [object, string[]][],
    context: ProfilerContext,
    useObjectPrefix: boolean,
): void {
    for (const [obj, methods] of objectMethodPairs) {
        wrapSingleObjectMethods(obj, methods, context, useObjectPrefix);
    }
}
