/**
 *   使用正则表达式解析非标JOSN
 *
 */

// 匹配键名和值不规范的JSON字符串
// //const badJsonRegex = /(\s*[\w\u4e00-\u9fa5]+\s*(?=:))|((?=:\s*)\'.*\')|(\'.*?\'(?=\s*:))|((?<=:\s*)\'.*?\')/gm
// const badJsonRegex =/(\s*[\w\u4e00-\u9fa5]+\s*(?=:))|((?=:\s*)\'.*\')|(\'.*?\'(?=\s*:))|((?<=:\s*)\'.*?\')|((?<=,|\[\s*)\'.*?\')/gm

// 匹配未添加逗号的行
const addLineCommaRegex = /\n/gm;

// 匹配使用""或''包裹字符串
const strVarRegex = /(["'])(.*?)(\1)/gm;
// 匹配没有使用 "" 包裹的 key
const badKeyRegex = /([\s\[\,\{])(\w+)(\s*\:)/gm;

/**
 * 解析非标准的 JSON 字符串
 * 非标准的 JSON 字符串指的是：
 *  - key 没有使用 "" 包裹
 *  - 字符串 value 没有使用 "" 包裹
 *
 * @param {*} str
 * @param {(key: string, value: any) => any} [callback] - 可选回调函数，用于自定义解析
 * @returns {any} 解析后的对象
 */
export function safeParseJson(str: string, callback?: (key: string, value: any) => any) {
	// 先尝试解析一个JSON字符串，如果解析失败，再尝试进行修复
	try {
		return JSON.parse(str, (key, value) => {
			if (callback) {
				return callback(key, value);
			}
			return value;
		});
	} catch {}
	// 1. 如果行未添加逗号，添加逗号
	let resultStr = str.replace(addLineCommaRegex, (match, offset, string) => {
		// 判断前面和后面的字符，是否需要添加逗号
		const before = string.slice(0, offset).trim();
		const after = string.slice(offset + 1).trim();
		if (!/,$/.test(before) && !/[\[\{\}]$/.test(before) && !/^\}/.test(after)) {
			return ',\n';  // 需要逗号
		}
		return '\n';  // 保持原换行
	});

	// 2. 匹配使用 "" 或 '' 包裹的字符串，全部编码以防止后继正则出错
	resultStr = resultStr.replaceAll(strVarRegex, (s, begin, value) => {
		return `"${encodeURI(value)}"`;
	});

	// 3. 将没有用 "" 包裹的 key 全部加上 ""
	resultStr = resultStr.replaceAll(badKeyRegex, (s, p1, key, p2) => {
		return `${p1}"${key}"${p2}`;
	});

	// 4. 将全角字符转换为半角字符，容错处理
	resultStr = resultStr.replaceAll("，", ",").replaceAll("“", '"').replaceAll("”", '"');

	// 尝试再次解析修复后的 JSON 字符串
	return JSON.parse(resultStr, (key, value) => {
		if (typeof value == "string") value = decodeURI(value);
		if (callback) {
			return callback(key, value);
		}
		return value;
	});
}
