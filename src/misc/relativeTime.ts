/**
 * 
 * 返回相对时间描述
 * 
 * baseTime
 * relativeTime("2022/12/22") ==// 5分钟前
 */

import { assignObject } from "../object/assignObject"

// 对应:秒,分钟,小时,天,周,月,年的毫秒数,月取30天，年取365天概数31536000000
const TIME_SECTIONS = [1000,60000,3600000,86400000,604800000,2592000000,31536000000,Number.MAX_SAFE_INTEGER]
export interface RelativeTimeOptions{
    units?:string[]
    now?:string
    before?:string
    after?:string
}
export function relativeTime(value:Date | number,baseTime?:Date | number,options?:RelativeTimeOptions){    
    const { units,now,before,after } =assignObject({
        units: ["秒","分钟","小时","天","周","个月","年"],  //["seconds","minutes","hours","days","weeks","months","years"]
        now:"刚刚",
        before:"{value}{unit}前",
        after:"{value}{unit}后"
    },options)
    let ms =typeof(value)=='number' ? new Date(value).getTime() : value.getTime()
    let msBase = ((baseTime instanceof Date) ? baseTime : (typeof(baseTime)=='number') ? new Date(baseTime) : new Date()).getTime()
    let msDiff = ms - msBase
    let msIndex = TIME_SECTIONS.findIndex(x=>Math.abs(msDiff) <  x) - 1   
    if(msIndex < 0) msIndex = 0
    if(msIndex > TIME_SECTIONS.length-1 ) msIndex = TIME_SECTIONS.length-1
    if(msDiff<1000 && msDiff>-1000 ){
        return now
    }else if(msDiff<=-1000){// 之前
        let result = parseInt(String(Math.abs(msDiff) / TIME_SECTIONS[msIndex]))
        return before.replace("{value}",result).replace("{unit}",units[msIndex])
    }else{// 之后
        let result = parseInt(String(Math.abs(msDiff) / TIME_SECTIONS[msIndex]))
        return after.replace("{value}",result).replace("{unit}",units[msIndex])
    }
}
