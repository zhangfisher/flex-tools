# 快速入门

本例以开发一个`@Cache`装饰器为例来介绍如何使用`FlexDecorators`快速方便地开发一个装饰器,体验`FlexDecorators`为您带来的方便和强大。

设想中的`@Cache`装饰器可以实现：

- 能对类函数的执行结果进行缓存
- 所有类均可以使用
- 使函数传入参数进行Hash后作为缓存键
- 支持多种缓存存储后端

## 第一步：安装

安装`flex-decorators`

```typescript
> npm install flex-decorators
> yarn add flex-decorators
> pnpm add flex-decorators
```

## 第二步：声明装饰器参数

`@Cache`装饰器支持可选的设定缓存键或缓存有效期，所有我们设计两个可选参数`key`和`ttl`.

```typescript
import { DecoratorOptions  } from "flex-decorators"
export interface CacheOptions extends DecoratorOptions{
    key?:string
    ttl?:number
}
```
- **key**: 缓存键默认采用类名+方法名称，也可以自行指定。
- **ttl**: 缓存生存期，以`ms`为单位，默认`0`代表永远有效。

## 第三步：创建缓存管理器

接下我们需要实现一个缓存管理器，负责提供缓存逻辑功能，包括：
- 基本的异步缓存读写操作
- 支持通过配置来指定缓存存取后端

1. **缓存管理器的配置参数**

在本例中，我们假设将缓存数据保存在内存中，为了避免缓存数据占用太多内容，我们需要启动增加一定的管理策略：
- 通过参数来控制缓存的最大条数，并且该参数允许进行配置。
- 定时检查缓存的过期数据并删除，定时检查的时间间隔应该可以配置

因此，我们需要增加定义一个缓存管理器的配置参数类型
```typescript

interface ICacheBackend{
    async has(key:string):boolean
    async set(key:string,value:any,ttl:number=0)
    async get(key:string,defaultValue?:any):any
    clear():void
}

interface CacheManagerOptions extends DecoratorManagerOptions{
    backend?:'file' | 'redis'       // 使用哪一种缓存后端
    size?:string,                   // 缓存区大小
    interval?:number                // 定时检查间隔
}
```

2. **缓存管理器实现**

缓存管理器应该继承自`DecoratorManager`。

```typescript
import { DecoratorManager, DecoratorManagerOptions  } from "flex-decorators"

// 两种缓存后端实现
class FileCacheBackend implements ICacheBackend{}
class ReidxCacheBackend implements ICacheBackend{}

class CacheManager extends DecoratorManager{
    // 保存缓存数据
    #backend:ICacheBackend
    constructor(decoratorName:string,public options:CacheManagerOptions={backend:'file',size:100,interval:30 * 1000}){
        super(decoratorName,options)
        if(this.options.backend=='file'){
            this.#backend= new FileCacheBackend()
        }else if(this.options.backend=='redis'){
            this.#backend= new RedisCacheBackend()
        }
    }
    async has(key:string):boolean{
        return key in this.#values
    }
    async set(key:string,value:any,ttl:number=0){
        await this.#backend.set(key,value,ttl)
    }
    async get(key:string):any{
        return await  this.#backend.get(key)
    }  
    /**
     * 此回调在缓存管理器启动时调用，一般需要在此进行一些初始化工作
     */
    async onStart() {
        this.tmId = setInterval(()=>{
            this._clearExpires()
        },thos.options.interval)
    }
    /**
     * 对应的管理器提供了停止回调，一般可以做一些清理工作
     */
    async onStop() {
        // 清理定时器等工作
        clearInterval(this.tmId)
    }    
    _clearExpires(){
        // 此时编写清除过期数据
        this.#backend.clear()
    }
}
```

## 第四步：创建装饰器

以上已经实现了一个继承自`DecoratorManager`的`CacheManager`负责缓存的处理逻辑。

接下来`@Cache`装饰器主要目的是对函数的执行结果进行缓存，所以我们需要对原始函数进行包装。

```typescript
import { createDecorator  } from "flex-decorators"

export cache = createDecorator("cache",{
    key:undefined,
    ttl:0
},{
    wrapper:function(method:Function,options:CacheOptions,manager?:DecoratorManager,target: Object, propertyKey: string | symbol,descriptor:PropertyDescriptor){
        return async function(this:any){
            let key= options.key || `${target.construct.name}_${options.id}`
            let result
            if(manager){
                result  =  (manager as CacheManager).get(key)
            }
            if(result==undefined){
                result = await method.apply(this,arguments)
                if(manager) (manager as CacheManager).set(key,result)
            }
            return  result
        } 
    },
    asyncWrapper:true,              // 声明异步包装
    manager:CacheManager
})
```

以上我们使用`createDecorator`方法来生成一个名称为`cache`的装饰器。

- 由于读写缓存可能是异步的(本例中是同步的，实际场景中往往需要异步操作，比如缓存到`localStorage`或`Redis`等)，所以在本例中，我们将所有函数统一包装为异步函数，因此需要将`asyncWrapper=true`。
- 然后需要通过`manager`参数来为装饰器提供一个管理器，管理器负责具体的业务逻辑实现。
- `wrapper`参数只负责进行函数包装，应该返回包装后的函数。

## 第五步：启动缓存管理器

上面我们创建了一个`CacheManager`负责缓存的处理逻辑的逻辑，但是存在一个疑问，`CacheManager`实例什么时候被创建？

默认情况下, `flex-decorators`会在首次调用被装饰的方法时自动实例化`CacheManager`实例，并且自动`start`。即**按需延迟实例化和启动**。

也就是说，如果`@cache`装饰器**没有被使用且被装饰器的方法也没有被调用**，则`CacheManager`不会实例化并启动。

缓存管理器的这种默认按需延迟实例化和启动的形为，可以通过配置参数改变，`flex-decorators`支持`立即启动`、`延迟按需启动`、`手动启动`三种启动装饰器管理器的方式，详见指南中关于装饰器管理器的更多说明。

## 第六步：访问缓存管理器

为了对缓存进行全局控制，如清空缓存等，则我们可能需要访问缓存管理器。方法如下：

- **通过装饰器静态方法访问全局管理器**

```typescript
// cache.ts
import { createDecorator  } from "flex-decorators"
export cache = createDecorator(.....)

// 其他文件

import { cache,CacheManager } from "./cache"
let cacheManager =  cache.getManager() as unknown as CacheManager

```

- **在类中访问全局缓存管理器**

`flex-decorators`还支持创建一个管理器装饰器,用来为类注入一个`<decortorName>Manager`的成员变量，用来访问装饰器管理器。

```typescript
 
// cache.ts
import { createDecorator  } from "flex-decorators"
export cache = createDecorator(.....)

export interface cacheManagerOptions extends DecoratorManagerOptions{

}
// 创建一个用在类上面的装饰器顺器
export cacheManager = cache.createManagerDecorator<CacheManager,cacheManagerOptions>(CacheManager,{
    backend:'file'              // 默认使用FileCacheBackend
})

// 其他文件

import { cache,cacheManager,CacheManager } from "./cache"

@cacheManager() 
class MyClass{ }

let myclass = new MyClass()
myclass.cacheManager  // == 缓存管理器实例
```

上面的`@cacheManager`装饰器用来装饰类，目的是为当前类注入一个`cacheManager`的成员变量用来访问全局管理器

## 第七步：缓存管理器作用域

`CacheManager`实例实现了缓存控制逻辑，默认情况下，所有`@cache`装饰器均共享同一个均`CacheManager`实例。
而`flex-decorators`最强大的特性就是支持通过`@cacheManager`来创建多个`CacheManager`实例，`@cache`装饰器会使用其最近的`CacheManager`实例。

**例如：** 在实际业务中，我们需要缓存控制更加精细，我们假设会话管理`SessionManager`模块要使用`Redis`缓存，而`UploadManager`模块使用`File`缓存。使用`flex-decorators`的管理器装饰器机制可以非常容易地实现此特性：

```typescript
// cache.ts
export cacheManager = cache.createManagerDecorator<CacheManager,cacheManagerOptions>(CacheManager,{
    backend:'file'              // 默认使用FileCacheBackend
})

// 其他文件

import { cache,cacheManager,CacheManager } from "./cache"

@cacheManager({
    backend:"redis",
    scope:'class'
}) 
class SessionManager{ }

@cacheManager({
    backend:"file",
    scope:'instance'
}) 
class UploadManager{ } 

// 作用域为class
let sessionManager1 = new SessionManager()
let sessionManager2 = new SessionManager()
sessionManager1.cacheManager // === CacheManager实例，且backend=RedisCacheBackend
sessionManager2.cacheManager // === CacheManager实例，且backend=RedisCacheBackend
sessionManager1.cacheManager == sessionManager2.cacheManager

// 作用域为instance
let uploadManager1 = new UploadManager()
let uploadManager2 = new UploadManager()
uploadManager1.cacheManager // === CacheManager实例，且backend=FileCacheBackend
uploadManager2.cacheManager // === CacheManager实例，且backend=FileCacheBackend
uploadManager1.cacheManager != uploadManager2.cacheManager


@cacheManager({
    backend:"file",
    scope:'global'
}) 
class OtherClass{ } 

// 作用域为global
let other1 = new OtherClass()
let other2 = new OtherClass()
other1.cacheManager // === CacheManager实例，且backend=FileCacheBackend
other2.cacheManager // === CacheManager实例，且backend=FileCacheBackend
other1.cacheManager == other2.cacheManager


```
`@cacheManager`装饰器的最大作用就是：
- 当指定`scope=class | instance`时，可以在类或实例上创建一个新的`CacheManager`实例
- 如果`scope=class`则在类上创建一个`CacheManager`实例,该类上的所有`@cache`装饰器均使用该管理器
- 如果`scope=instance`则在实例上创建一个`CacheManager`实例,每一个实例均会创建管理器,该实例的`@cache`装饰器均使用该管理器
- 并且被装饰器的类注入了一个`cacheManager`的成员变量，用来访问当前类或当前实例的`CacheManager`实例

**在上例中：**
- 所有的`SessionManager`均共享同一个`CacheManager`实例
- 每一个`UploadManager`均具有独立的`CacheManager`实例
- 所有`@cacheManager({scope:'global'})`装饰或没有使用`@cacheManager`装饰的类均使用全局的`CacheManager`实例

## 第八步：使用缓存装饰器

至此，我们已经开发了一个简单的缓存控制机制，在整个应用中可以直接使用

```typescript
import { cache,cacheManager } from "cache"

@cacheManager()  // 可选的，注入一个cacheManager成员变量
class MyClass{
    constructor() {
        let manager = (this as unknow ad CacheManager).cacheManager  // 访问全局缓存管理器
    }
    @cache()    // 使用MyClass_getData作为key
    getData(){  }

    @cache({key:"xxxx"})    // 自定义缓存key
    getData(){  }

    @cache({ttl:60 * 1000})   // 定义缓存生存期
    getData(){  }
}

```

## 小结

上述我们开发了一个具备完备的缓存控制能力的装饰器,与一般的装饰器开发的最大区别在于：

- 装饰器业务逻辑与函数封装分离
- 针对类方法装饰提供了更加语义化清晰的包装接口 

`flex-decorators`的特性并不仅仅于此，更多的特性请参阅指南部分。