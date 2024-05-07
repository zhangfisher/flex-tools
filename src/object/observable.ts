import { ABORT } from "../consts"



export type ObservableOptions= {
    onRead?:(key:string[],value:any)=>any
    onWrite?:(key:string[],newValue:any)=>any
    onDelete?:(key:string[])=>any
    // 触发方式
    // default: 只有读取值是非对象时才会触发
    // full: 读取任何值都会触发,这可能会导致性能问题,慎用
    trigger?: 'default' | 'full'
}

/**
 * 
 * 创建对象的可观察代理
 * 
 * 如
 * obj = observable({a:1,b:2,C:{c1:1,c2:2},d:[1,2,3]},{
 *      onRead:(key)=>{console.log('read',key)},
 *      onWrite:(key,value)=>{
 * })
 * 
 * 当读取obj.a时，会触发onRead(['a'])
 * 当读取obj.C.c1时，会触发onRead(['C','c1'])
 * 当写入obj.a时，会触发onWrite(['a'],value)
 * 当写入obj.C.c1时，会触发onWrite(['C','c1'],value)
 * 
 * onRead和onWrite的返回值会作为读取或写入的结果
 * 支持嵌套对象和数组
 * 
 * 
 * @param target 
 * @param options 
 */

export function observable<T extends object=object>(target: T, options?:ObservableOptions):T {

    const {onRead,onWrite,onDelete,trigger} = Object.assign({
        trigger:'default'
    },options)

    function callReadCallback(key:string[],value:any){
        if(typeof(onRead)==='function'){
            try{
                const r = onRead(key,value)
                if(r!==undefined){
                    return r
                }
            }catch(e){
                console.error(e)
            }  
        }
        return value
    }
    function createObjectProxy(target: object, parentKey:string[]=[]):object {
        return new Proxy(target, {
            get(target, key, receiver) {
                const value = Reflect.get(target, key, receiver)
                // @ts-ignore
                if(key in target?.__proto__){
                    return  value                    
                }
                
                if (typeof value === 'object' && value !== null) {
                    if(trigger=='default'){
                        return createObjectProxy(value,[...parentKey,key as string])
                    }else{
                        return callReadCallback([...parentKey,key as string],createObjectProxy(value,[...parentKey,key as string]))
                    }                    
                }       
                return callReadCallback([...parentKey,key as string],value)
            },
            set(target, key, value, receiver) {                
                if(typeof(onWrite)=='function'){
                    // @ts-ignore
                    if(!(key in target?.__proto__)){
                        const r = onWrite([...parentKey,key as string],value)
                        if(r!==undefined){
                            return Reflect.set(target, key, r, receiver)
                        }
                    }
                }
                return Reflect.set(target, key, value, receiver)
            },
            deleteProperty(target, key) {
                if(typeof(onDelete)=='function'){
                    // @ts-ignore
                    if(!(key in target?.__proto__)){
                        if(onDelete([...parentKey,key as string])==ABORT){
                            throw new Error('Abort delete')
                        }          
                    }   
                }
                return Reflect.deleteProperty(target, key)
            }
        })

    }

    return createObjectProxy(target) as T

}

// const obj = observable({a:1,b:2,c:{c1:1,c2:2},d:[1,2,3],e:null,f:()=>{}},{
//     onRead:(key:string[])=>{
//         console.log('Read:',`[${key.join()}]`)
//     },
//     onWrite:(key:string[],value:any)=>{
//         console.log('Write:',`[${key.join()}]`,value)
//     },
//     onDelete:(key:string[])=>{
//         console.log('Delete:',`[${key.join()}]`)
//     }
// })

// obj.d.length


// obj.c
// obj.a
// obj.b
// obj.c
// obj.c.c1
// obj.d
// obj.d[0]
// obj.d[1]
// obj.d[2]
// obj.d[3]
// obj.f

// obj.a = 2
// console.log(obj.a)

// obj.d[0] = 2

// // @ts-ignore
// delete obj.a
// // @ts-ignore
// delete obj.c
// obj.d.pop()


// console.log(Object.assign({},obj))