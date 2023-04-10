// /**
//  * 
//  *  解析字符串里面的标签组
//  * 
//  *  let tags = parseTags('aaa{}sffd{a,b,c}dd{d,e,f}ggg{a,b,c}')
//  *   *  let tags = parseTags('<div>sdfdsfDS</div>',{begin:"<div>",end:"</div>"})
//  * 
//  * 
//  */

// import { assignObject } from "../object"
// import { isNumber } from "../typecheck/isNumber"

// export interface ParseTagsOptions {
//     beginTag?:string
//     endTag?:string
//     replacer?: (tag: string, index: number) => any
// }
//  /**
//   * 当需要采用正则表达式进行字符串替换时，需要对字符串进行转义
//   * 
//   * 比如  str = "I am {username}"  
//   * replace(new RegExp(str),"Tom") !===  I am Tom
//   * 
//   * 因为{}是正则表达式元字符，需要转义成 "\{username\}"
//   * 
//   * replace(new RegExp(escapeRegexpStr(str)),"Tom")
//   * 
//   * 
//   * @param {*} str 
//   * @returns 
//   */
// export function escapeRegexpStr(str:string):string{
//     return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
// } 
// // /\<(\w+)[^\<]*\>(\d+)%%(.*?)%%\2\<\/\1\s*\>
// const __TAG_REGEXP__ = String.raw`\__BEGIN_TAG__(\d+)%%(.*?)%%\2__END_TAG__`

// const TAG_HELPER_CHARS = "__TAG_REGEXP__"
// /**
//  * 生成可以解析指定标签的正则表达式
//  * 
//  * getNestingParamsRegex()     -- 能解析{}和[]
//  * getNestingParamsRegex(["<b>","</b>"]),
//  * 
//  * @param  {...any} tags 
//  * @returns 
//  */
//  function getNestingTagsRegex(tags: ([string, string])[]) {
//     const tagsRegexs = tags.map(([beginTag, endTag]) => {
//         return `(${escapeRegexpStr(beginTag)}1%.*?%1${escapeRegexpStr(endTag)})`
//     })
//     return formatterNestingParamsRegex.replace(TAG_HELPER_CHARS, tagsRegexs.length > 0 ? tagsRegexs.join("|") + "|" : "")
// }

// /**
//  * 
//  *  遍历字符串中的 beginTag和endTag,添加辅助序号
//  *  如"{a}{b}{c}"  =>  "{1%a%1}{2%b%2}{3%c%3}"
//  *   "{a{b}c}"  =>  "{1%a{2%b%2}c%1}"
//  * 
//  * @param {*} str 
//  * @param {*} beginTag 
//  * @param {*} endTag 
//  * @returns 
//  */
// function addTagFlags(str: string, beginTag:string | RegExp = "{", endTag:string | RegExp = "}") {
//     let i = 0
//     let flagIndex = 0
//     const beginRegex = typeof(beginTag) == "string" ? new RegExp(escapeRegexpStr(beginTag)) : beginTag
//     const endRegex = typeof(endTag) == "string" ? new RegExp(escapeRegexpStr(endTag)) : endTag

    
//     while ((m = regex.exec(str)) !== null) {
//         // 这对于避免零宽度匹配的无限循环是必要的
//         if (m.index === regex.lastIndex) {
//             regex.lastIndex++;
//         }
        
//         // 结果可以通过`m变量`访问。
//         m.forEach((match, groupIndex) => {
//             console.log(`Found match, group ${groupIndex}: ${match}`);
//         });
//     }

//     while (i < str.length) {
//         let beginChars = str.slice(i, i + beginTag.length)
//         let endChars = str.slice(i, i + endTag.length)
//         if (beginChars == beginTag) {
//             flagIndex++
//             str = str.substring(0, i + beginTag.length) + `${flagIndex}%%` + str.substring(i + beginTag.length)
//             i += beginTag.length + String(flagIndex).length + 1
//             continue
//         }
//         if (endChars == endTag) {
//             if (flagIndex > 0) {
//                 str = str.substring(0, i) + `%%${flagIndex}` + str.substring(i)
//             }
//             i += endTag.length + String(flagIndex).length + 1
//             flagIndex--
//             continue
//         }
//         i++
//     }
//     return str
// }

// // 指<div></div>成对标签
// export type TagPair = [string, string]
// /**
//  * 增加标签组辅助标识
//  * 
//  *  addTagHelperFlags("sss",["<div>","</div>"]
//  * 
//  * @param {*} str 
//  * @param  {...any} tags  默认已包括{},[]
//  */
// function addTagHelperFlags(str: string, tags: TagPair[]) {
//     tags.forEach(tag => {
//         if (str.includes(tag[0]) && str.includes(tag[1])) {
//             str = addTagFlags(str, ...tag)
//         }
//     })
//     return str
// }

// function removeTagFlags(str: string, beginTag: string, endTag: string) {
//     const regexs:([string,RegExp])[] = [
//         [beginTag, new RegExp(escapeRegexpStr(beginTag) + "\\d+%")],
//         [endTag, new RegExp("%\\d+" + escapeRegexpStr(endTag))]
//     ]
//     regexs.forEach(([tag, regex]) => {
//         let matched
//         while ((matched = regex.exec(str)) !== null) {
//             if (matched.index === regex.lastIndex) regex.lastIndex++;
//             str = str.replace(regex, tag)
//         }
//     })
//     return str
// }

// function removeTagHelperFlags(str: string, ...tags: TagPair[]) {
//     tags.forEach(([beginTag, endTag]) => {
//         if (str.includes(beginTag) && str.includes(endTag)) {
//             str = removeTagFlags(str, beginTag, endTag)
//         }
//     })
//     return str
// }

// // 提取匹配("a",1,2,'b',{..},[...]),不足：当{}嵌套时无法有效匹配
// //  const formatterParamsRegex = /((([\'\"])(.*?)\3)|(\{.*?\})|(\[.*?\])|([\d]+\.?[\d]?)|((true|false|null)(?=[,\b\s]))|([\w\.]+)|((?<=,)\s*(?=,)))(?<=\s*[,\)]?\s*)/g;

// // 支持解析嵌套的{}和[]参数， 前提是：字符串需要经addTagHelperFlags操作后，会在{}[]等位置添加辅助字符
// // 解析嵌套的{}和[]参数基本原理：在{}[]等位置添加辅助字符，然后使用正则表达式匹配，匹配到的字符串中包含辅助字符，然后再去除辅助字符
// const formatterNestingParamsRegex = String.raw`((([\'\"])(.*?)\3))|__TAG_REGEXP__([\d]+\.?[\d]?)|((true|false|null)(?=[,\b\s]))|([\w\.]+)|((?<=,)\s*(?=,))(?<=\s*[,\)]?\s*)`

// /**
//  *  解析格式化器的参数,即解析使用,分割的函数参数
//  * 
//  *  采用正则表达式解析
//  *  支持number,boolean,null,String,{},[]的参数，可以识别嵌套的{}和[]
//  *  
//  * @param {*} str:string    格式化器参数字符串，即formater(<...参数....>)括号里面的参数，使用,分割 
//  * @returns {Array}  返回参数值数组 []
//  */
// export function parseTags(str:string,options?:ParseTagsOptions): any[] {
//     const {beginTag, endTag} = assignObject({
//         beginTag:"{",
//         endTag:"}"
//     },options) as Required<ParseTagsOptions>
//     let params = [];
//     let matched;
//     // 1. 预处理： 处理{}和[]嵌套问题,增加嵌套标识
//     str = addTagHelperFlags(str, [[beginTag, endTag]])
//     try {
//         let regex = new RegExp(getNestingTagsRegex([[beginTag, endTag]]), "g")
//         while ((matched = regex.exec(str)) !== null) {
//             // 这对于避免零宽度匹配的无限循环是必要的
//             if (matched.index === regex.lastIndex) {
//                 regex.lastIndex++;
//             }
//             let value: any = matched[0]
//             if (value.trim() == '') {
//                 value = null
//             } else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
//                 value = value.substring(1, value.length - 1)
//                 value = removeTagHelperFlags(value)
//             } else if ((value.startsWith("{") && value.endsWith("}")) || (value.startsWith('[') && value.endsWith(']'))) {
//                 try {
//                     value = removeTagHelperFlags(value)
//                     // value = safeParseJson(value)
//                 } catch { }
//             } else if (["true", "false", "null"].includes(value)) {
//                 value = JSON.parse(value)
//             } else if (isNumber(value)) {
//                 value = parseFloat(value)
//             } else {
//                 value = removeTagHelperFlags(String(value))
//             }
//             params.push(value)
//         }
//     } catch { }
//     return params
// }