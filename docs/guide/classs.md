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

创建一个魔术类，既可以作为普通类使用，也可以作为函数调用传入参数返回类

```typescript
function createMagicClass<
  BaseClass extends Class,
  Options extends Record<string, any> = Record<string, any>
>(
  classBase: BaseClass,
  options?: CreateMagicClassOptions<BaseClass, Options>
): MagicClassConstructor<BaseClass, Options>;
```

### 使用方法

`createMagicClass` 创建的魔术类具有双重身份：既可以作为普通类使用，也可以作为函数调用传入参数返回类

#### 第 1 步: 创建魔术类

```ts
import { createMagicClass } from "flex-tools/classs"; // [!code ++]
// 基类
class User {
  name: string;
  prefix: string;
  constructor(name: string) {
    this.name = name;
  }
  get title() {
    return `${this.prefix}${this.name}!`;
  }
}

const MagicUser = createMagicClass<typeof User>(User); // [!code ++]
```

#### 第 2 步: 继承魔术类

可以用两种方法来继承魔术类，直接继承魔术类，或通过函数调用为类传入配置参数。

```ts
class Admin extends MagicUser {}
class Guest extends MagicUser() {}
class Customer extends MagicUser() {}
```

:::warning 注意
不能直接实例化`MagicUser`类。
:::

#### 第 3 步: 魔术类配置选项

通过函数调用 `MagicUser()` 时，可以传入参数 `options` 来提供额外配置选项给魔术类，可用于实例化。

```ts
type UserCreateOptions = {
  prefix?: string;
  x?: number;
};

// 基类
class User {
  name: string;
  prefix: string;
  constructor(name: string) {
    this.name = name;
    this.prefix = getMagicClassOptions(this)?.prefix!; // [!code ++]
  }
  get title() {
    return `${this.prefix}${this.name}!`;
  }
}

const MagicUser = createMagicClass<typeof User, UserCreateOptions>(User, {
  prefix: "Hi,", // 默认配置
});

// 覆盖默认配置选项
class Guest extends MagicUser({ prifix: "Hello" }) {}
class Customer extends MagicUser({ prefix: "welcome" }) {}
```

- 在基类中通过`getMagicClassOptions()`方法获取传入的参数选项

#### 第 4 步: 魔术类 HOOK

支持三个生命周期钩子：`onBeforeInstance`、`onAfterInstance` 和 `onErrorInstance`，可以在实例化类前后进行拦截处理。

- **onBeforeInstance**

在实例魔术类之前先执行钩子，可以在此修改实例化参数或者阻止实例化类。

`onBeforeInstance?: (cls: Base, args: any[], options: Options) => void | boolean | object`

可以在 `onBeforeInstance` 钩子中返回 `false` 阻止实例创建，或返回一个类/实例来替换原始类

- **onAfterInstance**

在实例化类后执行钩子。

`onAfterInstance?: (inst: InstanceType<Base>, options: Options) => void`

- **onErrorInstance**

在实例化类后出现异常执行钩子。

### 示例

```ts
type UserCreateOptions = {
  prefix?: string;
  x?: number;
};
class User {
  name: string;
  prefix: string;
  constructor(name: string) {
    this.name = name;
    this.prefix = getMagicClassOptions(this)?.prefix!;
  }
  get title() {
    return `${this.prefix}${this.name}!`;
  }
}

const MagicUser = createMagicClass<typeof User, UserCreateOptions>(User, {
  prefix: "Hi,", // 默认配置
  x: 1,
  onBeforeInstance: (cls, args, _options) => {
    // 创建实例前
  },
  onAfterInstance: (inst, _options) => {
    // 创建实例后
  },
  onErrorInstance: (cls, args, options, err) => {
    // 创建实例出现异常，可用于调试、日志记录
  },
});
//  直接作为类使用
class Admin extends MagicUser {}
class Guest extends MagicUser({ x: 2, prefix: "欢迎," }) {}
class Customer extends MagicUser({ prefix: "尊贵的" }) {}

const user = new User("用户");
const admin = new Admin("管理员");
const guest = new Guest("访客");
const customer = new Customer("客户");

expect(user.title).toBe("用户!");
expect(admin.title).toBe("Hi,管理员!");
expect(guest.title).toBe("欢迎,访客!");
expect(customer.title).toBe("尊贵的客户!");
```
