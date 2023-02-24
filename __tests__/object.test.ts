import { test,expect, assert} from "vitest"
import { EXCLUDE, INCLUDE,assignObject, deepMerge } from "../src/object"
import { omit } from "../src/object/omit"
import { pick } from "../src/object/pick"
 


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
