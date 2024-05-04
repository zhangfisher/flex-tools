import { test,expect, describe} from "vitest"
import { FlexIterator, SKIP } from "../src/iterators/flexIterator"


class A{
    constructor(public id:any){}
    toString(){
        return `A-${this.id}`    
    }
}

describe("FlexIterator",()=>{

    test("通过parent参数指定一个父对象", () => {
        const iterator = new FlexIterator([1,2,3],{
            pick:(value)=>{
                return {
                    value,
                    parent: new A(value)
                }        
            },
            transform:(value,parent)=>`S-${value} (parent=${parent})`,
            recursion:true
        })
        const results = [...iterator] 
        expect(results).toEqual([
            "S-1 (parent=A-1)",
            "S-2 (parent=A-2)",
            "S-3 (parent=A-3)"
        ])
    })

    test("pick返回一个可迭代对象时，可以反复继续进行迭代", () => {
        // 特殊注意：需要指定终止条件，否则会陷入死循环
        const iterator = new FlexIterator([1,2,3],{
            pick:(value)=>{
                
                if(value==2){
                    return {
                        value:[8,9],
                        parent: new A(value)
                    }   
                }else{
                    return value   
                }            
            },
            transform:(value,parent)=>`S-${value} (parent=${parent})`,
            recursion:true
        })
        const results = [...iterator] 
        expect(results).toEqual([
            "S-1 (parent=1,2,3)",
            "S-8 (parent=A-2)",
            "S-9 (parent=A-2)",
            "S-3 (parent=1,2,3)"
        ])
    })

    test("展开可迭代对象进行递归迭代", () => {
        const iterator = new FlexIterator([1,[2,[3,[4,[5,[6]]]]]],{
            pick:(value)=>{
                return value   
            },
            transform:(value,parent)=>`S-${value} (parent=${parent})`,
            recursion:true
        })
        const results = [...iterator] 
        expect(results).toEqual([ 
            "S-1 (parent=1,2,3,4,5,6)",
            "S-2 (parent=2,3,4,5,6)",
            "S-3 (parent=3,4,5,6)",
            "S-4 (parent=4,5,6)",
            "S-5 (parent=5,6)",
            "S-6 (parent=6)"
        ])
    })

    test("递归迭代并为指定项单独指定Parent", () => {
        const iterator = new FlexIterator([1,[2,[3,[4,[5,[6]]]]]],{
            pick:(value)=>{
                if(value===2){
                    return {value,parent:new A('2')}
                }else{
                    return value   
                }
                
            },
            transform:(value,parent)=>`S-${value} (parent=${parent})`,
            recursion:true
        })
        const results = [...iterator] 
        expect(results).toEqual([ 
            "S-1 (parent=1,2,3,4,5,6)",
            "S-2 (parent=A-2)",
            "S-3 (parent=3,4,5,6)",
            "S-4 (parent=4,5,6)",
            "S-5 (parent=5,6)",
            "S-6 (parent=6)"
        ])
    })
    test("在transform中返回SKIP来跳过迭代", () => {
        const iterator = new FlexIterator([1,2,3,4,5,6,7,8],{
            transform:(value,parent)=>{
                if(value % 2 ==0){
                    return SKIP
                }
                return `S-${value}`
            },
            recursion:true
        })
        const results = [...iterator] 
        expect(results).toEqual([
            "S-1",
            "S-3",
            "S-5",
            "S-7"
        ])
    })
})
