/***
 * 
 * 用来获取函数的重载类型
 * 
 *  当一个函数具有多个重载时，我们可以使用 Overloads<T> 来获取函数的重载类型
 * 
 *  例如：
 *  function foo(a: string): string;
 *  function foo(a: number): number;
 *  function foo(a: any): any 
 * 
 * typeof foo只能返回第一个重载的类型 
 * 
 * Overloads<typeof foo> 可以返回所有重载的类型
 *  
 * Overloads<typeof foo>  == (a: string)=>string | (a: number)=>number | (a: any)=>any
 * 
 */


export type Overloads<T> =
T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; (...args: infer A4): infer R4
    (...args: infer A5): infer R5;(...args: infer A6): infer R6
    (...args: infer A7): infer R7;(...args: infer A8): infer R8
  } ?
  (...args: A1) => R1 | ((...args: A2) => R2) | ((...args: A3) => R3) | ((...args: A4) => R4) | ((...args: A5) => R5) | ((...args: A6) => R6) | ((...args: A7) => R7) | ((...args: A8) => R8):  
T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; (...args: infer A4): infer R4
    (...args: infer A5): infer R5;(...args: infer A6): infer R6
    (...args: infer A7): infer R7
  } ?
  (...args: A1) => R1 | ((...args: A2) => R2) | ((...args: A3) => R3) | ((...args: A4) => R4) | ((...args: A5) => R5) | ((...args: A6) => R6) | ((...args: A7) => R7):  
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; (...args: infer A4): infer R4
    (...args: infer A5): infer R5;(...args: infer A6): infer R6
  } ?
  (...args: A1) => R1 | ((...args: A2) => R2) | ((...args: A3) => R3) | ((...args: A4) => R4) | ((...args: A5) => R5) | ((...args: A6) => R6):  
    T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; (...args: infer A4): infer R4
    (...args: infer A5): infer R5
  } ?
  (...args: A1) => R1 | ((...args: A2) => R2) | ((...args: A3) => R3) | ((...args: A4) => R4) | ((...args: A5) => R5):
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3; (...args: infer A4): infer R4
  } ?
  (...args: A1) => R1 | ((...args: A2) => R2) | ((...args: A3) => R3) | ((...args: A4) => R4) :
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2;
    (...args: infer A3): infer R3
  } ?
  ((...args: A1) => R1) | ((...args: A2) => R2) | ((...args: A3) => R3) :
  T extends {
    (...args: infer A1): infer R1; (...args: infer A2): infer R2
  } ?
  ((...args: A1) => R1) | ((...args: A2) => R2) :
  T extends {
    (...args: infer A1): infer R1
  } ?
  (...args: A1) => R1 :
  T


// function foo(a: string): string;
// function foo(a: number): number;
// function foo(a: any): any {}


// type d= Overloads<typeof foo>  // (a: string) => string | (a: number) => number | (a: any) => any

