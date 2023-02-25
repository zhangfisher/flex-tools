import { TimeDuration } from "../types";


/**
 * 将一个TimeInterval类型的时间单位的字符转化为毫秒值
 * @param n 
 */
const sizes={ms:1,s:1000,m:60000,h:3600000,D:86400000,W:604800000,M:2592000000,Y:31104000000} as Record<string, number>

export function parseTimeDuration(n:TimeDuration):number {
    if(typeof n === "number"){
        return n
    }else if(typeof n === "string"){
        let [integer=0,decimal=0] = String(parseFloat(n)).split(".")       
        let unit = n.trim().replace(/\d?\.*\d?/,"") 
                            .replace("Milliseconds","ms")
                            .replace("Seconds","s") 
                            .replace("Minutes","m") 
                            .replace("Hours","h") 
                            .replace("Days","D") 
                            .replace("d","D") 
                            .replace("Weeks","W") 
                            .replace("w","W")
                            .replace("Months","M") 
                            .replace("Years","Y") 
                            .replace("y","Y")

        if(unit=='') unit = "ms"
        if(!(unit in sizes)) throw new TypeError('Time unit must be one of [ms,s,m,h,d,D,w,W,M,y,Y]')
        const unitSize = sizes[unit]
        let value = Number(integer) * unitSize
        decimal = Number(decimal)
        if(decimal>0){
            decimal = parseFloat(`0.${decimal}`)
            value+= unitSize * decimal
        }
        return value
    }else{
        throw new TypeError()
    }
}