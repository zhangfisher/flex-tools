


let times:number[] = [];

export interface TimerOptions{
    begin(reset?:boolean):void
    end(tips?:string,options?:{unit:string,log:boolean}):number 
}

export const timer:TimerOptions = {
    /**
     * begin与end应该配对
     * @param {Boolean} reset  是否重置计时
     */
     begin:(reset?:boolean)=>{ 
        if(reset) times = []
        times.push(Date.now())
     },
     /**
      * 
      * @param {*} unit 时间单位s=秒,ms=毫秒
      * @param {*} returnWithUnit  是否返回包括单位的字符串      
      * @returns 
      */
     end:(tips?:string,options?:{unit:string,log:boolean}):number=>{        
        const {unit='ms',log=true} = options || {}
        const now = Date.now()
        const value = now - (times.pop() || now)
        const result = unit=="s" ? value / 1000  : value
        if(log) console.log(tips || 'time consuming:', `${result}${unit}`)
        return value
     } 
 } 
