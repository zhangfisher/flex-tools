import { test, expect } from "bun:test";
import { callable } from "../src/misc/callable";

test("基本调用功能 - 默认 call 方法", () => {
    class MyClass {
        constructor(private value: number) {}

        call(x: number) {
            return this.value + x;
        }
    }

    const instance = new MyClass(10);
    const callableInstance = callable(instance);

    // 测试可以直接调用
    expect(callableInstance(5)).toBe(15);
});

test("基本调用功能 - 自定义 callMethod", () => {
    class MyClass {
        constructor(private value: number) {}

        execute(x: number) {
            return this.value * x;
        }
    }

    const instance = new MyClass(10);
    const callableInstance = callable(instance, { callMethod: "execute" });

    // 测试可以直接调用
    expect(callableInstance(5)).toBe(50);
});

test("调用不存在的 callMethod 时抛出错误", () => {
    class MyClass {
        value = 10;
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试调用时抛出错误
    // @ts-ignore
    expect(() => callableInstance()).toThrow("Method 'call' not found on instance");
});

test("属性访问 - 可以访问实例属性", () => {
    class MyClass {
        public name = "test";
        private _value = 42;

        getValue() {
            return this._value;
        }

        setValue(v: number) {
            this._value = v;
        }

        call() {
            return this._value;
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试可以访问属性
    expect(callableInstance.name).toBe("test");
    expect(callableInstance.getValue()).toBe(42);

    // 测试通过方法设置属性
    callableInstance.setValue(100);
    expect(callableInstance.getValue()).toBe(100);
});

test("方法绑定 - 访问方法时 this 绑定到原实例", () => {
    class MyClass {
        constructor(private value: number) {}

        call() {
            return this.value;
        }

        add(x: number) {
            return this.value + x;
        }

        multiply(x: number) {
            return this.value * x;
        }
    }

    const instance = new MyClass(10);
    const callableInstance = callable(instance);

    // 测试方法访问时 this 绑定正确
    const add = callableInstance.add;
    expect(add(5)).toBe(15);

    const multiply = callableInstance.multiply;
    expect(multiply(3)).toBe(30);
});

test("对象展开 - data 对象的属性可以展开", () => {
    class MyClass {
        public data = {
            a: 1,
            b: 2,
            c: 3,
        };

        public name = "test";
        public version = 1;

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试对象展开时只包含 data 的属性
    const spread = { ...callableInstance };
    expect(spread.a).toBe(1);
    expect(spread.b).toBe(2);
    expect(spread.c).toBe(3);
    expect(spread.name).toBeUndefined();
    expect(spread.version).toBeUndefined();
});

test("对象展开 - 自定义 dataKey", () => {
    class MyClass {
        public values = {
            x: 10,
            y: 20,
        };

        public name = "test";

        execute() {
            return "executed";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance, { callMethod: "execute", dataKey: "values" });

    // 测试对象展开时只包含 values 的属性
    const spread = { ...callableInstance };
    expect(spread.x).toBe(10);
    expect(spread.y).toBe(20);
    expect(spread.name).toBeUndefined();
});

test("属性访问优先级 - data 对象属性优先于实例属性", () => {
    class MyClass {
        public data = {
            name: "from-data",
            value: 100,
        };

        public name = "from-instance";

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试 data 对象的属性优先
    expect(callableInstance.name).toBe("from-data");
    expect(callableInstance.value).toBe(100);
});

test("in 操作符 - 可以检测实例属性存在", () => {
    class MyClass {
        public data = {
            a: 1,
        };

        public name = "test";

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试 in 操作符 - 只检查实例属性
    expect("name" in callableInstance).toBe(true);
    expect("data" in callableInstance).toBe(true);
    expect("nonexistent" in callableInstance).toBe(false);
});

test("Object.keys - 只返回 data 对象的键", () => {
    class MyClass {
        public data = {
            a: 1,
            b: 2,
        };

        public name = "test";

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试 Object.keys
    const keys = Object.keys(callableInstance);
    expect(keys).toContain("a");
    expect(keys).toContain("b");
    expect(keys).not.toContain("name");
});

test("Object.getOwnPropertyNames - 返回 data 对象的键和函数属性", () => {
    class MyClass {
        public data = {
            x: 10,
            y: 20,
        };

        public name = "test";

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试 Object.getOwnPropertyNames
    const names = Object.getOwnPropertyNames(callableInstance);
    expect(names).toContain("x");
    expect(names).toContain("y");
    // 函数的属性如 name, length, prototype 也会出现
    expect(names).toContain("name"); // 函数的 name 属性
});

test("可以设置实例属性", () => {
    class MyClass {
        public name = "original";
        public data = {
            value: 10,
        };

        call() {
            return this.name;
        }

        setName(newName: string) {
            this.name = newName;
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试通过方法设置属性
    callableInstance.setName("modified");
    expect(callableInstance.name).toBe("modified");
    expect(instance.name).toBe("modified");
});

test("可调用对象是函数类型", () => {
    class MyClass {
        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试是函数类型
    expect(typeof callableInstance).toBe("function");
    // Proxy 对象的 instanceof 会检查目标的原型链
    expect(callableInstance.call).toBeDefined();
});

test("调用时 this 指向原实例", () => {
    class MyClass {
        private counter = 0;

        call() {
            this.counter++;
            return this.counter;
        }

        getCounter() {
            return this.counter;
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试调用时 this 指向原实例
    expect(callableInstance()).toBe(1);
    expect(callableInstance()).toBe(2);
    expect(callableInstance.getCounter()).toBe(2);
});

test("空 data 对象时的对象展开", () => {
    class MyClass {
        public data: Record<string, any> = {};

        public name = "test";

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试空 data 对象的展开
    const spread = { ...callableInstance };
    expect(Object.keys(spread)).toHaveLength(0);
});

test("没有 data 属性时的对象展开", () => {
    class MyClass {
        public name = "test";

        call() {
            return "called";
        }
    }

    const instance = new MyClass();
    const callableInstance = callable(instance);

    // 测试没有 data 属性的展开
    const spread = { ...callableInstance };
    expect(spread.name).toBeUndefined();
});
