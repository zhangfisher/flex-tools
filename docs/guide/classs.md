# 类工具

```typescript
import { <函数名称> } from "flex-tools/classs"
```

## getClassStaticValue

获取当前实例或类的静态变量值.

```typescript
function getClassStaticValue(
  instanceOrClass: object,
  fieldName: string,
  options: { merge?: number; default?: any } = {}
);
```

**说明**:

- `getClassStaticValue`会遍历继承链上的所有静态变量，如果值是`{}`或`数组`，则会进行**合并**。

**示例**:

```typescript

calss A{
   static settings={a:1}
}
calss A1 extends A{
    static settings={b:2}
}

getStaticFieldValue(new A1(),"settings") //==== {a:1,b:2}

class A{
    static value:number | number[] = 1
    get(){ return getClassStaticValue(this,"value",{default:[]}) }
}
class AA extends A{
    static value:number | number[] = 2
}
class AAA extends AA{
    static value = [3,4]
}
let a = new AAA()
console.log(a.get()) //==== [1,2,3,4]

```

## isPropertyMethod

返回指定名称的方法是否是一个属性，即(`GET`、`SET`)

```typescript
function isPropertyMethod(inst: object, name: string);
```

## getClassMethods

返回类中声明的方法列表

```typescript
export interface GetClassMethodsOptions {
  includePrototype?: boolean; // 是否包含原型链上的所有方法
  excludes?: (string | symbol)[] | ((name: string | symbol) => boolean); // 排除
}

export function getClassMethods(obj: object, options?: GetClassMethodsOptions);

// 示例
class A {
  x() {}
  y() {}
}
class AA extends A {
  a1() {}
  a2() {}
  a3() {}
}

getClassMethods(new A()); //   ['x','y']
getClassMethods(new AA()); //   ['x','y','a1','a2','a3']
// 不在父类和祖先类中查找
getClassMethods(new AA(), { includePrototype: false }); //   ['x','y','a1','a2','a3']

getClassMethods(new AA(), { includePrototype: false, excludes: ["x"] }); //   ['y','a1','a2','a3']
```

## createMagicClass

神奇魔法类（Magic Class）是一种特殊的类包装器，它通过`createMagicClass`函数创建，能够赋予普通 JavaScript/TypeScript 类超能力。这个工具让你的类既可以作为构造函数使用，又可以作为函数调用来配置选项，大大增强了类的灵活性和可用性。

### 神奇特性

#### 1. 双重身份

魔法类具有双重身份，可以：

- 作为普通类使用用于继承：`class MyClass extends MagicClass`
- 作为函数调重载构造参数：`class MyClass extends MagicClass(<构造参数>)`

#### 2. 生命周期钩子

提供完整的生命周期钩子，让你能够精确控制实例的创建过程：

- `onBeforeInstance`: 实例创建前触发，可以阻止实例创建或修改类
- `onAfterInstance`: 实例创建后触发，可以对实例进行后处理
- `onErrorInstance`: 实例创建出错时触发，可以进行错误处理

### 指南

#### 创建魔术类

```ts
import { createMagicClass } from "flex-tools/classs";
// 定义一个普通类
type UserType = "admin" | "guest" | "customer";
type UserOptions = { type: UserType; name?: string; age?: number };
class User {
  name: string;
  age: number;
  type: UserType;
  constructor(options: UserOptions) {
    this.name = options.name || "guest";
    this.age = options.age || 18;
    this.type = options.type;
  }
}

const MagicUser = createMagicClass(User);
```

`MagicUser`现在是一个魔术类，可以像普通类一样使用：

```ts
class Admin extends MagicUser {}
class Guest extends MagicUser {}
class Customer extends MagicUser {}
```

也可以作为函数调用重写构造参数：

```ts
class Admin extends MagicUser({ type: "admin" });
class Guest extends MagicUser({ type: "guest" });
class Customer extends MagicUser({ type: "customer" });
```

或者直接返回一个魔术类：

```ts
const Admin = MagicUser({ type: "admin" });
const Guest = MagicUser({ type: "guest" });
const Customer = MagicUser({ type: "customer" });
```

:::warning 提示
`createMagicClass`创建的即是一个类，也是一个可以返回类的函数。
:::

### 实例化钩子

当你使用`MagicUser`创建实例时，你可以使用`onBeforeInstance`、`onAfterInstance`和`onErrorInstance`钩子来拦截实例创建过程：

```ts
import { createMagicClass } from "flex-tools/classs";
// 定义一个普通类
// ....
const MagicUser = createMagicClass(User, {
  onBeforeInstance: (cls, args) => {
    // 在实例化之前执行
  },
  onAfterInstance: (inst) => {
    // 在实例化之后执行
  },
  onErrorInstance: (error, cls, args) => {
    // 在实例化出错时执行
  },
});

const admin = new MagicUser({ type: "admin", name: "admin", age: 18 });
```

#### onBeforeInstance

`(cls: Base, params: Params) => void | boolean | object`

当执行`new Admin({...})`创建 `MagicClass` 实例时，`onBeforeInstance`钩子会被调用，你可以在此:

- 修改`args`参数
- `retturm false`阻止实例化，并触发错误
- 返回一个类，然后使用该类创建实例
- 直接返回新的实例

#### onAfterInstance

`(inst: InstanceType<Base>) => void`

在实例化之后执行,可以在此得到实例。

#### onErrorInstance

`(error: Error, cls: Base, params: Params) => void`

在实例化出错时执行，可以在此得到错误信息。

#### 重载类构造参数

默认情况下，魔术类与基类具有相同的构造参数，如下：

```ts
import { createMagicClass } from "flex-tools/classs";

// 创建以下三个重载了构造参数的魔术类
class Admin extends MagicUser({ type: "admin"});
class Guest extends MagicUser({ type: "guest"});
class Customer extends MagicUser({ type: "customer" });


// ❌类型错误： 创建魔术类的实例
const admin = new Admin({ name: "admin", age: 18 });
const guest = new Guest({ name: "guest", age: 23 });
const customer = new Customer({ name: "customer", age: 36 });


// ✅正确： 创建魔术类的实例
const admin = new Admin({ type: "admin",ame: "admin", age: 18 });
const guest = new Guest({ type: "guest", name: "guest", age: 23 });
const customer = new Customer({ type: "customer",name: "customer", age: 36 });

```

我们预期能使用`new Admin({ name: "admin", age: 18 })`创建`type=admin`的`Admin`实例，不需要再指定`type=admin`。但事实上会提示类型错误: 缺少构造参数`{ type: UserType }`。

这是因为所有魔术类都继承了基类，包括构造参数与基类一致，而基类的构造参数是`{ type:string;name?: string; age?: number }`，所以`Admin`的构造参数也是`{ type:string;name?: string; age?: number }`。

此时，需要使用重载基类的构造参数。

- **指定重载泛型参数**

```ts
class Admin extends MagicUser<[{name:string,age:number}]>({ type: "admin" });
// ✅正确： 创建魔术类的实例
const admin = new Admin({ name: "Jack", age: 28 });
// admin.name === "Jack" ✅正确
// admin.type === "admin" ✅正确
// admin.age === 28 ✅正确
```

当魔术类和基类的构造参数兼容时，可以只指定泛型参数就可以消除类型错误。
在上例中，魔术类和基类的构造参数都是`{ type:UserType;name?: string; age?: number }`，所以可以只指定`[{name:string,age:number}]`。

构造参数兼容指的是：**魔术类和基类的构造参数的个数相同，魔术类的构造参数会覆盖基类的构造参数,如果对应位置的参数是一个 Record<string,any>，则使用 Object.assign(<基类构造参数>,<魔术类构造参数>)进行合并。**

```ts
class A {
  constructor(a: number, b: string, options: { x: number; y: number }) {}
}
const MagicA = createMagicClass(A);
// 默认行为
const a1 = new MagicA(1, "a", { x: 1, y: 2 });

// 如果你希望可以省略options参数，可以指定泛型参数
const a2 = new MagicA<[number, string]>(1, "a");
```

- **指定`params`参数**

当你希望魔术类和基类的构造参数不兼容时，需要指定`params`参数。

```ts
import { createMagicClass } from "flex-tools/classs";

// 创建以下三个重载了构造参数的魔术类
class Admin extends MagicUser<[]>({
  params: [{ type: "admin", name: "admin", age: 18 }],  // 指定params参数
});

const admin = new Admin();
// admin.name === "admin" ✅正确
// admin.type === "admin" ✅正确
// admin.age === 18 ✅正确
```

通过`params`参数可以指定魔术类的构造参数静态值，同时指定构造泛型参数`[]`,也就是不需要构造参数，这样实例会就可以得到`Admin({ type: "admin", name: "admin", age: 18 })`实例了。

如果参数是兼容的，也可以只指定部份参数，如下:

```ts
import { createMagicClass } from "flex-tools/classs";


class Admin extends MagicUser<[{name:string,age:number}]>({
  params: [{ type: "admin" }],  // 指定params参数
});

const admin = new Admin({ name: "admin", age: 18 });
// admin.name === "admin" ✅正确
// admin.type === "admin" ✅正确
// admin.age === 18 ✅正确
```

如果参数是不兼容的，则需要指定构造参数转换函数，如下:

```ts
import { createMagicClass } from "flex-tools/classs";

 class Admin extends MagicUser<[string, number]>({
  params: （params,parentParams）=> {
    return { type: "admin",
      name: params[0],
      age: params[1]
    };
  }
});

const admin = new Admin("tom", 18);
// admin.name === "admin" ✅正确
// admin.type === "admin" ✅正确
// admin.age === 18 ✅正确
```

由于新构建的魔术类和基类的构造参数不兼容，所以需要指定`params`转换参数，同时指定构造泛型参数`[string, number]`，也就是魔术类需要两个参数，然后通过`params`参数的转换函数将魔术类的参数转换基类所需要的构造参数。

### 派生魔术类

创建的魔术类可以进行派生或继承，如下：

```ts
class Vehicle {
  type?: string;
  constructor(config: { type?: string }) {
    this.type = config.type;
  }
}
const MagicVehicle = createMagicClass(Vehicle);
const Car = MagicVehicle({ type: "汽车" });
const SportsCar = Car({ type: "跑车" });
const LuxurySportsCar = SportsCar({ type: "豪华跑车" });

const vehicle = new MagicVehicle({ type: "交通工具" });
const car = new Car({ type: "小轿车" });
const sportsCar = new SportsCar({});
const luxurySportsCar = new LuxurySportsCar({});
```

### 嵌套魔术类

`createMagicClass`函数返回的魔术类可以嵌套使用，如下：

```ts
class User {}

const MagicUser = createMagicClass(User);

// MagicUser本身就一个类，可以直接实例化
const user = new MagicUser({ name: "user" });
// 也可以基于MagicUser返回重载了构造参数的类
const Admin = MagicUser({ type: "admin" });
const admin = new Admin({ name: "admin" });
// 可以在Admin的基础上返回重载了构造参数的类，可以多级重载
const SuperAdmin = Admin({ type: "superAdmin" });
const superAdmin = new SuperAdmin({ name: "superAdmin" });
```

除了以上的常规用法，还可以嵌套魔术类，如下：

```ts
const Guest = MagicUser({
  params: [{ type: "guest" }], // 构造参数重载
  // 钩子
  onBeforeInstance: (cls, params) => {
    params.name = "guest";
  },
}); // 等效于 const Guest = createMagicClass(MagicUser, { ... });
```

当魔术类作为函数调用时，如果参数是`createMagicClass`的参数，则内部会调用`createMagicClass`。
如上例中，`Guest`等效于`createMagicClass(MagicUser, { params: [{ type: "guest" }], onBeforeInstance: (cls, params) => { params.name = "guest"; } })`。

### 用途

魔术类的设计使其在多种场景下都能发挥强大作用，以下是一些主要用途：

#### 1. 配置化组件系统

魔术类非常适合构建可配置的组件系统，特别是在前端框架中：

```ts
class Component {
  constructor(options: ComponentOptions) {
    // 基础组件实现
  }
}

const MagicComponent = createMagicClass(Component);

// 预配置的组件变体
const Button = MagicComponent({ type: "button", theme: "default" });
const PrimaryButton = Button({ theme: "primary" });
const DangerButton = Button({ theme: "danger" });

// 使用时无需重复配置
new PrimaryButton({ label: "确认" });
```

**优点**：减少重复配置，提高代码复用性，使组件系统更加灵活。

#### 2. 依赖注入系统

魔术类可以优雅地实现依赖注入，特别是与装饰器结合使用：

```ts
// 依赖收集器
const dependencies = new Map();

// 依赖装饰器
function Inject(serviceKey: string) {
  return function (target: any, propertyKey: string) {
    dependencies.set(`${target.constructor.name}.${propertyKey}`, serviceKey);
  };
}

class Service {
  getData() {
    return "service data";
  }
}

class Controller {
  @Inject("Service")
  private service!: Service;

  process() {
    return this.service.getData();
  }
}

// 使用魔术类增强Controller
const MagicController = createMagicClass(Controller, {
  onBeforeInstance: (cls, params) => {
    // 不修改原始类，而是通过钩子注入依赖
  },
  onAfterInstance: (instance) => {
    // 实例创建后注入依赖
    for (const [key, serviceKey] of dependencies.entries()) {
      if (key.startsWith(instance.constructor.name)) {
        const propName = key.split(".")[1];
        instance[propName] = container.get(serviceKey);
      }
    }
  },
});

// 使用增强后的控制器
const controller = new MagicController();
```

**优点**：实现非侵入式依赖注入，无需修改原始类代码，便于测试和维护。

#### 3. 多级继承与特性组合

魔术类支持多级继承和特性组合，使代码结构更加清晰：

```ts
class BaseModel {
  constructor(config: ModelConfig) {
    // 基础模型实现
  }
}

const MagicModel = createMagicClass(BaseModel);

// 特性组合
const TimestampModel = MagicModel({
  onAfterInstance: (instance) => {
    instance.createdAt = new Date();
    instance.updatedAt = new Date();
  },
});

const ValidatedModel = TimestampModel({
  onBeforeInstance: (cls, params) => {
    // 验证逻辑
    if (!params.isValid()) throw new Error("Invalid model data");
  },
});

// 业务模型
const UserModel = ValidatedModel({ tableName: "users" });
```

**优点**：实现关注点分离，避免深层继承带来的复杂性，使代码更易于维护。

#### 4. 插件化架构

魔术类可以作为插件系统的基础，实现功能的动态组合：

```ts
class Application {
  plugins: any[] = [];
  constructor(config: AppConfig) {
    // 应用初始化
  }
}

const MagicApp = createMagicClass(Application);

// 创建插件
const LoggerPlugin = {
  install(app) {
    app.logger = { log: console.log };
  },
};

const RouterPlugin = {
  install(app) {
    app.router = {
      /* 路由实现 */
    };
  },
};

// 应用插件
const EnhancedApp = MagicApp({
  onAfterInstance: (instance) => {
    [LoggerPlugin, RouterPlugin].forEach((plugin) => {
      plugin.install(instance);
      instance.plugins.push(plugin);
    });
  },
});

// 创建应用实例
const app = new EnhancedApp({ name: "MyApp" });
```

**优点**：实现松耦合的插件架构，便于功能扩展和维护。

#### 5. 工厂模式增强

魔术类可以增强传统工厂模式，提供更灵活的实例创建方式：

```ts
class Product {
  constructor(config: ProductConfig) {
    // 产品实现
  }
}

const MagicProductFactory = createMagicClass(Product, {
  onBeforeInstance: (cls, params) => {
    // 根据参数动态决定创建何种产品
    if (params.type === "special") {
      return new SpecialProduct(params);
    }
  },
});

// 预配置产品类型
const StandardProduct = MagicProductFactory({ quality: "standard" });
const PremiumProduct = MagicProductFactory({ quality: "premium" });

// 创建产品实例
const product1 = new StandardProduct({ name: "Product 1" });
const product2 = new PremiumProduct({ name: "Product 2", type: "special" });
```

**优点**：简化工厂模式实现，提供更灵活的实例创建控制。

#### 6. 中间件系统

魔术类可以实现类似中间件的功能链：

```ts
class Handler {
  constructor(config: HandlerConfig) {
    // 处理器实现
  }

  handle(request) {
    // 基础处理逻辑
    return request;
  }
}

const MagicHandler = createMagicClass(Handler);

// 添加中间件
const LoggingHandler = MagicHandler({
  onAfterInstance: (instance) => {
    const originalHandle = instance.handle;
    instance.handle = function (request) {
      console.log("Request:", request);
      const result = originalHandle.call(this, request);
      console.log("Result:", result);
      return result;
    };
  },
});

const AuthHandler = LoggingHandler({
  onAfterInstance: (instance) => {
    const originalHandle = instance.handle;
    instance.handle = function (request) {
      if (!request.isAuthenticated) {
        throw new Error("Unauthorized");
      }
      return originalHandle.call(this, request);
    };
  },
});

// 使用处理器
const handler = new AuthHandler({});
handler.handle({ data: "test", isAuthenticated: true });
```

**优点**：实现可组合的处理流程，便于功能扩展和复用。

### 小结

神奇魔法类通过`createMagicClass`函数提供了一种优雅而强大的方式来增强 `JavaScript/TypeScript` 类的能力。它不仅保留了原始类的所有功能，还添加了配置选项、生命周期钩子和灵活的实例化方式，使你的代码更加灵活、可配置且易于维护。

无论你是构建复杂的 UI 组件、可配置的工具类，还是需要精细控制实例创建过程的系统，神奇魔法类都能为你提供强大而灵活的解决方案。

详见[flex-tools](https://github.com/zhangfisher/flex-tools/guide/classs.html#createmagicclass)。
