
/**
 *   使用正则表达式解析非标JOSN
 * 
 */

 const bastardJsonKeyRegex = /(?<value>(?<=:\s*)(\'.*?\')+)|(?<key>(([\w\u4e00-\u9fa5])|(\'.*?\'))+(?=\s*\:))/g

 /**
  * 当需要采用正则表达式进行字符串替换时，需要对字符串进行转义
  * 
  * 比如  str = "I am {username}"  
  * replace(new RegExp(str),"Tom") !===  I am Tom
  * 
  * 因为{}是正则表达式元字符，需要转义成 "\{username\}"
  * 
  * replace(new RegExp(escapeRegexpStr(str)),"Tom")
  * 
  * 
  * @param {*} str 
  * @returns 
  */
 function escapeRegexpStr(str:string){
     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
 } 
/**
 * 解析非标的JSON字符串为{}
 * 非标的JSON字符串指的是：
 *  - key没有使用使用""包裹
 *  - 字符串value没有使用""包裹
 *  
 * @param {*} str 
 * @returns 
 */
export function safeParseJson(str:string){
    let matched; 
    while ((matched = bastardJsonKeyRegex.exec(str)) !== null) {
        if (matched.index === bastardJsonKeyRegex.lastIndex) {
            bastardJsonKeyRegex.lastIndex++;
        }                
        let item = matched[0]
        if(item.startsWith("'") && item.endsWith("'")){
            item = item.substring(1,item.length-1)
        }
        const findValue =  matched?.groups?.key ? new RegExp( escapeRegexpStr(matched[0]) + "\s*:") : new RegExp(":\s*" +  escapeRegexpStr(matched[0]))
        const replaceTo = matched?.groups?.key ? `"${item}":` : `: "${item}"`
        str = str.replace(findValue,replaceTo)
    }
    return JSON.parse(str)
} 
 