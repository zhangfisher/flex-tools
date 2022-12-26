import { test,expect,vi} from "vitest"
import { FlexEvent, FlexEventListener} from "../src"
 
 
 
test("事件订阅与退订",()=>{
   let events = new FlexEvent()
   let fn =  vi.fn()
   let eid = events.on("click",fn)
   let listeners = events.getListeners("click")
   expect(listeners.length).toBe(1)
   expect(listeners[0]).toBe(fn)
   events.emit("click") 
   expect(fn).toBeCalledTimes(1)
   events.off(eid)
   events.emit("click") 
   expect(fn).toBeCalledTimes(1)
})

test("只订阅一次",()=>{
    let events = new FlexEvent()
    let fn =  vi.fn()
    let eid = events.once("click",fn)    
    let listeners = events.getListeners("click") 
    expect(listeners.length).toBe(1)
    events.emit("click") 
    events.emit("click") 
    events.emit("click") 
    events.emit("click") 
    expect(events.getListeners("click").length).toBe(0) 
    expect(fn).toBeCalledTimes(1)
 })

 test("等待某个事件的触发",async ()=>{
    let events = new FlexEvent()
    let fn =  vi.fn()
    setTimeout(()=>{
        events.emit("click",1)
    },10)
    let reuslt = await events.waitFor("click")
    expect(reuslt[0]).toBe(1)
 })


 test("多种退订方式",()=>{
    let events = new FlexEvent()
    let fn =  vi.fn()
    // 通过id退订
    let eid = events.on("click",fn)    
    expect(events.getListeners("click").length).toBe(1) 
    events.off(eid) 
    expect(events.getListeners("click").length).toBe(0) 

    // 指定事件和订阅者
    events.on("click",fn)    
    expect(events.getListeners("click").length).toBe(1) 
    events.off("click",fn) 
    expect(events.getListeners("click").length).toBe(0) 

    // 退订指定函数的所有事件
    events.on("click",fn)    
    events.on("change",fn)    
    expect(events.getListeners("click").length).toBe(1) 
    expect(events.getListeners("change").length).toBe(1) 
    events.off(fn) 
    expect(events.getListeners("click").length).toBe(0) 
    expect(events.getListeners("change").length).toBe(0)  


})


test("订阅时指定执行次数",()=>{
    let events = new FlexEvent()
    let count = 10
    let fn =  vi.fn()
    // 通过id退订
    let eid = events.on("click",fn,{count})    

    new Array(count).fill(0).forEach(()=>{
        events.emit("click")
    })
    expect(fn).toBeCalledTimes(10)
    expect(events.getListeners("click").length).toBe(0) 
    
})

test("通配符事件订阅与退订",()=>{
    let events = new FlexEvent()
    let fn =  vi.fn()
    let eid = events.on("a/*/c",fn)    
    // 由于"a/1/c"和"a/2/c"均匹配"a/*/c"，所以返回的是同一个侦听器函数
    let listeners1 = events.getListeners("a/1/c")
    let listeners2 = events.getListeners("a/2/c")
    expect(listeners1.length).toBe(1) 
    expect(listeners2.length).toBe(1) 
    expect(listeners1[0]).toBe(listeners2[0]) 
    events.emit("a/1/c") 
    events.emit("a/2/c") 
    expect(fn).toBeCalledTimes(2)
    events.off(eid)
    expect(events.getListeners("a/1/c").length).toBe(0)
    events.emit("a/1/c") 
    events.emit("a/2/c") 
    expect(fn).toBeCalledTimes(2) 
 })
 

 test("异步事件订阅",async ()=>{
    let events = new FlexEvent()
    let list = new Array(10).fill(0).map((value,index)=>index+1)
    list.forEach((value,index)=>{
        events.on("click",async () => {
            if(index % 2 == 0) {
                return value
            }else{
                throw new Error()
            }
            
        })    
    })    
    let results = await events.emitAsync("click")  
    expect(results[0]).toStrictEqual(1)
    expect(results[1]).toBeInstanceOf(Error)     
    expect(results[2]).toStrictEqual(3)
    expect(results[3]).toBeInstanceOf(Error)
    expect(results[4]).toStrictEqual(5)
    expect(results[5]).toBeInstanceOf(Error)
    expect(results[6]).toStrictEqual(7)
    expect(results[7]).toBeInstanceOf(Error)
    expect(results[8]).toStrictEqual(9)
    expect(results[9]).toBeInstanceOf(Error)    
 })






 
