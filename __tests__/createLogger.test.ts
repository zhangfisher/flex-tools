// oxlint-disable no-unused-vars
import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { createLogger } from "../src/misc/logger";

// bun:test 未提供全局 restoreAllMocks，需逐个 spy 调用 mockRestore
const spies: Array<{ mockRestore: () => void }> = [];

/**
 * 监听指定 console 方法并抑制其原始输出（避免污染测试输出），
 * 同时登记到全局列表，供 afterEach 统一恢复。
 */
function spyConsole(method: "debug" | "info" | "warn" | "error") {
    const spy = spyOn(console, method).mockImplementation(() => {});
    spies.push(spy);
    return spy;
}

// 每个用例后恢复 console 原始实现，避免 spy 污染后续用例与测试输出
afterEach(() => {
    while (spies.length) spies.pop()!.mockRestore();
});

describe("createLogger - 返回值结构", () => {
    test("应返回包含 debug/info/warn/error 四个方法的对象", () => {
        const logger = createLogger();
        expect(typeof logger.debug).toBe("function");
        expect(typeof logger.info).toBe("function");
        expect(typeof logger.warn).toBe("function");
        expect(typeof logger.error).toBe("function");
    });
});

describe("createLogger - 默认模板与级别", () => {
    test("info 应使用默认模板并通过 console.info 输出", () => {
        const spy = spyConsole("info");
        const logger = createLogger();
        logger.info("hello world");
        expect(spy).toHaveBeenCalledTimes(1);
        // 默认模板: [{level}] {timestamp} - {message}
        // INFO 经 padEnd(5) 后为 'INFO '（尾部补一个空格）
        expect(spy).toHaveBeenCalledWith(
            expect.stringMatching(/^\[INFO \] .+ - hello world$/),
        );
    });

    test.each([
        ["debug", "DEBUG"],
        ["info", "INFO "],
        ["warn", "WARN "],
        ["error", "ERROR"],
    ] as const)("默认模式下 %s() 应输出级别标签 [%s]", (method, label) => {
        const spy = spyConsole(method);
        const logger = createLogger();        
        logger[method]("msg");
        expect(spy).toHaveBeenCalledWith(expect.stringContaining(`[${label}]`));
    });

    test("每个日志方法应调用对应的 console 方法", () => {
        const debugSpy = spyConsole("debug");
        const infoSpy = spyConsole("info");
        const warnSpy = spyConsole("warn");
        const errorSpy = spyConsole("error");

        const logger = createLogger();
        logger.debug("d");
        logger.info("i");
        logger.warn("w");
        logger.error("e");

        expect(debugSpy).toHaveBeenCalledTimes(1);
        expect(infoSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });
});

describe("createLogger - debug 模式", () => {
    test("debug=true 时所有级别都应标记为 DEBUG", () => {
        const errorSpy = spyConsole("error");
        const warnSpy = spyConsole("warn");

        const logger = createLogger({ debug: true });
        logger.error("msg");
        logger.warn("msg");

        expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("[DEBUG]"));
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("[DEBUG]"));
    });
});

describe("createLogger - 消息与插值", () => {
    test("传入 Error 时应使用 error.message 作为消息内容", () => {
        const spy = spyConsole("error");
        const logger = createLogger();
        logger.error(new Error("boom"));
        expect(spy).toHaveBeenCalledWith(expect.stringContaining("- boom"));
    });

    test("应通过剩余参数对消息进行位置插值", () => {
        const spy = spyConsole("info");
        // 关闭彩色高亮，避免 ANSI 码干扰插值内容的精确断言
        const logger = createLogger({ colorized: false });
        logger.info("user={},age={}", "alice", 18);
        expect(spy).toHaveBeenCalledWith(
            expect.stringContaining("- user=alice,age=18"),
        );
    });
});

describe("createLogger - 自定义配置", () => {
    test("应支持自定义 template", () => {
        const spy = spyConsole("info");
        const logger = createLogger({ template: "{level}|{message}" });
        logger.info("hi");
        expect(spy).toHaveBeenCalledWith("INFO |hi");
    });

    test("应支持通过 vars 向模板注入自定义变量", () => {
        const spy = spyConsole("info");
        const logger = createLogger({
            template: "[{app}]{level} {message}",
            vars: { app: "myapp" },
        });
        logger.info("hi");
        // app=myapp，level=INFO (padEnd 5)，message=hi
        expect(spy).toHaveBeenCalledWith("[myapp]INFO  hi");
    });

    test("vars 中的同名变量应覆盖内置变量", () => {
        const spy = spyConsole("info");
        const logger = createLogger({
            template: "{level}|{message}",
            vars: { level: "CUSTOM" },
        });
        logger.info("hi");
        // vars.level 覆盖了内置 level（不再 padEnd）
        expect(spy).toHaveBeenCalledWith("CUSTOM|hi");
    });
});

describe("createLogger - 彩色输出 colorized", () => {
    test("默认(colorized=true)时应为插值变量添加 ANSI 青色高亮", () => {
        const spy = spyConsole("info");
        const logger = createLogger();
        logger.info("user={}", "alice");
        // 插值变量被 \x1b[36m ... \x1b[0m 包裹
        expect(spy).toHaveBeenCalledWith(expect.stringContaining("\x1b[36m"));
    });

    test("colorized=false 时输出不应包含任何 ANSI 颜色码", () => {
        const spy = spyConsole("info");
        const logger = createLogger({ colorized: false });
        logger.info("user={}", "alice");
        const output = spy.mock.calls[0][0] as string;
        expect(output).not.toContain("\x1b");
    });
});
