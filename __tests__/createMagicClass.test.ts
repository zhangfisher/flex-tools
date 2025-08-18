import { describe, test, expect, vi } from 'vitest'
import { createMagicClass } from '../src/classs/createMagicClass' 
class Animal{
    constructor(public name: string,public  age: number) {
    }
    run(){
        return this.name
    }
    eat(food: string): void{
        console.log(food)
    }
}   
describe('createMagicClass 函数测试', () => {
 
    test('魔术类构造参数的默认重载合并', () => { 
        type UserType = 'admin' | 'guest' | 'root' | 'vip' | 'customer'  | 'manager'
        class User{
            name?:string
            age?:number
            sex?:'m'|'f'
            type?: UserType
            constructor(data:{name?:string,age?:number,sex?:'m'|'f',type?:UserType }){
                this.name = data.name
                this.age = data.age
                this.sex = data.sex
                this.type = data.type            
            }
        }
        const MagicUser = createMagicClass(User, {
            params:[
                {
                    sex: 'm',
                    age: 1
                }
            ]
        })
        const Admin = MagicUser({type: 'admin' , age: 10})
        
        const admin1= new Admin({age:21})

        expect(admin1.age).toEqual(21)
        expect(admin1.type).toEqual('admin')
        expect((admin1 instanceof User)).toBe(true)
        expect((admin1 instanceof MagicUser)).toBe(true)
        expect((admin1 instanceof Admin)).toBe(true)

        const admin2= new Admin({age:22})
        expect(admin2.age).toEqual(22)
        expect(admin2.type).toEqual('admin')
        expect((admin2 instanceof User)).toBe(true)
        expect((admin2 instanceof MagicUser)).toBe(true)
        expect((admin2 instanceof Admin)).toBe(true)

        
        const Guest = MagicUser({type: 'guest' , age: 20})
        const guest = new Guest({age:23})
        expect(guest.age).toEqual(23)
        expect(guest.type).toEqual('guest')
        expect((guest instanceof User)).toBe(true)
        expect((guest instanceof MagicUser)).toBe(true)
        expect((guest instanceof Guest)).toBe(true)

        const Root = MagicUser({type: 'root' , age: 30})
        const root= new Root({})
        expect(root.age).toEqual(30)
        expect(root.type).toEqual('root')
        expect((root instanceof User)).toBe(true)
        expect((root instanceof MagicUser)).toBe(true)
        expect((root instanceof Root)).toBe(true)

        const Customer = MagicUser({type: 'customer' , age: 40})
        const customer = new Customer({})
        expect(customer.age).toEqual(40)
        expect(customer.type).toEqual('customer')
        expect((customer instanceof User)).toBe(true)
        expect((customer instanceof MagicUser)).toBe(true)
        expect((customer instanceof Customer)).toBe(true)

        const VIP = MagicUser({type: 'vip' , age: 50})
        const vip= new VIP({})
        expect(vip.age).toEqual(50)
        expect(vip.type).toEqual('vip')
        expect((vip instanceof User)).toBe(true)
        expect((vip instanceof MagicUser)).toBe(true)
        expect((vip instanceof VIP)).toBe(true)

        const Manager = MagicUser({type: 'manager' , age: 60})
        const manager = new Manager({})
        expect(manager.age).toEqual(60)
        expect(manager.type).toEqual('manager')
        expect((manager instanceof User)).toBe(true)
        expect((manager instanceof MagicUser)).toBe(true)
        expect((manager instanceof Manager)).toBe(true)
    })

    test('魔术类可以直接作为构造函数使用', () => {
        class Person {
            name: string
            constructor(name: string) {
                this.name = name
            }
        }
        
        const MagicPerson = createMagicClass(Person)
        const person = new MagicPerson('张三')
        
        expect(person.name).toBe('张三')
        expect(person instanceof Person).toBe(true)
        expect(person instanceof MagicPerson).toBe(true)
    })
    
    test('魔术类支持自定义参数处理函数', () => {        
        class Counter {
            count: number
            constructor(initialCount: number) {
                this.count = initialCount
            }
        }
        type Params = ConstructorParameters<typeof Counter>
        
        const onParametersSpy = vi.fn((params:Params, parentParams:Params ):Params => {
            return [params[0] + (parentParams?.[0] || 0)]
        })
        
        const MagicCounter = createMagicClass(Counter, {
            params: onParametersSpy
        })
        
        const CustomCounter = MagicCounter(5)
        const counter = new CustomCounter(2)
        
        expect(onParametersSpy).toHaveBeenCalled()
        expect(counter.count).toBe(7) 
        expect(counter instanceof Counter).toBe(true)
    })
    
    test('魔术类的生命周期钩子：onBeforeInstance', () => {
        class Product {
            name: string
            price: number
            constructor(name: string, price: number) {
                this.name = name
                this.price = price
            }
        }
        
        const onBeforeInstanceSpy = vi.fn((cls, args) => {
            expect(args).toEqual(['手机', 1999])
            return false // 阻止实例创建
        })
        
        const MagicProduct = createMagicClass(Product, {
            onBeforeInstance: onBeforeInstanceSpy
        })
        
        expect(() => new MagicProduct('手机', 1999)).toThrow('createMagicClass is blocked by onBeforeInstance hook')
        expect(onBeforeInstanceSpy).toHaveBeenCalled()
    })
    
    test('魔术类的生命周期钩子：onBeforeInstance返回新实例', () => {
        class Animal {
            type: string
            constructor(type: string) {
                this.type = type
            }            
        }        
        
        const MagicAnimal = createMagicClass(Animal, {
            onBeforeInstance: (cls, args) => {
                return { type: args[0], custom: true }
            }
        })
        
        const animal = new MagicAnimal('猫')
        expect(animal.type).toBe('猫')
        //@ts-expect-error
        expect(animal.custom).toBe(true)
    })
    
    test('魔术类的生命周期钩子：onAfterInstance', () => {
        class Book {
            title: string
            constructor(title: string) {
                this.title = title
            }
        }
        
        const onAfterInstanceSpy = vi.fn((instance) => {
            instance.modified = true
        })
        
        const MagicBook = createMagicClass(Book, {
            onAfterInstance: onAfterInstanceSpy
        })
        
        const book = new MagicBook('JavaScript高级编程')
        
        expect(onAfterInstanceSpy).toHaveBeenCalled()
        expect(book.title).toBe('JavaScript高级编程')
        // @ts-expect-error
        expect(book.modified).toBe(true)
    })
    
    test('魔术类的生命周期钩子：onErrorInstance', () => {
        class BuggyClass {
            constructor() {
                throw new Error('构造函数错误')
            }
        }
        
        const onErrorInstanceSpy = vi.fn()
        
        const MagicBuggy = createMagicClass(BuggyClass, {
            onErrorInstance: onErrorInstanceSpy
        })
        
        expect(() => new MagicBuggy()).toThrow('构造函数错误')
        expect(onErrorInstanceSpy).toHaveBeenCalled()
        expect(onErrorInstanceSpy.mock.calls[0][0].message).toBe('构造函数错误')
    })
    
    test('魔术类支持多级继承和参数传递', () => {
        class Vehicle {
            type?: string
            constructor(config: { type?: string }) {
                this.type = config.type
            }
        }
        
        const MagicVehicle = createMagicClass(Vehicle)
        const Car = MagicVehicle({ type: '汽车' })
        const SportsCar = Car({ type: '跑车' })
        const LuxurySportsCar = SportsCar({ type: '豪华跑车' })
        
        const vehicle = new MagicVehicle({ type: '交通工具' })
        const car = new Car({ type: '小轿车' }) 
        const sportsCar = new SportsCar({})
        const luxurySportsCar = new LuxurySportsCar({})

        expect(vehicle).toBeInstanceOf(Vehicle)
        expect(vehicle).toBeInstanceOf(MagicVehicle)
        expect(car).toBeInstanceOf(MagicVehicle)
        expect(car).toBeInstanceOf(Vehicle)
        expect(car).toBeInstanceOf(Car)
        
        expect(sportsCar).toBeInstanceOf(Vehicle)
        expect(sportsCar).toBeInstanceOf(MagicVehicle)
        expect(sportsCar).toBeInstanceOf(Car)

        expect(luxurySportsCar).toBeInstanceOf(Vehicle)
        expect(luxurySportsCar).toBeInstanceOf(MagicVehicle)
        expect(luxurySportsCar).toBeInstanceOf(Car)
        expect(luxurySportsCar).toBeInstanceOf(SportsCar)
        
        expect(vehicle.type).toBe('交通工具')
        expect(car.type).toBe('小轿车')
        expect(sportsCar.type).toBe('跑车')
        expect(luxurySportsCar.type).toBe('豪华跑车')
        
        expect(vehicle instanceof Vehicle).toBe(true)
        expect(car instanceof Vehicle).toBe(true)
        expect(sportsCar instanceof Vehicle).toBe(true)
        expect(luxurySportsCar instanceof Vehicle).toBe(true)
    })
    
    test('魔术类处理非对象参数', () => {
        class Calculator {
            a: number
            b: number
            constructor(a: number, b: number) {
                this.a = a
                this.b = b
            }
            
            add() {
                return this.a + this.b
            }
        }
        
        const MagicCalculator = createMagicClass(Calculator, {
            params: [5, 10]
        })
        
        const AddCalculator = MagicCalculator(0, 0)
        
        const calc1 = new MagicCalculator(1, 2)
        const calc2 = new AddCalculator(3, 4)
        
        expect(calc1.a).toBe(1)
        expect(calc1.b).toBe(2)
        expect(calc1.add()).toBe(3)
        
        expect(calc2.a).toBe(3)
        expect(calc2.b).toBe(4)
        expect(calc2.add()).toBe(7)
    })
        test('魔术类的级继承', () => {
         
            const MagicAnimal = createMagicClass(Animal)  

            class Dog extends MagicAnimal {
                bark(): void{
                    this.eat("吃肉")
                }
            }
            class PolicDog extends Dog{
                track():void{
                    console.log("追捕")
                    this.bark()
                }
            }

            const animal = new Animal('tom',5)
            const dog = new Dog('jack',3)
            const polic = new PolicDog('jack',3)
            
            expect(dog instanceof Dog).toBe(true)
            expect(dog instanceof MagicAnimal).toBe(true)
        })
        test('继承链上的魔术类构造参数', () => {
             const MagicAnimal = createMagicClass(Animal)  
             
            const animal = new MagicAnimal('tom',5) 
            const Dog = MagicAnimal({
                params:(params,scopeParams)=>{
                    return ['hi,'+params[0],params[1]+10]
                },
            })

            const dog = new Dog('jack',3)
            expect(dog.name).toBe('hi,jack')
            expect(dog.age).toBe(13)
            const dog2 = new Dog('tom',4)
            expect(dog2.name).toBe('hi,tom')
            expect(dog2.age).toBe(14)
        })
         test('修改魔术类的参数', () => {
             const MagicAnimal = createMagicClass(Animal)  
             
            const animal = new MagicAnimal('tom',5) 
            const Dog = MagicAnimal<[number]>({
                params:(params,scopeParams)=>{
                    return ['DOG'+params[0],params[0]]
                },
            })

            const dog = new Dog(1)
            expect(dog.name).toBe('DOG1')
            expect(dog.age).toBe(1)
            const dog2 = new Dog(2)
            expect(dog2.name).toBe('DOG2')
            expect(dog2.age).toBe(2)
        })
})