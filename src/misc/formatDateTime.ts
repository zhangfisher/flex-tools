/**
 * 
 * 只想简单地格式化时间和日期，不想引入dayjs
 * 
 * 
 *  格式化参数与dayjs一致
* 根据模板格式化日期时间
 * 

    YY	18	年，两位数
    YYYY	2018	年，四位数
    M	1-12	月，从1开始
    MM	01-12	月，两位数字
    MMM	Jan-Dec	月，英文缩写
    D	1-31	日
    DD	01-31	日，两位数
    H	0-23	24小时
    HH	00-23	24小时，两位数
    h	1-12	12小时
    hh	01-12	12小时，两位数
    m	0-59	分钟
    mm	00-59	分钟，两位数
    s	0-59	秒
    ss	00-59	秒，两位数
    S	0-9	毫秒（百），一位数
    SS	00-99	毫秒（十），两位数
    SSS	000-999	毫秒，三位数
    Z	-05:00	UTC偏移
    ZZ	-0500	UTC偏移，两位数
    A	AM / PM	上/下午，大写
    a	am / pm	上/下午，小写
    Do	1st... 31st	月份的日期与序号
    t   小写时间段，如am,pm
    T   大写时间段段，如上午、中午、下午

*/

import { assignObject } from "../object/assignObject" 
import "../string/replaceAll"

export interface FormatDateTimeOptions {
    language?: 'cn' | 'en',
} 

const dateDict={
    en:{
        month:{
            long        : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            short       : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        },
        weekday:{
            long        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            short       : ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"],
        }
    },
    cn:{
        month:{
            long:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
            short:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
        },
        weekday:{
            long        :["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
            short       : ["周日","周一","周二","周三","周四","周五","周六"]
        }
    }
}
const timeSlots = {
    en:{
        slots  : [12],
        names  : ["AM","PM"]
    },
    cn: {
        slots       : [6,9,11,13,18],
        names  : ["凌晨","早上","上午","中午","下午","晚上"]
    }
}  as any

const DefaultDateTimeFormat = "YYYY-MM-DD HH:mm:ss"
/**
 * 获取一天中的时间段
 * @param {*} hour        小时，取值0-23
 * @param {*} options 
 * @returns 
 */
function getTimeSlot(this:Required<FormatDateTimeOptions>,hour:number){
    if(hour<0 && hour>23) hour = 0
    const slots = [0,...timeSlots[this.language].slots,24]
    let slotIndex = slots.findIndex(v=>v>hour) - 1 
    return timeSlots[this.language].names[slotIndex]
}

export function formatDateTime(value?: Date | number, format?: string,options?:FormatDateTimeOptions) {
    const opts = assignObject({
        language:'cn'
    },options) as Required<FormatDateTimeOptions>
    const date = value instanceof Date ? value : new Date(value || Date.now())
    const hour = date.getHours(),Hour = String(hour).padStart(2, "0")
    const hour12 =  hour > 12 ? hour - 12 : hour ,Hour12 = String(hour12).padStart(2, "0")
    const minute = String(date.getMinutes())
    const second = String(date.getSeconds())
    const millisecond=String(date.getMilliseconds())    
    const year =String(date.getFullYear()),month = date.getMonth(),weekday=date.getDay(),day=String(date.getDate())
    let vars = [        
        ["HH", Hour],                                                   // 00-23	24小时，两位数
        ["H", hour],                                                    // 0-23	24小时
        ["hh", Hour12],                                                 // 01-12	12小时，两位数
        ["h", hour12],                                                  // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond.padStart(3, "0")],                                           // 000-999	毫秒，三位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"],                                 // am / pm	上/下午，小写
        ["t",  getTimeSlot.call(opts,hour)],                           // 小写时间段，如上午、中午、下午
        ["T",  getTimeSlot.call(opts,hour)],                           // 大写时间段，如上午、中午、下午
        ["YYYY", year],                                                 // 2018	年，四位数
        ["yyyy", year],
        ["YY", year.substring(2)],                                   // 18年，两位数        
        ["MMM", dateDict[opts.language].month.short[month]],                         // Jan-Dec月，缩写
        ["MM", String(month+1).padStart(2, "0")],                    // 01-12月，两位数字
        ["M", month+1],                                              // 1-12	月，从1开始
        ["DD", day.padStart(2, "0")],                                // 01-31	日，两位数
        ["D", day],                                                  // 1-31	日
        ["d",weekday],                                               // 0-6	一周中的一天，星期天是 0
        ["dd",dateDict[opts.language].weekday.short[weekday]],       //	Su-Sa	最简写的星期几
        ["ddd",dateDict[opts.language].weekday.short[weekday]],      //	Sun-Sat	简写的星期几
        ["dddd",dateDict[opts.language].weekday.long[weekday]],      //	Sunday-Saturday	星期几，英文全称
    ]    
    let result = format || DefaultDateTimeFormat
    vars.forEach(([k,v])=>result = result.replaceAll(k,v))
    return result
}