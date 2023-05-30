
import { remove } from "./remove"

declare global {
    interface Array<T> {
        remove(...values:any[]): number; 
    }
}


Array.prototype.remove=function(this:Array<any>,...values:any[]){   
    return remove(this,...values)
}


export * from "./remove"
