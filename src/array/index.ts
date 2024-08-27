
import { getItem } from "./getItem";
import { remove } from "./remove"

declare global {
    interface Array<T> {
        remove(...values:any[]): number; 
        get<T=any>(index:number,defaultValue?:T | undefined):T | undefined; 
    }
}


Array.prototype.remove=function(this:Array<any>,...values:any[]){   
    return remove(this,...values)
}
Array.prototype.get=function<T=any>(this:Array<T>,index:number,defaultValue?:T | undefined):T | undefined{   
    return getItem<T>(this,index,defaultValue)
}

export * from "./remove"
export * from "./getItem"