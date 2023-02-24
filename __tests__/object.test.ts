import { test,expect, assert} from "vitest"
import { exclude, include,assignObject, deepMerge } from "../src/object"
 


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

    expect(assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[exclude]:["a", "b", "c"]})).toEqual({d:4,e:5,f:6,x:1})
    expect(assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[exclude]:["a", "b", "c"]},{a:1})).toEqual({d:4,e:5,f:6,x:1})

    expect(assignObject({a:1,b:2,c:3,d:4,e:5,f:6},{d:undefined,x:1},{[include]:["a", "b", "c"]},{a:1})).toEqual({a:1,b:2,c:3})


})
