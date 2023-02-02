
export function isInteger(value:any):boolean {
    if(!value) return false
    if(typeof(value)=='number') return true
    if(typeof(value)!='string') return false        
    try{
        let v = parseInt(value)
        return !isNaN(v) && String(v).length===value.length
    }catch{
        return false
    }
}