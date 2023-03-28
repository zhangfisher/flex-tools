# 异步工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/async"
```



## delay

延迟一段时间。

```typescript
 async function delay(ms: number)
```

## delayRejected

延迟一段时间，当超时时会触发错误。

```typescript
 async function delayRejected(ms: number,rejectValue?:any)
```
 
## asyncSignal

开发中经常碰到需要在某些异步任务完成后做点什么的场景，`asyncSignal`用来生成一个异步控制信号，可以侦听该异步信号的`resolve/reject`，其本质上是对`Promise`的简单封装。

- **使用方法**

```typescript

// 第一步：创建异步信号
import {asyncSignal,IAsyncSignal} from "flex-tools";
let signal = asyncSignal()

// 第2步：等待异步信号Resolve或Rejected
await signal()
// 第3步：在其他地方Resolve或Rejected异步信号，例 
 
setTimeout(() =>{
    signal.resolve(result?:any)
    signal.reject(e?:Error | string);
},100)
```

- **说明**

> asyncSignal(constraint?:Function,options?:{timeout:number}={timeout:0})


- 每个异步信号均具一个唯一的ID，即`signal.id`
- `asyncSignal`可以在被`resolve`或`reject`后，再次`await signal()`反复使用。
- 创建`asyncSignal`可以指定一个`约束条件函数`，当调用`signal.reject()`或`signal.resolve()`时，需要**同时满足约束条件函数返回true**，signal才会被`resolve/reject`。如:

```typescript
    // 
    
    let signal = asyncSignal(()=>{
        return true
    })
```

- 创建`asyncSignal`可以指定一个`timeout`参数，如果当`await signal()`超时会自动`rejected`。
- `signal.destroy()`可以销毁信号
- 在调用`await signal(timeout)`可以指定额外的超时。


- **API**

```typescript
signal.id    // 标识
// 信号被销毁时，产生一个中止错误，信号的使用者可以据此进行善后处理
signal.destroy() 
// 重置异步信号
signal.reset()    
// 返回异步信号的状态值
signal.isResolved() 
signal.isRejected()
signal.isPending()

```

- **示例**

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


## AsyncSignalManager

对`asyncSignal`的简单封装，用来管理多个异步信号，并确保能正确`resolve`和`reject`。

```typescript

let signals = new AsyncSignalManager({
    // 所有信号均在1分钟后自动超时，0代表不设超时，并且此值应该大于signal(timeout)时指定的超时值
    timeout:60 * 1000               
})
  
let signal= signals.create()   、、创建一个asyncSignal

signals.destroy()   //销毁所有异步信号
signals.resolve()    //resolve所有异步信号
signals.reject()     //reject所有异步信号
signals.reset()      //reset所有异步信号

```