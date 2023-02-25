import { FileSize } from "../types";


/**
 * 将一个FileSize类型的表示文件大小的字符转化为字节值
 * @param n 
 */
const sizes={b:0,k:1,m:2,g:3,t:4,p:5,e:6} as Record<string, number>
export function parseFileSize(n:FileSize | number):number {
    if(typeof n === "number"){
        return n
    }else if(typeof n === "string"){
        let [integer=0,decimal=0] = String(parseFloat(n)).split(".")
        const unit = n.trim().replace(/\d?\.*\d?/,"")
                            .toLowerCase()
                            .replace("byte","b")
                            .replace("bytes","b")
                            .replace("kb","k")
                            .replace("mb","m")
                            .replace("gb","g")
                            .replace("tb","t")
                            .replace("pb","p")
                            .replace("eb","e")
        if(!(unit in sizes)) throw new TypeError('File size must be one of [B,KB,MB,GB,TB,PB,EB]')
        const unitSize = Math.pow(1024,sizes[unit])
        let value = Number(integer) * unitSize
        decimal = Number(decimal)
        if(decimal>0){
            decimal = parseFloat(`0.${decimal}`)
            value+=decimal * unitSize
        }
        return value
    }else{
        throw new TypeError()
    }
}