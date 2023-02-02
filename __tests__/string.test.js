import { test,expect} from "vitest"

import {  replaceVars } from "../src/string/replaceVars"


test("replaceVars", ()=>{
    // 字典插值
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1,c:2})).toBe("1+1=2")
    expect(replaceVars("{#a}+{b%}={<c>}",{a:1,b:1,c:2})).toBe("#1+1%=<2>")
    expect(replaceVars("{# a}+{b %}={< c >}",{a:1,b:1,c:2})).toBe("# 1+1 %=< 2 >")
    expect(replaceVars("{a}+{b}={c}",{a:()=>1,b:()=>1,c:()=>2})).toBe("1+1=2")
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1})).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",{a:1,b:1})).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",{a:1,b:1},{empty:''})).toBe("1+1=<>")
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1,c:null},{empty:'空'})).toBe("1+1=空")
    expect(replaceVars("{,a}+{,b}={,c}",{a:undefined,b:null})).toBe("+=")

    // Map字典插值
    expect(replaceVars("{a}+{b}={c}",new Map([["a",1],["b",1],["c",2]]))).toBe("1+1=2")
    expect(replaceVars("{#a}+{b%}={<c>}",new Map([["a",1],["b",1],["c",2]]))).toBe("#1+1%=<2>")
    expect(replaceVars("{# a}+{b %}={< c >}",new Map([["a",1],["b",1],["c",2]]))).toBe("# 1+1 %=< 2 >")
    expect(replaceVars("{a}+{b}={c}",new Map([["a",()=>1],["b",()=>1],["c",()=>2]]))).toBe("1+1=2")
    expect(replaceVars("{a}+{b}={c}",new Map([["a",1],["b",1]]))).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",new Map([["a",1],["b",1]]))).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",new Map([["a",1],["b",1]]),{empty:''})).toBe("1+1=<>")
    expect(replaceVars("{a}+{b}={c}",new Map([["a",1],["b",1],["c",null]]),{empty:'空'})).toBe("1+1=空")
    expect(replaceVars("{,a}+{,b}={,c}",new Map([["a",undefined],["b",null]]))).toBe("+=")
    


    // 位置插值,忽略名称
    expect(replaceVars("{a}+{b}={c}",[1,1,2])).toBe("1+1=2")
    expect(replaceVars("{#a}+{b%}={<c>}",[1,1,2])).toBe("#1+1%=<2>")
    expect(replaceVars("{# a}+{b %}={< c >}",[1,1,2])).toBe("# 1+1 %=< 2 >")
    expect(replaceVars("{a}+{b}={c}",[()=>1,()=>1,()=>2])).toBe("1+1=2")
    expect(replaceVars("{a}+{b}={c}",[1,1])).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",[1,1])).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",[1,1],{empty:''})).toBe("1+1=<>")
    expect(replaceVars("{a}+{b}={c}",[1,1,null],{empty:'空'})).toBe("1+1=空")
    expect(replaceVars("{,a}+{,b}={,c}",[undefined,null])).toBe("+=")


    expect(replaceVars("It is {a}",1)).toBe("It is 1")
    expect(replaceVars("It is {a}",true)).toBe("It is true")
    expect(replaceVars("It is {a}","dog")).toBe("It is dog")
 
    expect(replaceVars("{0}+{1}={2}{3}{4}",[1,2,3,4,5])).toBe("1+2=345")

    expect(replaceVars("我叫{姓名}，今年{年龄}岁",["张三","十二"])).toBe("我叫张三，今年十二岁")
    expect(replaceVars("我叫{姓名}，今年{年龄}岁",{"姓名":"张三","年龄":"十二"})).toBe("我叫张三，今年十二岁")

})