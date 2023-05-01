
/**
 * 
 * 将数字转换为中文数字
 * 
 * 注意会忽略掉小数点后面的数字
 * 
 * @param {*} value  数字
 * @param {*} isBig 是否大写数字 
 * @returns 
 */

import { isNumber } from "../typecheck/isNumber"
import { CN_NUMBER_BIG_DIGITS, CN_NUMBER_BIG_UNITS, CN_NUMBER_DIGITS, CN_NUMBER_UNITS } from "./consts";


 export function toChineseNumber(value: number | string, isBig?: boolean) {
    if (!isNumber(value)) return value;
    let [wholeValue, decimalValue] = String(value).split(".") // 处理小数点     
    const DIGITS = isBig ? CN_NUMBER_BIG_DIGITS : CN_NUMBER_DIGITS
    const UNITS = isBig ? CN_NUMBER_BIG_UNITS : CN_NUMBER_UNITS
    let result = ''
    if (wholeValue.length == 1) return DIGITS[parseInt(wholeValue)]
    for (let i = wholeValue.length - 1; i >= 0; i--) {
        let bit = parseInt(wholeValue[i])
        let digit = DIGITS[bit]
        let unit = UNITS[wholeValue.length - i - 1]
        if (bit == 0) {
            let preBit = i < wholeValue.length ? parseInt(wholeValue[i + 1]) : null// 上一位
            let isKeyBits = ((wholeValue.length - i - 1) % 4) == 0
            if (preBit && preBit != 0 && !isKeyBits) result = "零" + result
            if (isKeyBits) result = UNITS[wholeValue.length - i - 1] + result
        } else {
            result = `${digit}${unit}` + result
        }
    }
    if (isBig) {
        result = result.replace("垓京", "垓")
            .replace("京兆", "京")
            .replace("兆億", "兆")
            .replace("億萬", "億")
            .replace("萬仟", "萬")
        if (result.startsWith("壹拾")) result = result.substring(1)
    } else {
        result = result.replace("垓京", "垓")
            .replace("京兆", "京")
            .replace("兆亿", "兆")
            .replace("亿万", "亿")
            .replace("万千", "万")
        if (result.startsWith("一十")) result = result.substring(1)
    }
    return result    // 中文数字忽略小数部分
}
