/**
 * 判断值是否是一个数字
 * 
 * 默认情况下，也会对字符串类型的数字进行判断
 * 如isNumber('123')返回true
 * 
 * 
 * @param {*} value 
 * @returns 
 */
export function isNumber(value:any,strict:boolean=false):boolean {    
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false
    // 如果是严格模式，那么不允许字符串类型的数字
    if(strict) return false        
    try{
        if(value.includes(".")){
            let v = parseFloat(value)
            if(value.endsWith(".")){                
                return !isNaN(v) && String(v).length===value.length-1
            }else{
                return !isNaN(v) && String(v).length===value.length
            }            
        }else{
            let v = parseInt(value)
            return !isNaN(v) && String(v).length===value.length
        }    
    }catch{
        return false
    }
}
