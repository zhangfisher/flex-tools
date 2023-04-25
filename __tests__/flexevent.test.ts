import { test, expect, vi, describe, afterEach, beforeEach } from "vitest"
import { FlexEvent, FlexEventBus, FlexEventBusMessage, FlexEventBusNode, FlexEventListener } from "../src"


describe("事件触发器", () => {

    test("事件订阅与退订", () => {
        let events = new FlexEvent()
        let fn = vi.fn()
        let eid = events.on("click", fn)
        let listeners = events.getListeners("click")
        expect(listeners.length).toBe(1)
        expect(listeners[0]).toBe(fn)
        events.emit("click")
        expect(fn).toBeCalledTimes(1)
        events.off(eid as number)
        events.emit("click")
        expect(fn).toBeCalledTimes(1)
    })

    test("只订阅一次", () => {
        let events = new FlexEvent()
        let fn = vi.fn()
        let eid = events.once("click", fn)
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
        let fn = vi.fn()
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
        events.off(eid as number)
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
        let eid = events.on("click", fn, { count })

        new Array(count).fill(0).forEach(() => {
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
        expect(listeners1[0]).toBe(listeners2[0])
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
        let list = new Array(10).fill(0).map((value, index) => index + 1)
        list.forEach((value, index) => {
            events.on("click", async (args) => {
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
            let events = new FlexEvent({ retain: true })
            events.emit("a", 1)  // 先触发
            // 后订阅时接收事件
            events.once("a", (data) => {
                expect(data).toBe(1)
            })
            events.once("a", (data) => {
                expect(data).toBe(1)
            })
            // 也支持通配符
            events.emit("a/*/c", 2)  // 先触发
            events.once("a/x/c", (data) => {
                expect(data).toBe(2)
            })
            events.once("a/y/c", (data) => {
                expect(data).toBe(2)                
            })
            events.once("*/*/c", (data) => {
                expect(data).toBe(2)
                resolve()
            })
        })
    })
    test("retain=false时单独为事件指定保留消息", () => {
        return new Promise<void>(resolve => {
            let events = new FlexEvent({ retain: false })
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
        })
    })

})



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
                expect(message.meta?.from).toBe("B")
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
                    expect(message.meta?.from).toBe("A")
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
            B.on("A/x", (message?: FlexEventBusMessage) => {
                results.push(message?.payload)
            })
            B.on("A/y")     // 无回调函数时由下面接收
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


})