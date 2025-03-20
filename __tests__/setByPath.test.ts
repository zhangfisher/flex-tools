// e:/Work/Code/sources/flex-tools/__tests__/object.test.ts
import { test, expect, describe } from "vitest";
import { setByPath } from "../src/object/setByPath";
import { getByPath } from "../src/object/getByPath";

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
    
    test("setByPath",() => {
        const obj = {
            a:{
                b1:{b11:1,b12:2},
                b2:{b21:1,b22:2},
                b3:[
                    {b31:1,b32:2},
                    {b31:1,b32:2}
                ]            
            },
            x:1,
            y:[1,2,3,4,5,{m:1,n:2}],
            z:[1,2,3,new Set([1,2,3,4,5]),[1,[2,2,2,],2,4]]
        }            
        expect(getByPath(setByPath(obj,"a.b1.b11",2),"a.b1.b11")).toEqual(2)
        expect(getByPath(setByPath(obj,"a.b3.0.b31",22),"a.b3.0.b31")).toEqual(22)
        expect(getByPath(setByPath(obj,"a.b3.1.b31",33),"a.b3.1.b31")).toEqual(33)
        expect(getByPath(setByPath(obj,"a.b3.1.b32",44),"a.b3.1.b32")).toEqual(44)
        expect(getByPath(setByPath(obj,"a.b3.1.b31",55),"a.b3.1.b31")).toEqual(55)
        expect(getByPath(setByPath(obj,"a.b3.1.b32",55),"a.b3.1.b32")).toEqual(55)
        expect(getByPath(setByPath(obj,"x",2),"x")).toEqual(2)
        expect(getByPath(setByPath(obj,"y.0",3),"y.0")).toEqual(3)
        expect(getByPath(setByPath(obj,"y.1",4),"y.1")).toEqual(4)
        expect(getByPath(setByPath(obj,"y.5.m",5),"y.5.m")).toEqual(5)
        expect(getByPath(setByPath(obj,"y.5.n",6),"y.5.n")).toEqual(6) 
        // 设置不存的属性
        expect(getByPath(setByPath(obj,"X",2),"X")).toEqual(2)
        expect(getByPath(setByPath(obj,"X",3),"X")).toEqual(3)
        expect(getByPath(setByPath(obj,"y",3),"X")).toEqual(3)
        expect(getByPath(setByPath(obj,"XX.Y",2),"XX.Y")).toEqual(2)
        expect(getByPath(setByPath(obj,"XX.YY.Z",2),"XX.YY.Z")).toEqual(2)
    })
});
