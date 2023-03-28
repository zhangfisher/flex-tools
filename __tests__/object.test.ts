import { test,expect, assert} from "vitest"
import { EXCLUDE, INCLUDE,assignObject, deepMerge } from "../src/object"
import { omit } from "../src/object/omit"
import { pick } from "../src/object/pick"
import { get } from "../src/object/get"
import { set } from "../src/object/set"
import { forEachObject } from "../src/object/forEachObject"


test("遍历对象",() => {
    const obj = {
        a:{
            b1:{b11:1,b12:2},
            b2:{b21:3,b22:4},
            b3:[
                {b31:5,b32:6},
                {b31:7,b32:8}
            ]            
        },
        x:9,
        y:[10,11,12,13,14,{m:15,n:16}],
        z:[17,18,19,new Set([20,21,22,23,24]),[25,[26,27,28],29,30]]
    }    

    let results:any[] = []
    forEachObject(obj,({value,parent,keyOrIndex}) => {
        results.push([`${String(keyOrIndex)}=${JSON.stringify(value)}`,parent])
    })


})

test("深度合并",() => {

    expect(deepMerge({a:1,b:2},{c:3})).toEqual({a:1,b:2,c:3})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:2}},{c:{c3:3}})).toEqual({a:1,b:2,c:{c1:1,c2:2,c3:3}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1]}},{c:{c2:3}})).toEqual({a:1,b:2,c:{c1:1,c2:3}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1]}},{c:{c2:[1,2,3]}})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})

    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}},{array:'replace'})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}},{array:'merge'})).toEqual({a:1,b:2,c:{c1:1,c2:[1,1,1,2,3]}})
    


})

test("assignObject",() => {
    expect(assignObject({a:1,b:2},{a:undefined,b:3})).toEqual({a:1,b:3})
    expect(assignObject({
        enabled: true,
        bufferSize:10,
        flushInterval:10 * 1000, 
    },{format:"xxx"})).toEqual({
        enabled: true,
        bufferSize:10,
        flushInterval:10 * 1000, 
        format: "xxx"
    })

    expect(assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[EXCLUDE]:["a", "b", "c"]})).toEqual({d:4,e:5,f:6,x:1})
    expect(assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[EXCLUDE]:["a", "b", "c"]},{a:1})).toEqual({d:4,e:5,f:6,x:1})

    expect(assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[INCLUDE]:["a", "b", "c"]},{a:1})).toEqual({a:1,b:2,c:3})


})

test("pick",() => {
     
    expect(pick({a:1,b:2,c:3},"a")).toEqual({a:1})
    expect(pick({a:1,b:2,c:3},["a","b"])).toEqual({a:1,b:2})
    expect(pick({a:1,b:2,c:3},(k,v)=>{
          return k =='a'
    })).toEqual({a:1})
    expect(pick({a:1,b:2,c:3},["a","b"],{d:100})).toEqual({a:1,b:2,d:100})

})

test("omit",() => {
    let obj = {a:1,b:2,c:3,d:4}
    expect(omit(obj,"a")).toEqual({b:2,c:3,d:4})
    expect(omit(obj,["a","b"])).toEqual({c:3,d:4})
    expect(omit(obj,(k,v)=>{
          return k =='a'
    })).toEqual({b:2,c:3,d:4}) 
    expect(obj).toEqual({a:1,b:2,c:3,d:4})
    expect(omit(obj,"a",false)).toEqual({b:2,c:3,d:4})
    expect(obj).toEqual({b:2,c:3,d:4})

})

test("getByPath",() => {
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
        z:[1,2,3,new Set([1,2,3,4,5]),[1,[2,3,4,],2,4]]
    }    
    expect(get(obj,"a.b1.b11")).toEqual(1)
    expect(get(obj,"a.b3[0].b31")).toEqual(1)
    expect(get(obj,"a.b3[1].b31")).toEqual(1)
    expect(get(obj,"a.b3[1].b32")).toEqual(2)
    expect(get(obj,"a.b3.[1].b31")).toEqual(1)
    expect(get(obj,"a.b3.[1].b32")).toEqual(2)
    expect(get(obj,"x")).toEqual(1)
    expect(get(obj,"y[0]")).toEqual(1)
    expect(get(obj,"y[1]")).toEqual(2)
    expect(get(obj,"y[5].m")).toEqual(1)
    expect(get(obj,"y[5].n")).toEqual(2)
    expect(get(obj,"z[3].[0]")).toEqual(1)
    expect(get(obj,"z[3][0]")).toEqual(1)
    expect(get(obj,"z[4][1][1]")).toEqual(3)
})

test("getByPath的匹配回调",() => {
    const obj = {
        a:{
            b1:{b11:1,b12:2},
            b2:{b21:1,b22:2},
            b3:[
                {b31:13,b32:23},
                {b31:14,b32:24}
            ]            
        },
        x:1,
        y:[1,2,3,4,5,{m:1,n:2}],
        z:[1,2,3,new Set([1,2,3,4,5])]
    }    

    get(obj,"a.b1.b11",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(1)
        expect(parent).toEqual({b11:1,b12:2})
        expect(indexOrKey).toEqual("b11")
    }})
    
    get(obj,"a.b3[0].b31",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(13)
        expect(parent).toEqual({b31:13,b32:23})
        expect(indexOrKey).toEqual("b31")
    }})
    get(obj,"a.b3[1].b31",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(14)
        expect(parent).toEqual({b31:14,b32:24})
        expect(indexOrKey).toEqual("b31")
    }})
    get(obj,"a.b3[1].b32",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(24)
        expect(parent).toEqual({b31:14,b32:24})
        expect(indexOrKey).toEqual("b32")
    }})
    get(obj,"a.b3.[1].b31",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(14)
        expect(parent).toEqual({b31:14,b32:24})
        expect(indexOrKey).toEqual("b31")
    }})
    get(obj,"a.b3.[1].b32",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(24)
        expect(parent).toEqual({b31:14,b32:24})
        expect(indexOrKey).toEqual("b32")
    }})
    get(obj,"x",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(1)
        expect(parent).toEqual(obj)
        expect(indexOrKey).toEqual("x")
    }})
    get(obj,"y[0]",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(1)
        expect(parent).toEqual([1,2,3,4,5,{m:1,n:2}])
        expect(indexOrKey).toEqual(0)
    }})
    get(obj,"y[1]",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(2)
        expect(parent).toEqual([1,2,3,4,5,{m:1,n:2}])
        expect(indexOrKey).toEqual(1)
    }})
    get(obj,"y[5].m",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(1)
        expect(parent).toEqual({m:1,n:2})
        expect(indexOrKey).toEqual("m")
    }})
    get(obj,"y[5].n",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(2)
    }})
    get(obj,"z[3].[0]",{matched:({value,parent,indexOrKey})=>{
        expect(value).toEqual(1)
        expect(parent).toEqual(new Set([1,2,3,4,5]))
        expect(indexOrKey).toEqual(0)
    }})

})

test("setByPath",() => {
    const regex = /(?<name>\w+){0,1}(\[\s*(?<index>\d+)\s*\]){1}/gm;

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
    expect(get(set(obj,"a.b1.b11",2),"a.b1.b11")).toEqual(2)
    expect(get(set(obj,"a.b3[0].b31",22),"a.b3[0].b31")).toEqual(22)
    expect(get(set(obj,"a.b3[1].b31",33),"a.b3[1].b31")).toEqual(33)
    expect(get(set(obj,"a.b3[1].b32",44),"a.b3[1].b32")).toEqual(44)
    expect(get(set(obj,"a.b3.[1].b31",55),"a.b3.[1].b31")).toEqual(55)
    expect(get(set(obj,"a.b3.[1].b32",55),"a.b3.[1].b32")).toEqual(55)
    expect(get(set(obj,"x",2),"x")).toEqual(2)
    expect(get(set(obj,"y[0]",3),"y[0]")).toEqual(3)
    expect(get(set(obj,"y[1]",4),"y[1]")).toEqual(4)
    expect(get(set(obj,"y[5].m",5),"y[5].m")).toEqual(5)
    expect(get(set(obj,"y[5].n",6),"y[5].n")).toEqual(6) 

})
 