# 装饰器

`flex-decorators`内置了一些开箱即用的装饰器。

## timeout

当执行被装饰方法出错时，触发`TimeoutError`。

> import { timeout,TimeoutOptions,ITimeoutDecoratorOptionsReader } from "flex-decorators/timeout"

```typescript

export interface TimeoutOptions extends DecoratorOptions {
    value?  : number,                   // 超时时间
    default?: any                       // 如果提供则返回该默认值而不是触发错误
}
// 动态读取参数的接口
export interface ITimeoutDecoratorOptionsReader {
    getTimeoutDecoratorOptions:((options:TimeoutOptions,methodName:string | symbol,decoratorName:string)=>TimeoutOptions) 
    | ((options:TimeoutOptions,methodName:string | symbol,decoratorName:string)=>Promise<TimeoutOptions>)
}
```

- 该装饰器无对应的管理器
- 默认参数是`value`

## retry

当执行被装饰方法执行出错时，根据配置进行重试执行。

> import { retry,RetryOptions,IRetryDecoratorOptionsReader } from "flex-decorators/retry"

```typescript

export interface RetryOptions extends DecoratorOptions {
    count?   : number               // 重试次数
    interval?: number               //重试间隔
    default? : any                  // 失败时返回的默认值
}
export interface IRetryDecoratorOptionsReader {
    getRetryDecoratorOptions(options:RetryOptions,methodName:string | symbol,decoratorName:string):RetryOptions
} 
```

- 默认参数是重试次数`count`

## debounce

使用被装饰的方法具备去抖动执行功能，封装自`throttle-debounce`。

> import { debounce,DebounceOptions,IDebounceDecoratorOptionsReader } from "flex-decorators/debounce"

```typescript

export interface DebounceOptions extends DecoratorOptions { 
    interval:number, 
    atBegin?:boolean
}
export interface IDebounceDecoratorOptionsReader {
    getDebounceDecoratorOptions(options:DebounceOptions,methodName:string | symbol,decoratorName:string):DebounceOptions
}

```

- 默认参数是重试次数`interval`
- 可以参阅[throttle-debounce](https://github.com/niksy/throttle-debounce)更多介绍。


## throttle

使用被装饰的方法具备去节流功能，封装自`throttle-debounce`。

> import { throttle,ThrottleOptions,IThrottleDecoratorOptionsReader } from "flex-decorators/throttle"

```typescript

export interface ThrottleOptions extends DecoratorOptions { 
    interval     : number,
    noLeading?   : boolean,
    noTrailing?  : boolean,
    debounceMode?: boolean
}
export interface IThrottleDecoratorOptionsReader {
    getThrottleDecoratorOptions(options:ThrottleOptions,methodName:string | symbol,decoratorName:string):ThrottleOptions
}
```

- 默认参数是重试次数`interval`
- 可以参阅[throttle-debounce](https://github.com/niksy/throttle-debounce)更多介绍。

## memorize

记住被装饰方法执行结果，再次执行返回上一次执行结果。

> import { memorize,MemorizeOptions,IMemorizeDecoratorOptionsReader } from "flex-decorators/memorize"

```typescript

export interface MemorizeOptions extends DecoratorOptions { 
    // 根据参数计算hash值的函数 | length=参数个数 | boolean=永远返回最近的值或者无效
    hash?: ((args: any[]) => string) | 'length' | boolean  
    expires?:number                             // 有效时间，当超过后失效 
}
export interface IMemorizeDecoratorOptionsReader {
    getMemorizeDecoratorOptions(options:MemorizeOptions,methodName:string | symbol,decoratorName:string):MemorizeOptions
}
```

- `expires`可以用来指定记住多长时间，超出时间后自动失效
- `memorize`会根据指定的`hash`参数对传入的参数计算`hash`，当`hash一致时`才会返回上一次执行结果。如果`hash不一致`，则缓存的上一次结果无效。`hash`参数取值：
    - **`(args: any[]) => string) `** : 通过函数来计算并返回`hash`值。
    - **`length`**: 当传入的参数长度不一样时就认为`hash不一致`
    - **true/false**： 默认值`=true`，总是记住下一次执行结果;`=false`代表该装饰器无效

##  noReentry

避免被装饰函数重复执行。

> import { noReentry,NoReentryOptions,INoReentryDecoratorOptionsReader } from "flex-decorators/noReentry"

```typescript

export interface NoReentryOptions extends DecoratorOptions { 
    silence?:boolean           // 默认true,当重入时默默地返回,=false时会触发错误
}

export interface INoReentryDecoratorOptionsReader {
    getRetryDecoratorOptions(options:NoReentryOptions,methodName:string | symbol,decoratorName:string):NoReentryOptions
}
```

## reliable

该装饰器可以同时提供`timeout`、`retry`、`debounce`、`throttle`、`noReentry`、`memorize`这几个装饰器组合的功能。

> import { reliable,ReliableOptions,IReliableDecoratorOptionsReader } from "flex-decorators/reliable"

```typescript


export interface ReliableOptions extends DecoratorOptions { 
    timeout         : number,                            // 执行失败超时,默认为1分钟
    retryCount      : number,                            // 重试次数
    retryInterval   : number,                            // 重试间隔
    debounce        : number,                            // 去抖动
    throttle        : number,                            // 节流
    noReentry       : boolean,                           // 不可重入
    memorize        : ((args: any[]) => string) | 'length' | boolean  // 记住函数执行结果
}

export interface IReliableDecoratorOptionsReader {
    getRetryDecoratorOptions(options:ReliableOptions,methodName:string | symbol,decoratorName:string):ReliableOptions
}
```
- `reliable`包装函数时是按`noReentry`、`timeout`、`retryCount`、`debounce`、`throttle`、`memorize`的顺序进行封装的，开发者需要自行注意各包装函数之间的冲突等。
- 为了简化配置，部份装饰器的参数做了一些小调整，如`memorize`的`expires`参数无效。


## deprecate

当执行被装饰方法时，在控制台输出废弃警告信息。

> import { deprecate,DeprecateOptions } from "flex-decorators/deprecate"

```typescript

export interface DeprecateOptions extends DecoratorOptions { 
    tips?: string,          // 额外的提示信息
    url?: string            // 额外的网站地址
}
```

## verifyArgs

对当执行被装饰方法时，对传入的参数进行校验和提供默认值。

> import { verifyArgs,VerifyArgsOptions,IVerifyArgsDecoratorOptionsReader } from "flex-decorators/verifyArgs"

```typescript

export interface VerifyArgsOptions extends DecoratorOptions { 
    validate?:(args: any[]) => any | [] | Record<string | symbol, any> | undefined         // 应该返回规范化后的参数
}
export interface IVerifyArgsDecoratorOptionsReader {
    getVerifyArgsDecoratorOptions(options:VerifyArgsOptions,methodName:string | symbol,decoratorName:string):VerifyArgsOptions
}
```
- 本装饰器只有一个参数`validate`
- 当`validate`是一个函数时，其函数签名是`(args: any[]) => any`,该函数可以返回：
    - `true/false`: 代表校验成功或失败
    - 也可以直接返回经过处理后的参数数据，如`(args: any[]) => args.map(arg=>arg+1)`
- 当`validate`是一个`{...}`且入参只有一个时,则代表提供的是参数默认值,会深度合并混入到参数中。例如：

```typescript

class MyClass{
    @verifyArgs({
        id:0,
        count:2,
        page:{
            number:1,
            size:2
        }
    })
    getUsers(options:{id:number,count:number,page:{number:number,size:number}}){
        console.log(options.id,options.count,options.page.number,,options.page.size)
    }
}

let my = new MyClass()

my.getUsers() //  ==>  0 2 1 2
my.getUsers({id:1}) //  ==>  1 2 1 2
my.getUsers({id:1,count:100}) //  ==>  1 100 1 2
// 对page项进行深度合并
my.getUsers({id:1,count:100,page:{number:100}}) //  ==>  1 100 100 2

```
- 当`validate`是一个`[...]`时,则将数组中的值视为默认值，并且对`{...}`类型的参数会进行深度合并混入。

```typescript

class MyClass{
    @verifyArgs([1,2,3,{name:'tom',age:100}])
    getUsers(a:number,b:number,c:number,user:{name:string,age:number}){
        console.log(a,b,c,user.name,user.age)
    }
}

let my = new MyClass()

my.getUsers() //  ==>  1 2 3 tom 100
my.getUsers(100) //  ==>  100 2 3 tom 100
my.getUsers(100,200) //  ==>  100 200 3 tom 100
my.getUsers(100,200,300,{name:"bob"}) //  ==>  100 200 300 bob 100

```

## queue

非常强大的装饰器，可以实现排队执行被装饰方法，当调用被`@queue`装饰的方法时，该调用会进入队列中排队依次执行。

**主要特性如下：**

- 指定排队缓冲区大小
- 支持优先级排队
- 执行失败时的策略
- 重试执行
- 超时处理
- 超过最大排队时间
- 任务跟踪

### 类型接口

> import { queue,QueueOptions,IQueueDecoratorOptionsReader } from "flex-decorators/queue"

```typescript
export type QueueFailureBehaviour  = "ignore" | "retry" | "requeue"
export type QueueOverflowOptions = 'discard' | 'overlap' | 'slide' 
export interface QueueOptions extends DecoratorOptions {
    id?           : string
    length?       : number   
    overflow?     : QueueOverflowOptions                                        // 队列溢出时的处理方式,discard=丢弃,overlap=覆盖最后一条,slide=挤出最早一条
    priority?     : AllowNull<(tasks:QueueTask[])=>QueueTask[]>  | string       // 优先级，当参数只有一个且是Object可以指定对象中的某个键值作为优先级,如果是多个参数，可以指定第几个参数作为排序
    failure?      : QueueFailureBehaviour                                       // 执行出错时的行为，ignore=什么都不做,retry=重试,requeue=重新排队，但是受retryCount限制
    retryCount?   : number
    retryInterval?: number
    timeout?      : number
    default?      : any                                             // 如果提供则返回该默认值而不是触发错误
    objectify?    : boolean                                         // 执行方法后是否返回一个QueueTask对象
    maxQueueTime? : number                                          // 最大的排队时间，超出时会自动丢弃
    onDiscard?    : Function                                        // 当任务被抛弃时的回调
}

export interface IQueueDecoratorOptionsReader {
    getQueueDecoratorOptions(options:QueueOptions,methodName:string | symbol,decoratorName:string):QueueOptions
}

```

### 排队缓冲区

`@queue`默认队列大小为`8`，可以通过`length`参数指定。

### 排队溢出策略

当排队等待执行的调用超过`length`参数指定的数量时，可以通过`overflow`参数指定处理策略，支持三种策略：
- **`discard`**：直接丢弃
- **`overlap`**: 覆盖最近一条，比如队列中已经`[1,2,3,4,5,6,7,8]`个待执行的调用，新调用覆盖最近一个调用，变成`[1,2,3,4,5,6,7,9]`,`@queue`使用`Array.shift`从队列中依次提取任务。
- **`slide`**: 滑动队列，抛弃最旧的一个调用。比如队列中已经`[1,2,3,4,5,6,7,8]`个待执行的调用，新调用覆盖最近一个调用，变成`[2,3,4,5,6,7,8,9]`.

### 执行优先级

通过`priority`可以使得队列变成一个优先级队列，这样就可以实现高优先级的调用得到优先执行。
优先级队列本质上是对队列中的任务按一定的算法对传入参数进行排序。

`priority`支持两种方式指定优先：

- **通过排队函数对队列进行排序**

```typescript
class MyClass{
    @queue({
        priority:(tasks:QueueTask)=>tasks.sort(task1,task2=>{...排序逻辑...})
    })
    getUsers(){
    }
}
```

**注意：**`priority`函数并不是每次调用均会执行，而仅需要时才会执行。


- ***当参数是对象时提供优先级键名**

```typescript
class MyClass{
    @queue({
        priority:'age'                  // 按age参数值升序
        priority:'-age'                 // 按age参数值降序
    })
    getUsers(user:{name:string,age:number}){

    }
}
```
### 执行失败策略

当执行被装饰方法失败时，`failure`可以指定处理策略：

- **`ignore`**: 忽略错误
- **`retry`**: 马上进行重试执行，受`retryCount`和`retryInterval`两个参数约束
- **`requeue`**: 重新入列进行排队，受`retryCount`参数约束,即如果重新入列执行次数到`retryCount`值时才会丢弃。

### 执行超时

使用`timeout`参数可以控制执行被装饰函数的超时时间，超过时会抛出`TimeoutError`。

### 跟踪执行结果

当调用被`@queue`装饰的方法时并不会立刻返回执行结果，因为需要排队执行，返回默认情况下是直接返回的。

如果您需要对执行结果进行跟踪，则需要指定`objectify=true`参数。
```typescript
class MyClass{
    @queue({
        objectify:true
    })
    getUsers(user:{name:string,age:number}){
    }
}
```
当指定`objectify=true`时，执行被`@queue`装饰的方法时会返回一个`QueueTask`实例。
```typescript
let obj = new MyClass()

let task = obj.getUsers({...})

// 任务状态
task.status // == QueueTaskStatus(Queuing=正在等待执行，Cancelled=已经被取肖,Executing=正在执行,Done=执行完毕)
// 等待任务执行完成，包括失败
let result  = await task.done() // 如果执行失败，由返回的是一个Error
// 读取返回结果值,如果执行失败，由返回的是一个Error
console.log(task.returns)
// 如果任务正在排队中，调用此方法可以取消排队
task.cancel()
// 返回任务入列的时间
console.log(task.inqueueTime)
// 侦听任务完成事件
task.on((error,results)=>{.....})
task.once((error,results)=>{.....}) // 只执行一次
// 注销任务完成事件
task.off(callback)

```
### 队列管理器

`@queue`实现了一个`QueueManager`,可以对执行的排队任务进行更加强大控制。

```typescript
import { quque,QueueManager } from "flex-decorators/queue"

let manager = queue.getManager() as QueueManager


```
### 队列执行调度器

每一个被`@queue`装饰的方法均会生成一个`QueueTaskDispatcher`，`QueueTaskDispatcher`实例负责调度执行排队任务。
利用`QueueTaskDispatcher`可以对任务进行更加全面的控制。

```typescript
import { quque,QueueManager } from "flex-decorators/queue"

let manager = queue.getManager() as QueueManager

let my = new MyClass()
// 返回getUsers方法对应的QueueTaskDispatcher
let dispatcher = manager.getDispatcher(my,"getUsers")
// 
dispatcher.clear()  // 清除队列
await dispatcher.waitForIdle() // 等待队列为空
dispatcher.tasks   // 返回队列任务清单
// 入和出列，一般不建议外部调用
dispatcher.push(QueueingTask) 
await dispatcher.pop()  

dispatcher.instance ===  my // 等于对应的类实例
dispatcher.method === my.getUsers 
// 调用任务事件

// 当队列空时调用
dispatcher.on("idle",()=>{})
// 当任务被丢弃时调用
dispatcher.on("discard",(task:QueueTask)=>{})
```

