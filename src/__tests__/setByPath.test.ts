// e:/Work/Code/sources/flex-tools/__tests__/object.test.ts
import { test, expect, describe } from "vitest";
import { setByPath } from "../object/setByPath";

describe("setByPath", () => {
    // 测试基本功能
    test("should set value by path in a plain object", () => {
        const obj = { a: { b: { c: 1 } } };
        const result = setByPath(obj, "a.b.c", 2);
        expect(result.a.b.c).toBe(2);
    });

    // 测试数组索引
    test("should set value by array index path", () => {
        const obj = { a: [1, 2, { b: 3 }] };
        const result = setByPath(obj, "a.2.b", 4);
        // @ts-ignore
        expect(result.a[2].b).toBe(4);
    });

    // 测试无效数组索引
    test("should throw error for invalid array index", () => {
        const obj = { a: [1, 2, 3] };
        expect(() => setByPath(obj, "a.5", 4)).toThrow("setByPath: invalid array index a.5");
    });
 


    // 测试默认值推断
    test("should infer default value when path does not exist", () => {
        const obj = {};
        const result = setByPath(obj, "a.b.c", 1, { infer: () => ({ c: 1 }) });
        // @ts-ignore
        expect(result.a.b.c).toBe(1);
    });

    // 测试参数验证
    test("should return original object if obj is not provided", () => {
        const result = setByPath(undefined, "a", 2);
        expect(result).toBe(undefined);
    });

    test("should return original object if path is not a string", () => {
        const obj = { a: 1 };
        const result = setByPath(obj, 123 as any, 2);
        expect(result).toBe(obj);
    });

    // 测试空路径
    test("should return original object if path is empty", () => {
        const obj = { a: 1 };
        const result = setByPath(obj, "", 2);
        expect(result).toBe(obj);
    }); 
    test("should return empty object", () => {
        const obj = { };
        const result = setByPath(obj, "a.b.c.d", 2);
        expect(result).toEqual({a: {b: {c: {d: 2}}}});
    }); 
});
