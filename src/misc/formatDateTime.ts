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
//@ts-ignore
import replaceAll from "string.prototype.replaceall"
replaceAll.shim()

export interface FormatDateTimeOptions {

}

export interface FormatDateTimeOptions {
    onlyTime?:boolean               // 只
}
 
const month = {
    long  : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    short : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
}

const DefaultDateTimeFormat = "YYYY-MM-DD HH:mm:ss"

/**
 * 获取一天中的时间段
 * @param {*} hour        小时，取值0-23
 * @param {*} options 
 * @returns 
 */
 function getTimeSlot(hour:number,timeSlots:string[]){
    if(hour<0 && hour>23) hour = 0
    const slots = [0,...timeSlots,24]
    let slotIndex = slots.findIndex(v=>v>hour) - 1 
    return timeSlots[slotIndex]
}

export function formatDateTime(value?: Date | number, format?: string,options?:FormatDateTimeOptions) {
    const opts = assignObject({
        timeSlots:[12],
        onlyTime:false
    },options)
    const date = value instanceof Date ? value : new Date(value || Date.now())
    const hour = date.getHours(),Hour = String(hour).padStart(2, "0")
    const hour12 =  hour > 12 ? hour - 12 : hour ,Hour12 = String(hour12).padStart(2, "0")
    const minute = String(date.getMinutes()),second = String(date.getSeconds()),millisecond=String(date.getMilliseconds())    
    let vars = [        
        ["HH", Hour],                                                   // 00-23	24小时，两位数
        ["H", hour],                                                    // 0-23	24小时
        ["hh", Hour12],                                                 // 01-12	12小时，两位数
        ["h", hour12],                                                  // 1-12	12小时
        ["mm", minute.padStart(2, "0")],                                // 00-59	分钟，两位数
        ["m", minute],                                                  // 0-59	分钟
        ["ss", second.padStart(2, "0")],                                // 00-59	秒，两位数
        ["s", second],                                                  // 0-59	秒
        ["SSS", millisecond],                                           // 000-999	毫秒，三位数
        ["A",  hour > 12 ? "PM" : "AM"],                                // AM / PM	上/下午，大写
        ["a", hour > 12 ? "pm" : "am"],                                 // am / pm	上/下午，小写
        ["t",  getTimeSlot(hour)],                                      // 小写时间段，如上午、中午、下午
        ["T",  getTimeSlot(hour)],                                      // 大写时间段，如上午、中午、下午
    ]
    const year =String(date.getFullYear()),month = date.getMonth(),weekday=date.getDay(),day=String(date.getDate())
        vars.push(...[
            ["YYYY", year],                                              // 2018	年，四位数
            ["YY", year.substring(2)],                                   // 18年，两位数        
            ["MMM", $config.month.short[month]],                         // Jan-Dec月，缩写
            ["MM", String(month+1).padStart(2, "0")],                    // 01-12月，两位数字
            ["M", month+1],                                              // 1-12	月，从1开始
            ["DD", day.padStart(2, "0")],                                // 01-31	日，两位数
            ["D", day],                                                  // 1-31	日
            ["d",weekday],                                               // 0-6	一周中的一天，星期天是 0
            ["dd",$config.weekday.short[weekday]],                       //	Su-Sa	最简写的星期几
            ["ddd",$config.weekday.short[weekday]],                      //	Sun-Sat	简写的星期几
            ["dddd",$config.weekday.long[weekday]],                      //	Sunday-Saturday	星期几，英文全称
        ])
    let result = format || DefaultDateTimeFormat
    vars.forEach(([k,v])=>result = result.replaceAll(k,v))
    return result
}