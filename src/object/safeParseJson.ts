/**
 *   使用正则表达式解析非标JOSN
 * 
 */

 const bastardJsonKeyRegex = /(\s*[\w\u4e00-\u9fa5]+\s*:)|(:\s*\'.*?\')|(\'.*?\'\s*:)/gm

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
        let item = matched[0].trim()
        const matchedLength = matched[0].length
        const isMatchKey = item.endsWith(":")
        if(item.startsWith(":")) item = item.substring(1)
        if(item.endsWith(":")) item = item.substring(0,item.length-1)
        if(item.startsWith("'") && item.endsWith("'")){
            item = item.substring(1,item.length-1)
        }
        item = '"'+item+'"'
        const finalItem = isMatchKey ? item+": " : " :"+item 
        str = `${str.substring(0,matched.index)}${finalItem}${str.substring(matched.index+matchedLength)}`
    }
    return JSON.parse(str)
} 
 


// const str = `
// {
//     a:1,
//     "ds":'111',
//     "sss":'中文',x:'中文',y:2,
//     '中文':1,
//     中q文:2,
//     中文:3
//     }
// `

// console.log(safeParseJson(str))