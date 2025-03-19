import { describe, test,expect } from 'vitest';
import { getClassStaticValue } from '../classs/getClassStaticValue';


describe('getClassStaticValue', ()=>{

    test('should return the static array value of the class',()=>{
        
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
  
        const a = new AAA()

        expect(a.get()).toEqual([1,2,3,4])
  
  
    })
    test('should return the static array3 value of the class',()=>{
        
        class A{
            static value:number | number[] = 1
            get(){ return getClassStaticValue(this,"value",{default:[]}) }
        }        
        class AA extends A{
            static value:number | number[] = 2
        }        
        class AAA extends AA{
            static value = 3
        }
  
        const a = new AAA()

        expect(a.get()).toEqual([1,2,3])
  
  
    })

    test('should return the static object value of the class',()=>{
        type R = {
            a? : number
            b? : number
            c? : number
        }
        class A{
            static value:R = {a:1}
            get(){ return getClassStaticValue(this,"value",{default:{}}) }
        }        
        class AA extends A{
            static value:R = {a:2,b:2}
        }        
        class AAA extends AA{
            static value:R = {a:3,b:4,c:5}
        }  
        const a = new AAA()

        expect(a.get()).toEqual({a:3,b:4,c:5})  
  
    })
    test('should return the static object value with defaultValue',()=>{
        
        class A{
            get(){ 
                return getClassStaticValue(this,"value",{default:[] })
            }
        }        
        class AA extends A{
        
        }        
        class AAA extends AA{
        
        }  
        const a = new AAA()

        expect(a.get()).toEqual([])  
  
    })
})

