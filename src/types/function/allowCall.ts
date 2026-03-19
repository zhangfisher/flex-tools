import { IsMatchingOverload } from "./isMatchingOverload";
import { Overloads } from "./overloads";

// 获取函数的所有重载签名
export type AllowCall<F extends (...args: any) => any, Args extends any[] = []> =
    Overloads<F> extends infer Overloads
        ? Overloads extends any[]
            ? IsMatchingOverload<Overloads, Args> extends true
                ? true
                : false
            : Args extends Parameters<F>
              ? true
              : false
        : never;

// /**
//  * 高级版本：尝试提取并实例化对象参数中的泛型类型
//  * 适用于特定的结构化参数模式
//  */
// type ExtractGenericFromObject<F, Args extends any[]> = F extends (
//     msg: { type: infer T; payload: infer P },
//     ...rest: infer Rest
// ) => infer R
//     ? Args extends [{ type: infer ArgT; payload: infer ArgP }, ...infer _RestArgs]
//         ? ArgT extends T
//             ? (...args: Args) => R
//             : F
//         : F
//     : F;

// import { MutableMessage } from "../MutableMessage";

// interface Events {
//     a: 1;
//     b: 2;
//     c: 3;
// }

// // // 带有可选参数的测试函数
// function test<T extends string = string>(
//     type: Extract<MutableMessage<Events>, { type: T }>["type"],
//     payload: Extract<MutableMessage<Events>, { type: T }>["payload"],
// ): any;
// function test(vip: boolean): any;
// function test(name: string, age?: number): any;
// function test(): any {}

// type sss = Extract<MutableMessage<Events>, { type: "a" }>;
// // type t6 = AllowCall<typeof test, ["Tom"]>; // true
// // type t7 = AllowCall<typeof test, ["Tom", 18]>; // true
// // type t8 = AllowCall<typeof test, ["Tom", 18, true]>; // false
// // type t9 = AllowCall<typeof test, [true]>; // false
// // type t9 = AllowCall<typeof test, [true]>; // false
// type t1 = AllowCall<typeof test, [{ type: "a"; payload: "ddd" }]>; // false
// type t2 = AllowCall<typeof test, [{ type: "a"; payload: "ddd" }]>; // false
// type r1 = GetMatchingOverload<Overloads<typeof test>, [{ type: "a"; payload: 1 }]>; // false

// test("a", 2);
