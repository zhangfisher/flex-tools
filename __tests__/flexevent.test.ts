import { test, expect, describe, afterEach, beforeEach,vi } from "vitest"
import { FlexEvent, FlexEventBus, FlexEventBusMessage, FlexEventBusNode, FlexEventListener  } from "../src/events"
import { TimeoutError } from "../src/errors"
import { delay } from "../src/async"
import { LiteEvent } from '../src/events/liteEvent';

describe("FlexEvent事件触发器", () => {
    beforeEach(() => {
        vi.useFakeTimers()
      })
      afterEach(() => {
        vi.restoreAllMocks()
      })
    test("事件订阅与退订", () => {
        let events = new FlexEvent()
        let fn = vi.fn()
        let eid = events.on("click", fn)
        let listeners = events.getListeners("click")
        expect(listeners.length).toBe(1)
        expect(listeners[0][0]).toBe(fn)
        events.emit("click")
        expect(fn).toBeCalledTimes(1)
        events.off(eid as string)
        events.emit("click")
        expect(fn).toBeCalledTimes(1)
    })

    test("只订阅一次", () => {
        let events = new FlexEvent()
        let fn = vi.fn()
        events.once("click", fn)
        let listeners = events.getListeners("click")
        expect(listeners.length).toBe(1)
        events.emit("click")
        events.emit("click")
        events.emit("click")
        events.emit("click")
        expect(events.getListeners("click").length).toBe(0)
        expect(fn).toBeCalledTimes(1)
    })

    test("等待某个事件的触发", async () => {
        let events = new FlexEvent()
        setTimeout(() => {
            events.emit("click", 1)
        }, 10)
        let reuslt = await events.waitFor("click")
        expect(reuslt[0]).toBe(1)
    })


    test("多种退订方式", () => {
        let events = new FlexEvent()
        let fn = vi.fn()
        // 通过id退订
        let eid = events.on("click", fn)
        expect(events.getListeners("click").length).toBe(1)
        events.off(eid as string)
        expect(events.getListeners("click").length).toBe(0)

        // 指定事件和订阅者
        events.on("click", fn)
        expect(events.getListeners("click").length).toBe(1)
        events.off("click", fn)
        expect(events.getListeners("click").length).toBe(0)

        // 退订指定函数的所有事件
        events.on("click", fn)
        events.on("change", fn)
        expect(events.getListeners("click").length).toBe(1)
        expect(events.getListeners("change").length).toBe(1)
        events.off(fn)
        expect(events.getListeners("click").length).toBe(0)
        expect(events.getListeners("change").length).toBe(0)
    })


    test("订阅时指定执行次数", () => {
        let events = new FlexEvent()
        let count = 10
        let fn = vi.fn()
        // 通过id退订
        events.on("click", fn, { count })

        Array.from({length:count}).fill(0).forEach(() => {
            events.emit("click")
        })
        expect(fn).toBeCalledTimes(10)
        expect(events.getListeners("click").length).toBe(0)

    })

    test("通配符事件订阅与退订", () => {
        let events = new FlexEvent()
        let fn = vi.fn()
        let eid = events.on("a/*/c", fn)
        // 由于"a/1/c"和"a/2/c"均匹配"a/*/c"，所以返回的是同一个侦听器函数
        let listeners1 = events.getListeners("a/1/c")
        let listeners2 = events.getListeners("a/2/c")
        expect(listeners1.length).toBe(1)
        expect(listeners2.length).toBe(1)
        expect(listeners1[0][0]).toBe(listeners2[0][0])
        events.emit("a/1/c")
        events.emit("a/2/c")
        expect(fn).toBeCalledTimes(2)
        events.off(eid as any)
        expect(events.getListeners("a/1/c").length).toBe(0)
        events.emit("a/1/c")
        events.emit("a/2/c")
        expect(fn).toBeCalledTimes(2)

        const f1 = vi.fn()
        events.on("a/*", f1)
        events.emit("a/b")                  // 匹配触发
        expect(f1).toBeCalledTimes(1)


        const f2 = vi.fn()
        events.on("a/*/c", f2)
        events.emit("a/b/c")                  // 匹配触发
        events.emit("a/x/c")                  // 匹配触发
        expect(f2).toBeCalledTimes(2)

        const f3 = vi.fn()
        events.on("a/**/x", f3)
        events.emit("a/b/c/x")              // 匹配触发
        events.emit("a/b/x")                // 匹配触发
        events.emit("a/b/c/d/e/x")          // 匹配触发
        expect(f3).toBeCalledTimes(3)

        // 也可以触发通配符事件
        const f4 = vi.fn()
        events.on("a/x/c", f4)          // 匹配触发
        events.on("a/y/c", f4)          // 匹配触发
        events.on("a/z/c", f4)          // 匹配触发
        events.emit("a/*/c", 1)               // 通配符触发
        events.emit("a/**", 1)               // 通配符触发
        expect(f4).toBeCalledTimes(6)
    })



    test("异步事件订阅", async () => {
        let events = new FlexEvent()
        let list = Array.from({length:10}).fill(0).map((value, index) => index + 1)
        list.forEach((value, index) => {
            events.on("click", async () => {
                if (index % 2 == 0) {
                    return value
                } else {
                    throw new Error()
                }

            })
        })
        let results = await events.emitAsync("click",1)
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

    test("启用retain=true保留粘性消息", () => {
        return new Promise<void>(resolve => {
            let events = new FlexEvent()
            events.emit("a", 1,true)  // 先触发
            // 后订阅时接收事件
            events.once("a", (data) => {
                expect(data).toBe(1)
            })
            events.once("a", (data) => {
                expect(data).toBe(1)
            })
            // 也支持通配符
            events.emit("a/*/c", 2,true)  
            // 先触发
            events.once("a/x/c", (data) => {
                expect(data).toBe(2)
            })
            events.once("a/y/c", (data) => {
                expect(data).toBe(2)     
                resolve()           
            })
            events.once("*/*/c", (data) => {
                expect(data).toBe(2)
                resolve()
            })
        })
    })
    test("通配符触发粘性消息时",async ()=>{
        const events = new FlexEvent()
        let results:any[]=[]
        events.emit("app/started",1,true)
        events.once("app/started",()=>{
            events.emit("modules/auth/started",2,true) 
        })
        events.on("modules/*/started",(msg:any)=>{
            results.push(`*:${msg}`)
        })
        await delay(100)
        expect(results.length).toBe(1)
    })
    test("retain=false时单独为事件指定保留消息", () => {

        return new Promise<void>(resolve => {
            let events = new FlexEvent()
            events.emit(`workspace/test/counter/ready`,events,true)
            setTimeout(() => {
                events.once(`workspace/test/counter/ready`, (data) => {
                    expect(data).toBe(events)
                })
            },500)

            events.emit("a", 1, true)  // 先触发
            setTimeout(()=>{
                // 后订阅时接收事件
                events.once("a", (data) => {
                    expect(data).toBe(1)
                })
                events.once("a", (data) => {
                    expect(data).toBe(1)
                    resolve()
                })
            },500)            
            vi.runAllTimers()

        })
    })

    test("通配符保留事件订阅",async ()=>{
        const events = new FlexEvent() 
        const results:any[]=[]
        
            events.emit("modules/auth/started",1,true)
            events.emit("modules/api/started",2,true)
            events.once("modules/auth/started",(msg:any)=>{
                results.push(msg)
            })
            events.once("modules/*/started",(msg:any)=>{
                results.push(msg)
            })
            events.on("modules/*/started",(msg:any)=>{
                results.push(msg)
            })
            await delay(100)
            expect(results.length).toBe(4)
            
    })
    test("触发通配符事件",async ()=>{
        const events = new FlexEvent() 
        const results:any[]=[]
        events.once("modules/auth/started",(msg:any)=>{
            results.push(msg)
        })
        events.once("modules/api/started",(msg:any)=>{
            results.push(msg)
        })
        events.emit("modules/*/started",1)
        await delay(100)            
        expect(results.length).toBe(2)
        expect(results[0]).toBe(1)
        expect(results[1]).toBe(1)
    })
    test("等待事件触发",async ()=>{
        const events = new FlexEvent() 
        let results:any[]=[]
        setTimeout(()=>events.emit("a",1))
        results.push(await events.waitFor("a"))
        expect(results).toStrictEqual([[1]]);
        results=[]

        setTimeout(()=>{
            events.emit("b",1)
        },5000)
        try{
            await events.waitFor("b",1000)
        }catch(e){
            expect(e).toBeInstanceOf(TimeoutError)
            expect(results).toStrictEqual([]);
        }
        
        setTimeout(()=>{events.emit("a1",1)})
        results.push(await events.waitFor(["a1","b1","c1"]))
        expect(results).toStrictEqual([[1]]);
        results=[]

        setTimeout(()=>{events.emit("b2",2)})
        results.push(await events.waitFor(["a2","b2","c2"]))
        expect(results).toStrictEqual([[2]]);
        results=[]

        setTimeout(()=>{events.emit("c3",3)})
        results.push(await events.waitFor(["a3","b3","c3"]))
        expect(results).toStrictEqual([[3]]);
        results=[]

        setTimeout(()=>{events.emit("a4",1)},300)
        try{
            await events.waitFor(["a4","b4","c4"],200)
        }catch(e){
            expect(e).toBeInstanceOf(TimeoutError)
        }
        
        setTimeout(()=>{events.emit("b5",2)},300)
        try{
            await events.waitFor(["a5","b5","c5"],200)
        }catch(e){
            expect(e).toBeInstanceOf(TimeoutError)
        }
        setTimeout(()=>{events.emit("c6",3)},300)
        try{
            await events.waitFor(["a6","b6","c6"],200)
        }catch(e){
            expect(e).toBeInstanceOf(TimeoutError)
        }
         
        
        setTimeout(()=>{
            events.emit("a7",1)
            events.emit("b7",2)
            events.emit("c7",3)
        })
        results.push(await events.waitFor("a7,b7,c7"))
        expect(results).toStrictEqual([[1,2,3]]);
        results=[]
        setTimeout(()=>{
            events.emit("a8",1)
            events.emit("b8",2)
            setTimeout(()=>events.emit("c8",3),600)
        })
        try{
            await events.waitFor("a8,b8,c8",500)
        }catch(e){
            expect(e).toBeInstanceOf(TimeoutError)
        } 
    })
    
    test("事件名称包含特殊字符",()=>{
        const events = new FlexEvent() 
        return new Promise<void>((resolve)=>{
            events.onAny((event)=>{
                expect(event).toBe(1) 
            })
            events.on("$renderer/voerkaapp/*",(event)=>{
                expect(event).toBe(1)
                resolve()
            })
            events.emit("$renderer/voerkaapp/max",1)
            
        })
    }) 

    test("订阅全局事件",()=>{
        const results:any[]=[]
        const events = new FlexEvent() 
        return new Promise<void>((resolve)=>{
            events.on("**",(event)=>{                
                results.push(event)
            })
            events.on("**",(event)=>{
                results.push(event) 
            })
            events.on("**",(event)=>{
                results.push(event) 
            })
            events.on("a",(event)=>{
                results.push(event) 
            })
            events.on("a/b",(event)=>{
                results.push(event) 
            })
            events.on("a/b/c",(event)=>{
                results.push(event) 
            })
            events.on("a/b/c/d",(event)=>{
                results.push(event) 
            })
            events.emit("a",1)
            events.emit("a/b",2)
            events.emit("a/b/c",3)
            events.emit("a/b/c/d",4)

            expect(results).toStrictEqual([1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4])
            resolve()
        })

    })



})


describe('事件匹配测试', () => {
    const wildcard="*",delimiter="/"
    function isEventMatched(pattern:string,event:string):boolean{
        if(pattern == event) return true
        if(wildcard && pattern.includes("*")){
            // 由于通配符**与*冲突，所以先将**替换成一个特殊的字符
            const regex =new RegExp("^"+pattern.replaceAll("**",`__#####__`)
                .replaceAll("$","\\$")
                .replaceAll("^","\\^")
                .replaceAll(".","\\.")
                .replaceAll("*",`[^\\s${delimiter}]*`)
                .replaceAll("__#####__",`[^\\s\\*]*`)+"$")
            return regex.test(event)
        }else{
            return pattern == event
        }
    }
    test('直接字符串匹配', () => {
        expect(isEventMatched('event1', 'event1')).toBe(true);
        expect(isEventMatched('event1', 'event2')).toBe(false);
    });

    test('特殊字符匹配', () => {
        expect(isEventMatched('$renderer/voerka/*', '$renderer/voerka/max')).toBe(true);
        expect(isEventMatched('.renderer/voerka/*', '.renderer/voerka/max')).toBe(true);
        expect(isEventMatched('^renderer/voerka/*', '^renderer/voerka/max')).toBe(true);

    });

    test('单星通配符匹配', () => {
        expect(isEventMatched('event*', 'event1')).toBe(true);
        expect(isEventMatched('a/*/c', 'a/b/c')).toBe(true);
        expect(isEventMatched('a/*/c', 'a/b1/c')).toBe(true);
        expect(isEventMatched('a/*/c', 'a/!@#$~%&^%/c')).toBe(true);
        expect(isEventMatched('a/*/*', 'a/b/c')).toBe(true);
        expect(isEventMatched('a/*/*', 'a/b/c1')).toBe(true);
        expect(isEventMatched('a/*/*', 'a/!@#$~%&^%/!@#$~%&^%')).toBe(true);
    });

    test('双星通配符匹配', () => {
        expect(isEventMatched('a/**', 'a/b')).toBe(true);
        expect(isEventMatched('a/**', 'a/b/c')).toBe(true);
        expect(isEventMatched('a/**', 'a/b/c/d')).toBe(true);
        expect(isEventMatched('a/**', 'a/b/c/d/e')).toBe(true);
        expect(isEventMatched('a/**', 'a/b/c/d/e/f')).toBe(true);

        expect(isEventMatched('$-a/**', '$-a/b')).toBe(true);
        expect(isEventMatched('$-a/**', '$-a/b/c')).toBe(true);
        expect(isEventMatched('$-a/**', '$-a/b/c/d')).toBe(true);
        expect(isEventMatched('$-a/**', '$-a/b/c/d/e')).toBe(true);
        expect(isEventMatched('$-a/**', '$-a/b/c/d/e/f')).toBe(true);

    }); 
});

describe("测试事件总线", async () => {
    const eventbus = new FlexEventBus()
    const count = 10
    let nodes: FlexEventBusNode[] = []
    beforeEach(() => {
        nodes = new Array(count).fill(0).map((value, index) => {
            const node = new FlexEventBusNode({ id: `node${index}` })
            node.join(eventbus)
            node.onMessage = vi.fn((message: FlexEventBusMessage) => {
                return message.payload
            })
            return node
        })
    })
    afterEach(() => {
        eventbus.offAll()
    })

    test("测试节点广播消息", () => {
        return new Promise<void>((resolve) => {
            eventbus.broadcast(1)
            nodes.forEach((node) => {
                expect(node.onMessage).toHaveBeenCalled()
                expect(node.onMessage).toBeCalledTimes(1)
                expect(node.onMessage).toHaveReturnedWith(1)
            })
            resolve()
        })
    })

    test("测试给A节点发送数据", () => {
        return new Promise<void>((resolve) => {
            const A = new FlexEventBusNode({ id: "A" })
            A.join(eventbus)
            const B = new FlexEventBusNode({ id: "B" })
            B.join(eventbus)
            A.onMessage = vi.fn((message: FlexEventBusMessage) => {
                expect(message.payload).toBe(100)
                expect(message.from).toBe("B")
                resolve()
            })
            B.send("A", 100)
        })
    })
    test("测试给所有节点发送数据", () => {
        return new Promise<void>((resolve) => {
            const A = new FlexEventBusNode({ id: "A" })
            A.join(eventbus)
            let rec = 0
            nodes.forEach(node => {
                node.onMessage = vi.fn((message: FlexEventBusMessage) => {
                    expect(message.payload).toBe(100)
                    expect(message.from).toBe("A")
                    rec++
                    if (rec == count) resolve()
                })
            })
            nodes.forEach(node => {
                A.send(node.id, 100)
            })
        })
    })

    test("测试给节点异步发送数据", () => {
        return new Promise<void>((resolve) => {
            const A = new FlexEventBusNode({ id: "A" })
            A.join(eventbus)
            const B = new FlexEventBusNode({ id: "B" })
            B.join(eventbus)
            let results: any[] = []
            B.on("/A/x", (message?: FlexEventBusMessage) => {
                results.push(message?.payload)
            })
            B.on("/A/y")     // 无回调函数时由下面接收
            B.onMessage = vi.fn((message: FlexEventBusMessage) => {
                expect(message.payload).toBe(200)
                expect(message.from).toBe("A/y")
                results.push(message?.payload)
            })
            A.emit("x", 100)
            A.emit("y", 200)
            expect(results).toStrictEqual([100, 200])
            resolve()
        })
    })
 

    test("flexEventNode通配符事件订阅",()=>{
    
        const eventbus = new FlexEventBus({ wildcard: true });
        const emitter = new FlexEventBusNode();
        emitter.join(eventbus);
        eventbus.on('**', (a) => {
          console.log(`eventbus.on('**'`, a); // 这里也接收不到
        },{id:"100"});
        eventbus.onAny((a) => {
          console.log(`eventbus`, a);
        });        
        
        emitter.on('*', (a) => {
          console.log(`emitter.on('*'`, a);
        });        
        emitter.on('**', (a) => {
          console.log(`emitter.on('**'`, a);
        });
        emitter.on('update/**', (a) => {
          console.log(`emitter.on('update/**'`, a); // ! 这里接收不到
        });       
        
        emitter.emit('update/a', { a: 1 });
        emitter.emit('update/a/b', { a: 1 });

        
    })


})

describe("LiteEvent事件触发器", () => {
    test("emitAsync", ()=>{
        return new Promise<void>((resolve)=>{
            const event = new LiteEvent() 
            const count = 10 
            Array.from({length:count}).fill(0).forEach((_,index)=>{
                event.on("x",async (value)=>{
                    await delay(10+index*2)
                    return value+index+1
                })
            })        
            event.emitAsync("x",1).then((result)=>{
                expect(result.length).toBe(count)
                result.forEach((value,index)=>{
                    expect(value.status).toBe("fulfilled")
                    // @ts-ignore
                    expect(value.value).toBe(1+index+1)
                })
                resolve()
            })
        })
    })

})
