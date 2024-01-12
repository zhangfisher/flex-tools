/**
 
 * 对输入的值进行匹配，如果相同则返回对应的值
 * 
 * switcher = {
 1:"a",
 *    String:"I am string",
 *    Number:"I am number",
 *    Function:()=>{ return "I am function" },
 *    Object:"I am object",
 *    Array:"I am array",
 *    Boolean:"I am boolean",
 *    StringArray:"I am string array",
 *    NumberArray:"I am number array",
 *    BooleanArray:"I am boolean array", * 
 * }
 * 
 * switchValue(1,switcher)  // == "a"
 * 
 * switchValue("1",switcher)  // == "I am string",
 *  
 * switchValue(Symbol(),switcher,{defaultValue:1})  // == 1
 * 
 * 也可以指定类型匹配器
 * 
 * switchValue(new User(),{
 *      User: (value)=> user.name
 * },{
 *    typeMatchers:{
 *       User: (value)=> value instanceof User 
 *    }
 * )
 * 

 */


export interface SwitchValueOptions{
    typeMatchers?: Record<string,string | Function>
    defaultValue?:any
}


export function switchValue<T=any>(value:T,switchers:Record<string,any>,options?:SwitchValueOptions){
    const defaultValue = options?.defaultValue
    const typeMatchers:SwitchValueOptions['typeMatchers'] = {
        Number  : 'number',
        String  : 'string',
        Function: 'function',
        Object  : 'object',
        Boolean : 'boolean'            
    }
    if(options?.typeMatchers) Object.assign(typeMatchers,options.typeMatchers)

    let result:any = defaultValue
    for(const [matchKey,matchValue] of Object.entries(switchers)){                    
        if(Array.isArray(value)){
            if(matchKey.endsWith("Array")){
                const t = typeMatchers[matchKey.slice(0,-5)]
                if(Array.isArray(value) &&  value.every((v:any)=>typeof(v)==t)){                
                    result = matchValue
                    break
                }
            }
        }else{
            if(matchKey == value && typeof(matchKey)==typeof(value)){
                result = matchValue
                break
            }else if(matchKey == value && typeof(value)=='number'){
                result = matchValue
                break
            }else if(matchKey in typeMatchers){   
                const matcher = typeMatchers[matchKey]         
                if(typeof(matcher)=='function' && matcher(value)){
                    result = matchValue
                    break
                }else if(matcher == typeof(value)){
                    result = matchValue
                    break
                }
            }else if(matchKey == 'Array'){
                if(Array.isArray(value)){
                    result = matchValue
                    break
                }
            }else if(matchKey.endsWith("Array")){
                const t = typeMatchers[matchKey.slice(0,-5)]
                if(Array.isArray(value) &&  value.every((v:any)=>typeof(v)==t)){                
                    result = matchValue
                    break
                }
            }
        }        
    }

    return typeof(result)=='function' ? result(value) : result        
}

class User{
    name="a"
}

const switcher = {
    1:"a",
    current:"current",
    parent:"parent",
    String:"I am string",
    Number:"I am number",
    Function:()=>{ return "I am function" },
    Object:"I am object",
    Array:"I am array",
    Boolean:"I am boolean",
    StringArray:"I am string array",
    NumberArray:"I am number array",
    BooleanArray:"I am boolean array"     
}
    
    console.log("1 = ",switchValue(1,switcher))  // == "a"
    console.log("current = ",switchValue("current",switcher))  // == "a"
    console.log("parent = ",switchValue("parent",switcher))  // == "a"
    console.log("xxxxx = ",switchValue("xxxxx",switcher))
    console.log("100 = ",switchValue(100,switcher))
    console.log("true = ",switchValue(true,switcher))
    console.log("{} = ",switchValue({},switcher))

    console.log("['String'] = ",switchValue(["String"],switcher))
    console.log("[100] = ",switchValue([100],switcher))
    console.log("[true] = ", switchValue([true],switcher))

    console.log("()=>{} = ", switchValue(()=>{},switcher))
    
    console.log("Symbol() = ",switchValue(Symbol(),switcher,{defaultValue:1}))  // == 1
    console.log("new User() = ",switchValue(new User(),{
            User: "I am user"
        },{
            typeMatchers:{
                User: (value:any)=> value instanceof User 
            }
        }
    ))  // == "I am user"