import { assignObject } from "../object/assignObject"
import { CN_NUMBER_BIG_DIGITS, CN_NUMBER_DIGITS } from "./consts"
import { toChineseNumber } from "./toChineseNumber"

/**
 * 转换为中文大写货币
 * @param {*} value 
 * @param {*} division    分割符号位数,3代表每3个数字添加一个,号  
 * @param {*} prefix      前缀 
 * @param {*} suffix      后缀
 * @param {*} showWhole   显示
 */
 export function toChineseCurrency(value: number | string, options : { big?: boolean, prefix?: string, unit?: string, suffix?: string } = {}, $config: any): string {
    const { big, prefix, unit, suffix } = assignObject({},options)
    let [wholeValue, decimalValue] = String(value).split(".")
    let result
    if (big) {
        result = toChineseNumber(wholeValue,true) + unit
    } else {
        result = toChineseNumber(wholeValue) + unit
    }
    if (decimalValue) {
        if (decimalValue[0]) {
            let bit0 = parseInt(decimalValue[0])
            result = result + (big ? CN_NUMBER_BIG_DIGITS[bit0] : CN_NUMBER_DIGITS[bit0]) + "角"
        }
        if (decimalValue[1]) {
            let bit1 = parseInt(decimalValue[1])
            result = result + (big ? CN_NUMBER_BIG_DIGITS[bit1] : CN_NUMBER_DIGITS[bit1]) + "分"
        }
    }
    return prefix + result + suffix
}