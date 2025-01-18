
export async function getDynamicValue<T=any>(this:any,value:any,args?:any[]): Promise<T | undefined>{    
    if(value==null || value==undefined) return undefined    
    if(typeof value === "function"){
        return ( await Promise.resolve(value.apply(this,args)) ) as T
    }else{
        return value as T
    }
}
