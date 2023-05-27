/**
 * 
 * 
 * 获取类方法列表
 *  
 * 
 */
 import { assignObject } from '../object/assignObject'; 


export interface GetClassMethodsOptions{
    includePrototype?:boolean                  // 是否包含原型链上的所有方法
    excludes?:(string | symbol)[] | ((name:string | symbol)=>boolean)       // 排除
}

export function getClassMethods(obj:object,options?:GetClassMethodsOptions){
    const {excludes,includePrototype} =assignObject({
        excludes:['constructor'],
        includePrototype:true
    },options)
    if(!excludes.includes('constructor')) excludes.push('constructor')
    let methods:(string | symbol)[]=[]
    let proto  = (obj as any).__proto__
    while (proto && !Object.is(proto,Object.prototype)) {
        methods.push(...Reflect.ownKeys(proto!))
        proto = proto.__proto__
        if(!includePrototype) break
    }
    return [...new Set(methods)].filter(name=>!excludes.includes(name))
}


// class A{
//     x=1
//     y=2
//     #xx=1
//     private p1(){}
//     a1(){
        
//     }
//     a2(){

//     }
//     a3(){

//     }
// }

// class AA extends A{
//     xx=1
//     yy=2
//     aa1(){}
//     aa2(){}
// }

// console.log(getClassMethods(new A()))
// console.log(getClassMethods(new AA()))
// console.log(getClassMethods(new AA(),{includePrototype:false})) 

