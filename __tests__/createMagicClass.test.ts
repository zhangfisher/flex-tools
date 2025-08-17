import { describe, test, expect, vi } from 'vitest'
import { createMagicClass, getMagicClassOptions } from '../src/classs/createMagicClass'
import { isClass } from '../src/typecheck/isClass'
import { isInstance } from '../src/typecheck/isInstance'
import { get } from 'node:http'
import { getClassStaticValue } from '../src'

describe('createMagicClass 函数测试', () => {
    // 定义一个基础测试类
    class TestClass {
        name: string

        constructor(name: string) {
            this.name = name
        }

        sayHello() {
            return `Hello, ${this.name}!`
        }
    }

    test('应该能够创建魔术类并正确实例化', () => {
        const MagicTestClass = createMagicClass(TestClass)
        const instance = new MagicTestClass('测试')

        expect(instance).toBeInstanceOf(TestClass)
        expect(instance.name).toBe('测试')
        expect(instance.sayHello()).toBe('Hello, 测试!')
    })
    

    test('创建魔术类的配置选项', () => {
        type UserCreateOptions = {
            prefix?: string
            x?: number
        }
        class User {
            name: string
            prefix: string =''
            constructor(name: string) {
                this.name = name
                this.prefix = getMagicClassOptions<UserCreateOptions>(this)?.prefix! 
            }
            get title() {
                return `${getMagicClassOptions<UserCreateOptions>(this)?.prefix! || ''}${this.name}!`
            }
            toString(){
                return `${this.constructor.name}<${this.name}>`
            }
        }

        const clss = []
        const insts = []
        // 创建魔术类
        const MagicUser = createMagicClass<typeof User, UserCreateOptions>(User, {
            prefix: 'Hi,', // 默认配置
            x: 1,
            onBeforeInstance: (cls, args, _options) => {
                clss.push([cls, args])
            }, 
            onAfterInstance: (inst, _options) => {
                insts.push(inst)
            },
        })
        //  直接作为类使用
        class Admin extends MagicUser {}
        class Guest extends MagicUser({ x: 2, prefix: '欢迎,' }) {}
        class Customer extends MagicUser({ prefix: '尊贵的' }) {}

        const user = new User('用户')
        const admin = new Admin('管理员')
        const guest = new Guest('访客')
        const customer = new Customer('客户')

        expect(user.title).toBe('用户!')
        expect(admin.title).toBe('Hi,管理员!')
        expect(guest.title).toBe('欢迎,访客!')
        expect(customer.title).toBe('尊贵的客户!') 
    })

    test('onBeforeInstance钩子可以阻止实例创建', () => {
        const mockOnBeforeInstance = vi.fn().mockReturnValue(false)
        const MagicTestClass = createMagicClass(TestClass, {
            onBeforeInstance: mockOnBeforeInstance
        })

        expect(() => new MagicTestClass('测试')).toThrow('createMagicClass is blocked by onBeforeInstance hook')
        expect(mockOnBeforeInstance).toHaveBeenCalled()
    })

    test('onBeforeInstance钩子可以替换构造函数', () => {
        class ReplacementClass {
            name: string
            replaced: boolean = true
            
            constructor(name: string) {
                this.name = `Replaced ${name}`
            }
        }

        const MagicTestClass = createMagicClass(TestClass, {
            onBeforeInstance: () => ReplacementClass
        })

        const instance = new MagicTestClass('测试')
        expect(instance).toBeInstanceOf(ReplacementClass)
        expect(instance.name).toBe('Replaced 测试')
        // @ts-expect-error
        expect(instance.replaced).toBe(true)
    })

    test('onBeforeInstance钩子可以直接返回实例', () => {
        const mockInstance = { name: '预创建实例', customProp: true }
        
        const MagicTestClass = createMagicClass(TestClass, {
            onBeforeInstance: () => {
                return mockInstance
            }
        })
        class X extends MagicTestClass{}
        const instance = new X('测试')
        expect(instance).toBe(mockInstance)
        expect(instance.name).toBe('预创建实例')
        // @ts-expect-error
        expect(instance.customProp).toBe(true)
    })

    test('onAfterInstance钩子应该在实例创建后被调用', () => {
        const mockOnAfterInstance = vi.fn()
        const MagicTestClass = createMagicClass(TestClass, {
            extraOption: 'test',
            onAfterInstance: mockOnAfterInstance
        })

        const instance = new MagicTestClass('测试')
        expect(mockOnAfterInstance).toHaveBeenCalledWith(instance, expect.objectContaining({
            extraOption: 'test'
        }))
    })

    test('onErrorInstance钩子应该在实例创建出错时被调用', () => {
        class ErrorClass {
            constructor() {
                throw new Error('构造函数错误')
            }
        }

        const mockOnErrorInstance = vi.fn()
        const MagicErrorClass = createMagicClass(ErrorClass, {
            onErrorInstance: mockOnErrorInstance
        })

        expect(() => new MagicErrorClass()).toThrow('构造函数错误')
        expect(mockOnErrorInstance).toHaveBeenCalledWith(
            expect.objectContaining({ message: '构造函数错误' }),
            expect.anything(),
            expect.anything()
        )
    })

    test('魔术类应该保留原始类的名称', () => {
        const MagicTestClass = createMagicClass(TestClass)
        expect(MagicTestClass.name).toBe('TestClass')
    })

    test('getMagicClassOptions应该返回实例的魔术类选项', () => {
        const options = { customOption: 'value' }
        const MagicTestClass = createMagicClass(TestClass, options)
        const instance = new MagicTestClass('测试')
        
        expect(getMagicClassOptions(instance)).toEqual(options)
    })

    test('函数调用配置应该正确合并选项', () => { 
        const MagicTestClass = createMagicClass(TestClass, { option1: 'base', option2: 'base' })
        // @ts-expect-error
        const ConfiguredClass = MagicTestClass({ option2: 'override', option3: 'new' })
        class X extends ConfiguredClass{}
        const instance = new X('测试')
        
        expect(getMagicClassOptions(instance)).toEqual({
            option1: 'base',
            option2: 'override',
            option3: 'new'
        })
    })

    test('isClass和isInstance工具函数应该正确识别类和实例', () => {
        class TestClass {}
        const instance = new TestClass()
        
        expect(isClass(TestClass)).toBe(true)
        expect(isClass(instance)).toBe(false)
        expect(isClass({})).toBe(false)
        
        expect(isInstance(instance)).toBe(true)
        expect(isInstance(TestClass)).toBe(false)
        expect(isInstance(null)).toBe(false)
    })
     test('直接实例化包装类', () => { 
        const MagicTestClass = createMagicClass(TestClass, { option1: 'base', option2: 'base' })
        // @ts-expect-error
        const ConfiguredClass = MagicTestClass({ option2: 'override 1', option3: 'new 1' })
        // @ts-expect-error
        const ConfiguredClass2 = MagicTestClass({ option2: 'override 2', option3: 'new 2' })


        const instance = new ConfiguredClass('测试1')
        expect(instance instanceof TestClass).toBe(true)
        expect(instance instanceof ConfiguredClass).toBe(true)
        expect(getMagicClassOptions(instance)).toEqual({
            option1: 'base',
            option2: 'override 1',
            option3: 'new 1' 
        }) 
        
        const instance2 = new ConfiguredClass2('测试2')
        expect(instance2 instanceof TestClass).toBe(true)
        expect(instance2 instanceof ConfiguredClass2).toBe(true)
        expect(getMagicClassOptions(instance2)).toEqual({
            option1: 'base',
            option2: 'override 2',
            option3: 'new 2' 
        })

        const orgiInstance = new MagicTestClass('hello')
        
        expect(orgiInstance instanceof TestClass).toBe(true)
        expect(orgiInstance instanceof MagicTestClass).toBe(true)
        expect(getMagicClassOptions(orgiInstance)).toEqual({
            option1: 'base',
            option2: 'base'
        })
    }) 
    test('魔术类的包装类', () => { 
        const MagicTestClass = createMagicClass(TestClass, { option1: 'base', option2: 'base' })
        // @ts-expect-error
        const ConfiguredClass = MagicTestClass({ option2: 'override 1', option3: 'new 1' })

        class MyClass extends ConfiguredClass{
            constructor(){
                super('')
               

            }
        }
        const instance = new MyClass()
        expect(instance instanceof TestClass).toBe(true)
        expect(instance instanceof ConfiguredClass).toBe(true)
        expect(instance instanceof MyClass).toBe(true)

    }) 
})