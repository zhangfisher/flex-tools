import {get as getByPath} from "./get" 
import {set as setByPath} from "./set"
import { isNothing } from "../typecheck/isNothing"
import { isPlainObject } from "../typecheck/isPlainObject"

const Operates = ["+","-","*","/","%",">","<","&","|","~","!","^"]

function typedParam(value:any,param:any){
    if(typeof value =="number"){
        return parseInt(param)
    }else if(typeof value =="string"){
        return param
    }else if(typeof value =="boolean"){
        return param !== "false"
    }else{
        return param
    }
}


// 自更新操作符
const selfUpdateOperates={
    string:{
        "+":(value:any,index:number,param:any)=> value + param,// 追加
        ">":(value:any,index:number,param:any)=> value.substr(0,index)+param+value.substr(index),              // 在指定位置插入
        "-":(value:any,index:number,param:any)=> value.substr(0,index)+param+value.substr(index+param.length)        // 删除index处的字符，然后插入param字符
    },
    boolean:{
        "&":(value:any,index:number,param:any)=> value && param,
        "|":(value:any,index:number,param:any)=> value || param,
        "!":(value:any,index:number,param:any)=> !value
    },
    number:{
        "+":(value:any,index:number,param:any)=>value+=param,
        "-":(value:any,index:number,param:any)=>value-=param,
        "*":(value:any,index:number,param:any)=>value*=param,
        "/":(value:any,index:number,param:any)=>value/=param,
        "%":(value:any,index:number,param:any)=>value+=param,
        ">":(value:any,index:number,param:any)=>value >> param,
        "<":(value:any,index:number,param:any)=>{value << param},
        "&":(value:any,index:number,param:any)=>value & param,
        "|":(value:any,index:number,param:any)=>value | param,
        "~":(value:any,index:number,param:any)=>~value,
        "^":(value:any,index:number,param:any)=>value ^ param
    }
} as Record<string,Record<string,Function>>

/**
 *
 * @param {*} value
 * @param updaters
 */
function updateByOperate(value:any,updaters:string[]){

    // 支持多个操作同时执行
    if(!Array.isArray(updaters)) {
        updaters= isNothing(updaters) ? [] : [updaters]
    }
    let result = value
    for(let i=0;i<updaters.length;i++){
        const updater = updaters[i]
        // 更新器支持完整模式(例:xx=+1)和简写模式(例:+1)，

        let location:any=null,update
        if( updater.includes("=")){
            const splitIndex = updater.indexOf("=")
            location = updater.substring(0,splitIndex)
            update = updater.substring(splitIndex+1)
        }else{
            update=updater
        }

        // 更新由 前置<操作符>+<操作参数组成>
        let hasOperate = Operates.includes(update[0])
        // 操作符
        let operate = hasOperate ? update[0] : null
        // 操作参数
        let param = hasOperate ? update.slice(1) : update

        if(typeof(value)=="number" || typeof(value)=="string" || typeof(value)=="boolean"){
            // 每种数据类类型的操作定义在
            let operateDefs =typeof(value) in selfUpdateOperates ? selfUpdateOperates[typeof(value)] : {}
            // 将参数转换为原值一样的类型
            param = typedParam(value,param)

            // 有效操作符
            if(operate && operate in operateDefs){
                if(location){                       // location!=null,即使用了xx=+xx的形式
                    // 如果&开头代表是后面的是值
                    if(location.startsWith("&")){
                        location = location.substring(1)
                        if(typeof(value)=="number"){
                            location = parseInt(location)
                        }else if(typeof(value)=="boolean") {
                            location = location.toLowerCase()==="false"
                        }
                        if(location===value){
                            result = operateDefs[operate](value,location,param)
                            break
                        }
                    }else{// 不是以&开头代表是索引，仅仅当数据是字符串时有效
                        location = parseInt(location)
                        result = operateDefs[operate](value,location,param)
                        break
                    }
                }else{      // location==null

                    result = operateDefs[operate](value,location,param)
                    break
                }
            }else{  // 无操作符
                if(location){                       // location!=null,即使用了xx=+xx的形式
                    // 如果&开头代表是后面的是值
                    if(location.startsWith("&")){
                        location = typedParam(value,location.substr(1))
                        if(location===value){
                            result = param
                            break
                        }
                    }else{
                        result = param
                        break
                    }
                }else{
                    result = param
                    break
                }
            }
        }else if(Array.isArray(value)){
            let index
            if(location && location.startsWith("&")){
                index = value.findIndex(v=>String(v)===location.substr(1))
            }else{
                index = parseInt(location)
            }
            if(index>=0 && index<value.length){
                value[index] = typedParam(value[index],updateByOperate(value[index],[update]))
            }else if(!index && operate==="+"){   // 如果没有索引，则支持+追加操作
                value.push(value.length>0 ? typedParam(value[0],param) : param)
            }
        }else if(isPlainObject(value)){
            let key = location
            if(key in value){
                value[key] = typedParam(value[key],updateByOperate(value[key],[update]))
            }
        }else{

        }

    }
    return result

}

// let data
// function resetData(){
//     data = {
//         a:1,
//         b:true,
//         c:[1,2,3,4],
//         d:["a","b","c"],
//         e:{
//             a:1,b:2
//         },
//         f:{
//             x:"abc",y:"def"
//         },
//         s:"abc"
//     }
// }

// resetData()


// function assertEqual(expr,expectValue,actualValue){
//     if(JSON.stringify(expectValue) == JSON.stringify(actualValue)){
//         console.log(expr,"\texpect =",JSON.stringify(expectValue),"\t actual=",JSON.stringify(actualValue))
//     }else{
//         console.error(expr,"\texpect =",JSON.stringify(expectValue),"\t actual=",JSON.stringify(actualValue))
//     }
//     resetData()
// }

// // 数字
// selfUpdateBy(data,"a","+2") ; assertEqual("+2",3,data.a)
// selfUpdateBy(data,"a","-2") ; assertEqual("-2",-1,data.a)
// selfUpdateBy(data,"a","1=-2"); assertEqual("1=-2",-1,data.a)
// selfUpdateBy(data,"a","&2=-2"); assertEqual("&2=-2",1,data.a)
// selfUpdateBy(data,"a",["&2=0","&1=9"]); assertEqual('["&2=0","&1=9"]',9,data.a)
// selfUpdateBy(data,"a","&1=100"); assertEqual('&1=100',100,data.a)
// selfUpdateBy(data,"a","-2") ; assertEqual("-2",-1,data.a)
// selfUpdateBy(data,"a",">1") ; assertEqual(">1",0,data.a)



// // 布尔
// selfUpdateBy(data,"b","&false"); assertEqual("&false",false,data.b)
// selfUpdateBy(data,"b","!"); assertEqual("!",false,data.b)

// // 字符串
// selfUpdateBy(data,"s","+xyz"); assertEqual("+xyz","abcxyz",data.s)
// selfUpdateBy(data,"s","1=>xyz"); assertEqual("1=>xyz","axyzbc",data.s)
// selfUpdateBy(data,"s","1=-xyz"); assertEqual("1=-xyz","axyz",data.s)

// // 数组
// selfUpdateBy(data,"c","1=9"); assertEqual("1=9",[1,9,3,4],data.c)
// selfUpdateBy(data,"c","1=+1"); assertEqual("1=+1",[1,3,3,4],data.c)
// selfUpdateBy(data,"c","1=-1"); assertEqual("1=-1",[1,1,3,4],data.c)
// selfUpdateBy(data,"c","&2=+1"); assertEqual("&2=+1",[1,3,3,4],data.c)  // 将值=2的项+1
// selfUpdateBy(data,"c","1=>1"); assertEqual("1=>1",[1,1,3,4],data.c)

// // 字符串数组
// selfUpdateBy(data,"d","1=+1"); assertEqual("1=>1",["a","b1","c"],data.d)
// selfUpdateBy(data,"d","1=>0"); assertEqual("1=>0",["a","0b","c"],data.d)
// selfUpdateBy(data,"d","1=1=+xyz"); assertEqual("1=1=+xyz",["a","bxyz","c"],data.d)

// // 对象
// selfUpdateBy(data,"e","a=+1"); assertEqual("a=+1",{a:2,b:2},data.e)
// selfUpdateBy(data,"f","x=+000"); assertEqual("x=+000",{x:"abc000",y:"def"},data.f)
// selfUpdateBy(data,"f","y=1=>000"); assertEqual("y=1+000",{x:"abc",y:"d000ef"},data.f)


export function selfUpdate(obj:object,path:string,operate:string | string[]){
    let orgValue = getByPath(obj,path)
    let newValue = updateByOperate(orgValue,Array.isArray(operate) ? operate : [operate])
    setByPath(obj,path,newValue)
}