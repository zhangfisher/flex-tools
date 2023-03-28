import { isNothing } from "../typecheck/isNothing"
import { isPlainObject } from "../typecheck/isPlainObject"
import { get as getByPath} from "../object/get"
import { deepMerge } from "../object/deepMerge"
import { assignObject } from "../object"
/**
 * 从item中提取名称值，确保一定会有一个name,如果没有名称，则会自动生成一个随机名称
 *
 */
function getNamedItemName(item={},defaultItem:any={},opts:Required<NamedDictOptions>){
    let name =typeof(opts.nameKey)=='function' ? opts.nameKey(item) : getByPath(item,opts.nameKey)  
    // 如果没有找到，且默认从default指定的字段提取
    if(isNothing(name) && opts.default && (opts.default in item)) {
        name = getByPath(getByPath(item,opts.default),"name",{
            defaultValue:`${Date.now()}${Math.random()*1000}`
        }) 
    }
    return name
}

function normalizeNamedItem(item:any,defaultItem:any,opts:Required<NamedDictOptions>){
    let finalItem:Record<string,any> = Object.assign({},defaultItem || {})
    if(isPlainObject(item)){
        finalItem = deepMerge(finalItem,item)
    }else{  // 如果item不是一个{}，则代表启用的缩写模式。当启用缩写模式时，必须指定缩写的是item的哪一个成员
        if(!isNothing(opts.default)){
            finalItem[opts.default] = item
        }
    }
    return finalItem
}

export interface NamedDictOptions{
    requires?          : string[]                                  // item项必选字段名称列表
    // item名称键名,代表名称是从item[nameKey]提取,如果是class:name代表是由item.class字段的name提取，当然，此时item.class必须是一个对象或者是{}才行
    nameKey?           : string | ((value:any)=>string)
    ignoreInvalidItems?: boolean                                    // 忽略无效项，如果=false则会触发错误，否则会直接无视
    // 正常情况下定义一个命名容器是[{name,...},{name:...},....{}]
    // 某些情况下允许采用缩写形式，如[AClass,BClass,....],这样存在命名容器没有名称的问题,这种情况下
    // 可以指定default="class"，代表缩写的是成员的class字段值
    // 然后再从AClass[nameKey],BClass[nameKey]提取名称
    default           : string,                                    // 默认项名称，比如default=“class"，代表可以不需要输入完整的{}，而只输入class，在这种情况下，名称只能从其中提取
    normalize         : (item:any)=>any                            // 提供一个函数normalize(item)用来对成员项进行规范化处理
}

/**
 *  封装一个具备名称的数据容器，
 *  该数据容器具有以下特点：
 *  1. 容器的数据项均具有一个唯一的名称，一般是具有一个name的字段
 *  2. 数据项里面有些字段是必须的，不能为空：即不能是null,undefined
 *  3. 支持两种构造方法，即NamedDict([{name,...},{name,...}...])和NamedDict({name:{...},name:{...}})
 *  4. 支持为每一项指定默认值
 *  5. 当校验数据项无效时，可以指定是忽略或者返回错误
 *
 *  如:
 *      以下class是必须的不能为空必选的项
 *    items = NamedDict([{name,class,...},{name,class,...},...],{requires:["class"]})
 *    返回的items：

 *
 * @param items                 支持数组或者{}
 * @param defaultItem           默认项，可以是{} 也可以是一个返回{}的函数
 * @param options
 * @constructor
 */
export function NamedDict<T>(items: any[], defaultItem?:T, options?:NamedDictOptions):Record<string,T>{
    let opts = assignObject({
        requires          : ["class"],                                  // item项必选字段名称列表
        nameKey           : "name",                                     // item名称键名,代表名称是从item[nameKey]提取,如果是class:name代表是由item.class字段的name提取，当然，此时item.class必须是一个对象或者是{}才行
        ignoreInvalidItems: true,                                       // 忽略无效项，如果=false则会触发错误，否则会直接无视
        default           : "class",                                    // 默认项名称，比如default=“class"，代表可以不需要输入完整的{}，而只输入class，在这种情况下，名称只能从其中提取
        normalize         : null                                        // 提供一个函数normalize(item)用来对成员项进行规范化处理
    },options) as Required<NamedDictOptions>

    if( isNothing(items))  return {}
    let defaultItemValue = typeof(defaultItem)=="function" ? defaultItem()  : defaultItem
    if(!isPlainObject(defaultItemValue)) defaultItemValue = {}   // 如果函数返回了无效值，则需要设置为{}以免后续合并时出错

    let results:Record<string,T> = {}
    if(Array.isArray(items)){
        for(let item of items){
            let defaultItemValue = defaultItem
            if(typeof(defaultItem)=="function"){
                defaultItemValue = defaultItem(item)
            }
            let finalItem = normalizeNamedItem(item,defaultItemValue,opts)
            // 获取成员名称
            let itemName = getNamedItemName(finalItem,defaultItemValue,opts)
            //finalItem.name = itemName
            // 如果名称不是从name字段读取的opts.nameKey!=="name" && 
            if(isNothing(finalItem.name)){
                finalItem.name = itemName
            }
            // 对成员进行规范化处理
            if(typeof(opts.normalize)=="function") finalItem = opts.normalize(finalItem);
            (results as any)[itemName] = finalItem
        }
    }else{
        // 如果输入已经是一个字典，则其key就是名称
        for(let [name,item] of Object.entries(items)){
            let finalItem = normalizeNamedItem(item,defaultItemValue,opts)
            if(opts.nameKey!=="name" && isNothing(finalItem.name)){
                finalItem.name = name
            }
            // 对成员进行规范化处理
            if(typeof(opts.normalize)=="function") opts.normalize(finalItem);
            (results as any)[name] = finalItem
        }
    }
    // 保证至少一项的default=true,至少有一个默认项
    if(Object.values(results).reduce((defaultNums,item)=>(item as any).default===true ? defaultNums+1 : defaultNums,0)===0){
        const keys = Object.keys(results)
        if(keys.length>0) (results[keys[0]] as any).default=true
    }

    return results
}
