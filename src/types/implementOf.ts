/**
 * 表示一个实现了指定接口的类的构造函数类型。
 * 这个类型常用于需要创建或验证类实现时，特别是在工厂模式、依赖注入或装饰器模式中。
 * 
 * @template T - 要实现的接口或类型
 
interface Animal {
   name: string;
   run(): void;
 }
 
 // 使用 ImplementOf 定义工厂函数
 function createAnimal(AnimalClass: ImplementOf<Animal>) {
   return new AnimalClass();
 }
 
 // 实现接口的类
 class Dog implements Animal {
   name = "Dog";
   run() {  }
 }
class Cat  {  }


createAnimal(Dog);  // ✅ Correct
createAnimal(Cat); // ❌ ERROR
 */
export type ImplementOf<T> = new (...args: any) => T;


// interface Animal {
//    name: string;
//    run(): void;
//  }
 
//  // 使用 ImplementOf 定义工厂函数
//  function createAnimal(AnimalClass: ImplementOf<Animal>) {
//    return new AnimalClass();
//  }
 
//  // 实现接口的类
//  class Dog implements Animal {
//    name = "Dog";
//    run() {  }
//  }
// class Cat  {  }


// createAnimal(Dog);  // ✅ Correct
// createAnimal(Cat); // ❌ ERROR