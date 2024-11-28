# 事件工具

```typescript
import { <函数名称> } from "flex-tools"
import { <函数名称> } from "flex-tools/events"
```


## FlexEvent

一个简单的事件发生器，可以用来替代`eventemitter2`。

### 实例化

```typescript
import { FlexEvent } from "flex-tools"

let events = new FlexEvent({
    context?: any               // 可选的上下文对象，当指定时作为订阅者的this
    ignoreError?: boolean       // 是否忽略订阅者的执行错误  
    wildcard?: boolean          // 是否启用通配符订阅  
    delimiter?:string           // 当启用通配符时的事件分割符
    retain?:boolean             // 是否保留事件最后一次触发的消息
    onWatch?:(params:FlexEventWatchParams<Message>)=>void            // 用来监视事件订阅/触发/接收等行为，供调试使用
})
```

### 订阅事件

```typescript
let listenerId = events.on("<事件名称>",callback)              // 订阅事件
let listenerId = events.once("<事件名称>",callback)            // 只订阅一次
let listener = events.on("<事件名称>",callback,{objectify:true}) 
listener.off() //退订
// 退订
events.off(listenerId)
events.off("<事件名称>",callback)             // 退订事件
events.off("<事件名称>")             // 退订事件
events.offAll()                               // 退订所有事件


events.getListeners()                         //  返回所有侦听器
events.emit(event:string,message?:any)       // 触发事件
events.emitAsync(event:string,message?:any)  // 使用Promise.allSettled触发事件
```
### 等待事件触发

```typescript
await events.waitFor(event:string)              // 等待某个事件触发
await events.waitFor("a")                       // 等待a事件触发
await events.waitFor(["a","b"])                 // 等待a或b中的任意一个事件触发
await events.waitFor("a,bcc"])                  // 等待a,b,c均触发事件
// 等待a事件触发，超时时间为2000毫秒，超时会触发TimeoutError
await events.waitFor("a",2000)             
// 等待a或b或c中的任意一个事件触发时返回
await events.waitFor(["a","b","c"],2000)
// 等待a,b,c事件均触发时返回
await events.waitFor("a,b,c",2000)                 // 等待a,b均触发事件

```

### 通配符

`FlexEvent`在订阅和发布时均支持启用通配符

```typescript
events.on("a/*",callback)
events.emit("a/b")                  // 匹配触发

events.on("a/*/c",callback)
events.emit("a/b/c")                  // 匹配触发
events.emit("a/x/c")                  // 匹配触发

events.on("a/**/x",callback)
events.emit("a/b/c/x")              // 匹配触发
events.emit("a/b/x")                // 匹配触发
events.emit("a/b/c/d/e/x")          // 匹配触发

// 也可以触发通配符事件

events.on("a/x/c",callback)          // 匹配触发
events.on("a/y/c",callback)          // 匹配触发
events.on("a/z/c",callback)          // 匹配触发
events.emit("a/*/c",1)               // 通配符触发
events.emit("a/**",1)               // 通配符触发


```

- 订阅和发布时均支持通配符，可以通过`wildcard=false`来关闭此功能。 

    
### 上下文

构建`FlexEvent`时可以指定`context`参数作为订阅函数的`this`

### 消息类型

`FlexEvent`有一个泛型可以用来指定消息类型，如下：

```typescript
const type Message ={
    type:string,
    payload:any
}
const events = new FlexEvent<Message>()
```

### 粘性消息

当配置`retain=true`时,会保留最后一次触发的消息,这样当有新的订阅时就可以马上接收到最近的消息了.

```typescript
 let events = new FlexEvent({retain:true})
events.emit("a",1)  // 先触发,后订阅
events.once("a",(data)=>{
    expect(data).toBe(1)
}) 
events.emit("b",1,false)

// 当retain=false时也可以指定在emit单独为某个事件指定retain参数
let events = new FlexEvent()
events.emit("a",1,true)  // 先触发,后订阅
events.once("a",(data)=>{
    expect(data).toBe(1)
}) 

```
- 当启用`retain=true`时,所有触发发的事件消息均会被保留最后一条,并在新的订阅时立即发送给订阅者
- 也可以在`emit`时单独指定`emit(event,message,true)`来保留某个事件的最后一条消息.由于`emit`的第三个参数是`retain`参数,所以当`retain=true`时,可以使用`emit(event,message,false)`来禁用某个事件的粘性消息.也可以在`retain=false`时使用`emit(event,message,true)`来单独启用某个事件的粘性消息.

### 泛型

`FlexEvent`支持两个泛型参数：

- `Message` 指定消息类型，默认为`any`
- `Events` 指定事件名称类型,默认为`string`


```typescript

const events =  new FlexEvent<Message,'a' | 'b' | 'c'>()
events.on("aaa") // ERROR
events.on("a")  // OK
```

**注意**: 

当指定`Events`泛型参数时，虽然约束了事件名称，但是由于`FlexEvent`支持通配符，所以在使用通配符时可能会出现类型不匹配的情况。


### 监视事件

`FlexEvent`提供了一个`onWatch`方法用来监视事件的订阅/触发/接收等行为，供调试使用。


```ts
export type FlexEventWatchType = "on" | "once" | "off" | "offAll"                                 
                                | 'emit' | 'execute' 
                                | 'wait-begin' | 'wait-end'  | 'wait-timeout' 

export type FlexEventWatchParams<Message=any> = {
    type       : FlexEventWatchType
    event      : string
    listener?  : {id:string,fn?:string | Function,count?:number}
    message?   : Message
    retain?    : boolean
    async?     : boolean
}


let events = new FlexEvent({onWatch:(params:FlexEventWatchParams<Message>)=>{
    console.log(params)
})

events.on("a",()=>{}) // {type:"on",event:"a",listener:{id:"xxxx",fn:"xxxx"},message:undefined}

```

**注意**：

`onWatch`回调一般用于调试，不要在生产环境中使用。


## LiteEvent

`LiteEvent`是`FlexEvent`的简化版本，代码量减少约一半，当需要一个简单的事件触发器时可以使用。

与`FlexEvent`主要差别在于：

- 不支持通配符
- `waitFor`只能支持单个事件
- 不支持`emitAsync`方法
- 移除了一些不常用的方法，如`getListeners`等

## FlexEventBus

基于`FlexEvent`实现的简单的事件总线,用来提供一个应用模块之间通讯的机制。

**主要特性:**

- 包含`FlexEventBus`和`FlexEventBusNode`两个类 
- 应用可以构建议`1-N`个节点`FlexEventBusNode`可以接入到`FlexEventBus`实例中
- 可以广播消息给所有节点
- 可以在节点之间进行`点对点`发送消息
- 提供基于`发布/订阅`节点通讯机制


### 快速入门

- **第1步: 创建总线实例**

```typescript
const eventbus = new FlexEventBus()
```

- **第2步: 创建节点**

```typescript
const aNode =  new FlexEventBusNode({id:`a`})
aNode.join(eventbus)
const bNode =  new FlexEventBusNode({id:`b`})
bNode.join(eventbus)
```

- **第3步: 节点间通讯**

```typescript

aNode.send("b",1)       // 向b节点发送消息
aNode.emit("run",1)       // a节点触发`run`事件

// b节点接收消息
b.onMessage=(message:FlexEventBusMessage)=>{

}

// bNode订阅aNode的事件，接收到的消息通过onMessage接收
b.on("a/run")

// bNode订阅aNode的事件时，指定消息侦听器
b.on("a/run",(message:FlexEventBusMessage)=>{
    // 
})
```

- **第4步:广播消息给所有节点**

```typescript

aNode.broadcast(1)

eventbus.broadcast("xxxx")

```

### 指南

#### 创建总线实例

创建总线实例只需要简单地实例即可。

```typescript

const eventbus = new FlexEventBus({
    //参阅FlexEvent的构建参数
})

```

- `FlexEventBus`继承自`FlexEvent`
- 

#### 创建节点

创建节点有两种方法：

```typescript

// 直接实例化
let node = new FlexEventBusNode({
    id:"<节点的唯一标识>",
    receiveBroadcast:true       // 是否接收广播消息
    onMessage:<Function>        // 提供一个接收消息的函数
})

// 继承方式
class MyModule extends FlexEventBusNode{
    constructor(){
        super({id:"<节点的唯一标识>"})
    }
    onMessage(message?:FlexEventBusMessage){
        // 
    }
}
 
```
#### 消息格式

事件总线内部通讯的消息采用统一格式，如下：L

```typescript
interface FlexEventBusMessage{
    from?:string                                // 消息来源=<节点的id>/<事件名称>
    id?:number                                  // 消息唯一标识用来跟踪消息时有用
    meta?:FlexEventBusMessageMeta
    payload?:any
}
```

- `id`字段是一个递增的字段
- `meta`字段供扩展保存一些额外的数据
- `from`字段为`<消息来源节点id>/<事件名称>`，如果调用的是`send`方法，则等于`<消息来源节点id>`。

#### 点对点通讯

每个节点均具有一个唯一的`id`，然后节点实例化时会在`FlexEventBus`实例上订阅`${节点ID}/$data`事件。
基于此原理，如果要给某个节点发送数据，只需要触发`${节点ID}/$data`事件即可。
如此，如果想要给某个节点发送消息

```typescript
const A = new FlexEventBusNode({id:"A"})
A.join(eventbus)
const B = new FlexEventBusNode({id:"B"})
B.join(eventbus)
A.onMessage = vi.fn((message:FlexEventBusMessage)=>{
    expect(message.payload).toBe(100)
    expect(message.meta?.from).toBe("B")
    resolve()
})            
B.send("A",100)
//

eventbus.send("A",100)

```

#### 发布/订阅事件

节点可以调用`emit`触发节点事件，触发的事件会自动添加节点id前缀。比如:

```typescript
const A = new FlexEventBusNode({id:"A"})
A.join(eventbus)
const B = new FlexEventBusNode({id:"B"})
B.join(eventbus)
A.onMessage = vi.fn((message:FlexEventBusMessage)=>{
    
})  

// A节点触发事件
A.emit("x",100)     // 等效于 eventbus.emit("A/x",{from:"A/x",payload:100})

// 
B.onMessage = (message:FlexEventBusMessage)=>{
    
}
// B节点订阅A节点发布的x事件
B.on("A/x")   // 没有指定侦听器时，默认由B.onMessage处理
// 也可以指定侦听函数
B.on("A/x",(message:FlexEventBusMessage)=>{
    
})

```

- 关于`发布/订阅`的API可以参阅`FlexEvent`

#### 广播消息

所有节点默认均会订阅`$ALL`事件，只需要在总线上触发`$ALL`事件均可以让所有节点(`在onMessage上`)接收到消息。

```typescript
const A = new FlexEventBusNode({id:"A"})
A.join(eventbus)

A.broadcast("内容")       // 广播到所有节点
eventbus.broadcast("内容")
```
- 节点可以通过设置`receiveBroadcast=false`来禁用接收广播消息。

#### API

- **FlexEventBus**

```typescript
let eventbus = new FlexEventBus({
    // ...参阅FlexEvent参数
})

// FlexEventBus继承自FlexEvent，扩展以下方法:

eventbus.nodes            // 返回接收总线的节点id列表
// 给指定节点发送消息
eventbus.send(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta)
// 给所有节点发送消息
eventbus.broadcast(payload:any,meta?:FlexEventBusMessageMeta)

```

- **FlexEventBusNode**

```typescript
const A = new FlexEventBusNode({id:"A"})

A.join(eventbus)      // 接入到总线
A.disjoin()           // 从总线中断开
// 订阅事件，如果event中包括delimiter字符(默认是/)
A.on(event:string,listener?:FlexEventListener<FlexEventBusMessage>)
A.on("xxx")   // 订阅本节点的事件并在onMessage中接收
A.on("xxx",(message)=>{...})   // 订阅本节点的事件并在指定侦听器中接收
A.on("B/xxx")   // 订阅B节点的事件并在onMessage中接收
A.on("B/xxx",(message)=>{...})   // 订阅B节点的事件并在指定侦听器中接收

// 订阅一次事件，其他同on方法
A.once(event:string,listener?:FlexEventListener<FlexEventBusMessage>)

// 等待某个事件触发，并可以指定等待超时时间
// 同样的，如果是本节点事件则可以省略节点名称
await A.waitFor(event:string,timeout?:number)

// 向指定的节点发送消息
send(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta)
// 向指定的节点发送消息并返回结果
await A.sendAsync(nodeId:string,payload:any,meta?:FlexEventBusMessageMeta)

// 触发事件，自动添加本节点id前缀
// 如emit("xx") == emit("A/xx)
// 如emit("xx/yy") == emit("A/xx/yy)
A.emit(event:string,payload:any,meta?:FlexEventBusMessageMeta)
// emit的异步版本，采用Promise.allSettled并返回结果
await A.emitAsync(event:string,payload:any,meta?:FlexEventBusMessageMeta)
// 广播消息
A.broadcast(message:FlexEventBusMessage,useAsync:boolean=false)

```
