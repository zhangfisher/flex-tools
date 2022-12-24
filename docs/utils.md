# 工具库

`flex-decorators`内置了一些有用的工具库可以直接使用。

## asyncSignal

开发中经常碰到需要在某些异步任务完成后做点什么的场景，`asyncSignal`用来创建一个异步信号，可以侦听该异步信号的`resolve/reject`，其本质上是对`Promise`的简单封装。

```typescript
import {asyncSignal,IAsyncSignal} from "flex-decorators/asyncSignal";

// 创建一个异步信号
let signal = asyncSignal()

// 等待异步信号被resolve或reject,并支持指定等待超时和默认返回值
await signal(timeout:number=0 , returns?:any)       

signal.resolve(result?:any)
signal.reject(e?:Error | string);
signal.id    // 标识
// 信号被销毁时，产生一个中止错误，信号的使用者可以据此进行善后处理
signal.destroy() 
// 重置异步信号
signal.reset()    
// 返回异步信号的状态值
signal.isResolved 
signal.isRejected
signal.isPending

```

**以下是一个例子使用`asyncSignal`的简单例子：**

```typescript
import {asyncSignal,IAsyncSignal} from "flex-decorators/asyncSignal";

let signal = asyncSignal()

class Queue{
    signal:IAsyncSignal
    buffer:number[]=[]
    constructor(){
        // 创建信号
        this.signal =  asyncSignal()
    }
    async start(){
        setTimeout(()=>{
            while(true){
                let data = await this.pop()
                //处理数据
            }
        },0)

    }
    async pop(){
        if(this.buffer.length > 0) return this.buffer.shift()
        // 等待有数据，返回的是一个Promise
        await this.signal()
    }
    push(data){
        this.buffer.push(data)
        // 当有数据时通过异步信号
        this.signal.resolve()
    }

}

```




# AsyncSignalManager

管理多个异步信号，并确保能正确resolve和reject

```typescript

let signalManager = new AsyncSignalManager({
    // 所有信号均在1分钟后自动超时，0代表不设超时，并且此值应该大于signal(timeout)时指定的超时值
    timeout:60 * 1000               
})
  
let signalManager = signals.create() 创建一个asyncSignal

signalManager.destroy()   //销毁所有异步信号
signalManager.resolve()    //resolve所有异步信号
signalManager.reject()     //reject所有异步信号
signalManager.reset()      //reset所有异步信号


```

# liteEventEmitter

一个简单的事件发生器.
```typescript
import LiteEventEmitter from "flex-decorators/liteEventEmitter"

let eventEmitter = new LiteEventEmitter()

eventEmitter.on("<事件名称>",callback)              // 订阅事件
eventEmitter.once("<事件名称>",callback)            // 只订阅一次
eventEmitter.off("<事件名称>",callback)             // 退订事件
eventEmitter.offAll()                               // 退订所有事件
eventEmitter.getListeners()                         //  返回所有侦听器
eventEmitter.emit(event:string,...args:any[])       // 触发事件
eventEmitter.emitAsync(event:string,...args:any[])  // 使用Promise.allSettled触发事件

```