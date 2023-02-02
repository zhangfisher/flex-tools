/**
 * 判断值是否是一个数字
 * @param {*} value 
 * @returns 
 */
export function isNumber(value:any):boolean {
    if(!value) return false
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false        
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
