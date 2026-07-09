import { replaceVars } from '../string/replaceVars';
import { getNow } from "./getNow"

/**
 * 日志记录器接口
 *
 * 提供 debug / info / warn / error 四个级别的日志方法，
 * 每个方法接收一条消息（或 Error）与可变参数列表。
 */
export type ILogger = {
    debug: (message: string | Error, ...args: any[]) => void;
    info: (message: string | Error, ...args: any[]) => void;
    warn: (message: string | Error, ...args: any[]) => void;
    error: (message: string | Error, ...args: any[]) => void;
};

export type ILoggerOptions = {
    template?: string
    debug?: boolean,
    vars?:Record<string,any>  
    colorized?:boolean
}

const levelNames=['DEBUG','INFO','WARN', 'ERROR']
const levelColors=['\x1b[2m','','\x1b[1m\x1b[33m', '\x1b[1m\x1b[31m']
/**
 * 创建一个日志记录器。
 *
 * @param options.debug 是否开启调试模式（输出 debug / info 级别日志）
 * @returns 符合 {@link ILogger} 的日志记录器
 */
export function createLogger(options?:ILoggerOptions): ILogger {
    const { debug,template,vars,colorized  } = Object.assign({
        debug:false,
        template:'[{level}] {time} - {message}',
        colorized:true
    },options)
    
    /**
     * 为指定级别构建日志方法。
     *
     * @param levelName 日志级别
     * @param output 底层输出函数（对应 console 的某个方法）
     */
    function createLog(levelName: keyof ILogger, output: (message:string) => void) {
        return (message: string | Error, ...args: any[]) => {
            let levelIndex = debug ? 0 : levelNames.findIndex((v)=>v.toLowerCase()===levelName) 
            if(levelIndex<0) levelIndex= 0
            if(levelIndex>3) levelIndex=3
            const color =colorized ? levelColors[levelIndex] : ''            
            const msg = replaceVars(message instanceof Error ? message.message: message,args,{
                forEach:(_,value)=>{
                    if(colorized){
                        return `\x1b[36m ${value} \x1b[0m${color}`
                    }                    
                }
            })            
            let lName = levelNames[levelIndex].padEnd(5)
            let result = replaceVars(template,{
                message:msg,
                time: getNow(),                
                level:lName,
                ...vars || {}
            })
            if(levelName==='debug') result=`${color}${result}\x1b[0m`
            if(levelName==='warn') result=`${color}${result}\x1b[0m`
            if(levelName==='error') result=`${color}${result}\x1b[0m`
            output(result)  
        };
    }
    return {
        debug: createLog("debug", console.debug),
        info: createLog("info", console.info),
        warn: createLog("warn", console.warn),
        error: createLog("error", console.error)
    };
}

/**
 * 使用示例：
 *
 * ```ts
 * // 1. 默认日志（模板: [{level}] {time} - {message}）
 * const logger = createLogger();
 * logger.info("服务启动");                        // [INFO ] <时间> - 服务启动
 * logger.warn("内存偏高");                        // [WARN ] <时间> - 内存偏高
 *
 * // 2. 剩余参数做位置插值
 * logger.info("用户={},数量={}", "alice", 3);      // [INFO ] <时间> - 用户=alice,数量=3
 *
 * // 3. 直接传入 Error，自动取其 message
 * logger.error(new Error("数据库连接失败"));        // [ERROR] <时间> - 数据库连接失败
 *
 * // 4. 自定义模板与上下文变量 vars
 * createLogger({
 *     template: "[{app}]{level} {message}",
 *     vars: { app: "api" },
 * }).info("请求完成");                            // [api]INFO  请求完成
 *
 * // 5. debug 模式：所有级别统一标记为 DEBUG
 * createLogger({ debug: true }).warn("调试信息");  // [DEBUG] <时间> - 调试信息
 * ```
 */

//  const logger = createLogger();
 
// logger.info("用户={},数量={}", "alice", 3);      // [INFO ] <时间> - 用户=alice,数量=3



// logger.debug("开发调试开关");                        // [INFO ] <时间> - 服务启动
// logger.info("111服务启动1{}1",1);                        // [INFO ] <时间> - 服务启动
// logger.warn("内存{value}偏高",{value:"12"});                        // [WARN ] <时间> - 内存偏高

// // 2. 剩余参数做位置插值

// // 3. 直接传入 Error，自动取其 message
// logger.error(new Error("数据库连接失败"));        // [ERROR] <时间> - 数据库连接失败

// // 4. 自定义模板与上下文变量 vars
// createLogger({
//     template: "[{app}]{level} {message}",
//     vars: { app: "api" },
// }).info("请求完成");                            // [api]INFO  请求完成

// // 5. debug 模式：所有级别统一标记为 DEBUG
// createLogger({ debug: true }).warn("调试信息");  // [DEBUG] <时间> - 调试信息