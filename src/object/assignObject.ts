/**
 * 
 * 使用方法与object.assign一样，差别在于
 * 
 *  Object.assign({a:1},{a:undefined}) === {a:undefined}
 * 
 *  assignObject({a:1},{a:undefined}) === {a:1}
 * 
 * 会忽略掉里面的undefined
 * 
 */




export function assignObject(target: object, ...sources: any[]): any{
    let mapSources = sources.map(source =>{
        const sourceEntries = Object.entries(source)
        if(sourceEntries.some(([k,v]) =>v ===undefined)){
            return sourceEntries.reduce((result:any,[k,v])=>{
                if(v!==undefined) result[k] = v;
                return result
            },{})
        }else{
            return source
        }
    })
    return Object.assign(target,...mapSources);
}