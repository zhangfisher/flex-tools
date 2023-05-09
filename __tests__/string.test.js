import { test,expect} from "vitest"

import {  replaceVars } from "../src/string"


test("replaceVars", ()=>{
    expect(replaceVars("{a}+{b}={c}",()=>({a:1,b:1,c:2}))).toBe("1+1=2")

    expect(replaceVars("{<x>a<y>}+{b}={c}",{a:1,b:1,c:[2,2]})).toBe("x1y+1=2,2")

    // 字典插值
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1,c:[2,2]})).toBe("1+1=2,2")
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1,c:{x:1,y:2}})).toBe("1+1=x=1,y=2")
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1,c:2})).toBe("1+1=2")
    expect(replaceVars("{<#>a}+{ b<%>}={<c>}",{a:1,b:1,c:2})).toBe("#1+1%=")
    expect(replaceVars("{<#> a}+{ b <%>}={c}",{a:1,b:1,c:2})).toBe("#1+1%=2")
    expect(replaceVars("{a}+{b}={c}",{a:()=>1,b:()=>1,c:()=>2})).toBe("1+1=2")
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1})).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",{a:1,b:1})).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<<>c<>>}",{a:1,b:1},{empty:''})).toBe("1+1=<>")
    expect(replaceVars("{a}+{b}={c}",{a:1,b:1,c:null},{empty:'空'})).toBe("1+1=空")
    expect(replaceVars("{a}+{b}={c}",{a:undefined,b:null})).toBe("+=")

    // Map字典插值
    expect(replaceVars("{a}+{b}={c}",new Map([["a",1],["b",1],["c",2]]))).toBe("1+1=2")
    expect(replaceVars("{<#>a}+{ b<%>}={<c>}",new Map([["a",1],["b",1],["c",2]]))).toBe("#1+1%=")
    expect(replaceVars("{<#> a}+{ b <%>}={< c >}",new Map([["a",1],["b",1],["c",2]]))).toBe("#1+1%=")
    expect(replaceVars("{a}+{b}={c}",new Map([["a",()=>1],["b",()=>1],["c",()=>2]]))).toBe("1+1=2")
    expect(replaceVars("{a}+{b}={c}",new Map([["a",1],["b",1]]))).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",new Map([["a",1],["b",1]]))).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<<><>>}",new Map([["a",1],["b",1]]),{empty:''})).toBe("1+1=<>")
    expect(replaceVars("{a}+{b}={c}",new Map([["a",1],["b",1],["c",null]]),{empty:'空'})).toBe("1+1=空")
    expect(replaceVars("{<,>a}+{<,>b}={<,>c}",new Map([["a",undefined],["b",null]]))).toBe("+=")
    


    // 位置插值,忽略名称
    expect(replaceVars("{a}+{b}={c}",[1,1,2])).toBe("1+1=2")
    expect(replaceVars("{<#>a}+{ b<%>}={<c>}",[1,1,2])).toBe("#1+1%=c2")
    expect(replaceVars("{<#> a}+{ b <%>}={< c >}",[1,1,2])).toBe("#1+1%= c 2")
    expect(replaceVars("{a}+{b}={c}",[()=>1,()=>1,()=>2])).toBe("1+1=2")
    expect(replaceVars("{a}+{b}={c}",[1,1])).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",[1,1])).toBe("1+1=")
    expect(replaceVars("{a}+{b}={<c>}",[1,1],{empty:''})).toBe("1+1=c")
    expect(replaceVars("{a}+{b}={c}",[1,1,null],{empty:'空'})).toBe("1+1=空")
    expect(replaceVars("{<,>a}+{<,>b}={<,>c}",[undefined,null])).toBe("+=")

    expect("{a}+{b}={c}".params(1,1,2)).toBe("1+1=2")
    expect("{<#>a}+{ b<%>}={<c>}".params(1,1,2)).toBe("#1+1%=c2")
    expect("{<#> a}+{ b <%>}={< c >}".params(1,1,2)).toBe("#1+1%= c 2")
    expect("{a}+{b}={c}".params(()=>1,()=>1,()=>2)).toBe("1+1=2")
    expect("{a}+{b}={c}".params(1,1)).toBe("1+1=")
    expect("{a}+{b}={<c>}".params(1,1)).toBe("1+1=")
    expect("{a}+{b}={c}".params(1,1,null)).toBe("1+1=")
    expect("{<,>a}+{<,>b}={<,>c}".params(undefined,null)).toBe("+=")


    expect(replaceVars("It is {a}",1)).toBe("It is 1")
    expect(replaceVars("It is {a}",true)).toBe("It is true")
    expect(replaceVars("It is {a}","dog")).toBe("It is dog")
 
    expect(replaceVars("{0}+{1}={2}{3}{4}",[1,2,3,4,5])).toBe("1+2=345")

    expect(replaceVars("我叫{姓名}，今年{年龄}岁",["张三","十二"])).toBe("我叫张三，今年十二岁")
    expect(replaceVars("我叫{姓名}，今年{年龄}岁",{"姓名":"张三","年龄":"十二"})).toBe("我叫张三，今年十二岁")

    expect(replaceVars("{ a }+{  b   }={  c   }",[1,1,2])).toBe("1+1=2")

    // 指定前后缀
    //expect(replaceVars("{size:size(mb)}{,type:type}",[1,"exe"])).toBe("size:1(mb),type:exe")

    expect(replaceVars("{a}",new Error("X"))).toBe("Error:X")

})

test("replaceVars  forEach", ()=>{
    let vars=[]
    "{a}+{<prefix>b<suffix>}={<prefix>c}{d<suffix>}".params(1,2,3,{
        $forEach:(name,value,prefix,suffix)=>{
            vars.push([name,value,prefix,suffix])
        }
    })
    expect(vars.length).toEqual(4)
    expect(vars[0]).toEqual(["a","1","",""])
    expect(vars[1]).toEqual(["b","2","prefix","suffix"])
    expect(vars[2]).toEqual(["c","3","prefix",""])
    // 由于第4个参数是空，并且$empty为空，所以将不会输出
    expect(vars[3]).toEqual(["d","","","suffix"])
})
test("replaceVars遍历插值变量", ()=>{
    let vars=[]
    "{a}{b}{c}{d}{}{}{}".params({
        $forEach:(name,value,prefix,suffix)=>{
            vars.push(name)
        }
    })
    expect(vars.length).toEqual(7)
    expect(vars).toEqual(["a","b","c","d","","",""]) 
})


test("params",() => {
    
    let result = "[{levelName}] - {datetime} : {message}{<,module=>module}{<,tags=>tags}".params({
        level: 4,
        message: "程序出错数据类型出错",
        levelName: "ERROR",
        datetime: "2023-02-24 14:56:20 428",
        date: "2023-02-24",
        time: "14:56:20",
      })
      expect(result).toBe("[ERROR] - 2023-02-24 14:56:20 428 : 程序出错数据类型出错")
})


