import { test,expect, describe} from "vitest"
import { assignObject, deepMerge, getPropertyNames, isLikeObject, safeParseJson } from "../src/object"
import { omit } from "../src/object/omit"
import { pick } from "../src/object/pick"
import { getByPath } from "../src/object/getByPath"
import { setByPath } from "../src/object/setByPath"
import { ABORT, forEachObject  } from "../src/object/forEachObject"
import { forEachUpdateObject } from "../src/object/forEachUpdateObject"
import {CircularRefError} from "../src/errors"
import { objectIterator } from "../src/object/objectIterator" 
describe("forEachObject",()=>{

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
    
        let results:number[]= []
        // 只遍历对象中的原始类型
        forEachObject(obj,({value,parent,keyOrIndex}) => {
            results.push(value)
        })
        expect(results).toEqual(new Array(30).fill(0).map((value,index)=>index+1))
    
        // 只遍历对象中的原始类型
        let result2:any[]=[]
        forEachObject(obj,({value,keyOrIndex}) => {
            result2.push(`${String(keyOrIndex)}=${JSON.stringify(value)}`)
        },{onlyPrimitive:false})
    
    })
    
    test("使用迭代器遍历对象",() => {
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
    
        let results:number[]= []
        let keyOrIndexs:any[]=[]
        // 只遍历对象中的原始类型
        let iterator = objectIterator(obj)
        for(const {value,parent,keyOrIndex} of iterator)    {
            results.push(value)
            keyOrIndexs.push(keyOrIndex)
        }
        expect(results).toEqual(new Array(30).fill(0).map((value,index)=>index+1))
        // 遍历所有成员
        iterator = objectIterator(obj,{onlyPrimitive:false})
        for(const {value,parent,keyOrIndex} of iterator)    {
            results.push(value)
            keyOrIndexs.push(keyOrIndex)
        }    
    })    
    
    test("遍历对象存在循环引用问题",() => {
        const a:any = {a:1}
        const b = {b:1}
        a.b=a
        a.c=b
        
        // 1： 不检测时会导致无限遍历
        let values:any[]=[]
        forEachObject(a,({value,parent,keyOrIndex}) => {        
            values.push(value)
            if(values.length>100) return ABORT
        })
        // 2. 触发错误
        values=[]
        try{
            forEachObject(a,({value,parent,keyOrIndex}) => {        
                values.push(value)
                if(values.length>100) return ABORT
            },{circularRef:'error'})
        }catch(e:any){
            expect(e).toBeInstanceOf(CircularRefError)
        }
        // 2. 触发错误
        values=[]
    
        forEachObject(a,({value,parent,keyOrIndex}) => {        
            values.push(value)
        },{circularRef:'skip'})
        expect(values).toEqual([1,1])
        
        
    
    })

})


test("深度合并",() => {
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}},{$merge:'replace'})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:2}},{c:{c3:3}})).toEqual({a:1,b:2,c:{c1:1,c2:2,c3:3}})
    expect(deepMerge({a:1,b:2},{c:3})).toEqual({a:1,b:2,c:3})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1]}},{c:{c2:3}})).toEqual({a:1,b:2,c:{c1:1,c2:3}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1]}},{c:{c2:[1,2,3]}})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})

    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}},{$merge:'merge'})).toEqual({a:1,b:2,c:{c1:1,c2:[1,1,1,2,3]}})
    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}},{$merge:'uniqueMerge'})).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})
    

    expect(deepMerge({a:1,b:2,c:{c1:1,c2:[1,1]}},{c:{c2:[1,2,3]}},(from: any,to: any,ctx: any)=>{
        return from
    })).toEqual({a:1,b:2,c:{c1:1,c2:[1,2,3]}})


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
    expect(getByPath(obj,"a.b1.b11")).toEqual(1)
    expect(getByPath(obj,"a.b3.0.b31")).toEqual(1)
    expect(getByPath(obj,"a.b3.1.b31")).toEqual(1)
    expect(getByPath(obj,"a.b3.1.b32")).toEqual(2)
    expect(getByPath(obj,"a.b3.1.b31")).toEqual(1)
    expect(getByPath(obj,"a.b3.1.b32")).toEqual(2)
    expect(getByPath(obj,"x")).toEqual(1)
    expect(getByPath(obj,"y.0")).toEqual(1)
    expect(getByPath(obj,"y.1")).toEqual(2)
    expect(getByPath(obj,"y.5.m")).toEqual(1)
    expect(getByPath(obj,"y.5.n")).toEqual(2)
    expect(getByPath(obj,"z.3.0")).toEqual(1)
    expect(getByPath(obj,"z.3.0")).toEqual(1)
    expect(getByPath(obj,"z.4.1.1")).toEqual(3)
})


test("forEachUpdateObject",() => {
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

    forEachUpdateObject(obj,({value,parent,keyOrIndex})=>{
        return value % 2 == 0 
    },({value,parent,keyOrIndex})=>{
        return value * 2
    })
    
})
 


test("forEachObject Set/Map/Array",() => {
    let result:any[] =[]
    forEachObject(new Set([1,2,3,4,5]),({value,parent,keyOrIndex})=>{
        result.push([keyOrIndex,value])
    })
    expect(result).toEqual([[1,1],[2,2],[3,3],[4,4],[5,5]])
    result = []
    forEachObject(new Map([["a",1],["b",2],["c",3],["d",4],["e",5]]),({value,parent,keyOrIndex})=>{
        result.push([keyOrIndex,value])
    })
    expect(result).toEqual([["a",1],["b",2],["c",3],["d",4],["e",5]])
    
})


test("getPropertyNames",() => {
    class A{
        a = 1
        b = 2
        c = 3
        private _count = 0
        #isOpen:boolean = false
        get count(){
            return this._count
        }
        set count(value){
            this._count = value
        }
        atest(){

        }
    }
    class A1 extends A{
        a = 11
        b = 22
        c = 33
        atest1(){

        }        
    }

    let names = getPropertyNames(new A1())
    //expect(names).toEqual(["a","b","c","constructor","count","atest","atest1"])

    names = getPropertyNames({})
    names = getPropertyNames(()=>{})
    const func = function(){}
    func.a=1
    names = getPropertyNames(func)
})


test('isLikeObject',()=>{
    expect(isLikeObject({a:1,b:2},{a:1,b:2})).toEqual(true)
    expect(isLikeObject({a:1,b:2},{b:1,a:3})).toEqual(true)
    expect(isLikeObject({a:1,b:2,c:3},{b:1,a:3})).toEqual(true)
    expect(isLikeObject({a:1,b:2,c:3},{b:1,a:3},{strict:true})).toEqual(false)
    // deep=true
    expect(isLikeObject({a:1,b:2,c:{c1:1,c2:2}},{b:1,a:3,c:{c1:1,c2:2}})).toEqual(true)
    expect(isLikeObject({a:1,b:2,c:{c1:1,c2:2,c3:3}},{b:1,a:3,c:{c1:1,c2:2}})).toEqual(true)
    expect(isLikeObject({a:1,b:2,c:{c1:1,c2:2,c3:3}},{b:1,a:3,c:{c1:1,c2:2}},{strict:true})).toEqual(true)
    expect(isLikeObject({a:1,b:2,c:{c1:1,c2:2,c3:3}},{b:1,a:3,c:{c1:1,c2:2}},{deep:true})).toEqual(true)
    expect(isLikeObject({a:1,b:2,c:{c1:1,c2:2,c3:3}},{b:1,a:3,c:{c1:1,c2:2}},{strict:true,deep:true})).toEqual(false)
})


test("safeParseJson",()=>{
    const str = String.raw`{ 
        b:'dd'
        a:1,
        "ds":'111',
        "sss":'中文',x:'中文',y:2,
        '中文':1,
        中q文:2
        中文:3,
        online:true
        prefix:'$ssd',suffix:'d元'
    }
`
    expect(()=>safeParseJson(str)).not.toThrow()



})