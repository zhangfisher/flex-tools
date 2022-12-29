/**
 * 不可重入
 * @param fn 
 * @param options 
 * @returns 
 */
export function noReentry(fn:Function,options?:{silence?:boolean}) {
    let running = false
    return async function (this:any,...args:any[]) {
        if(running) {
            if(options?.silence) return
            throw new Error("noReentry")
        }
        running = true
        try{
            return await fn.apply(this, args);            
        }finally{
            running = false
        }         
    }
}
