/**
 *  生成一个异步控制信号
 *
 *  当满足condition时会进行等待
 *
 *  定义一个异步等待信号
 *  let signal = asyncSignal()
 *
 *  //
 *  然后在需要等待的地方
 *  await signal()
 *  await signal(100)  代表信号会自动超时resolve
 *  await signal(100,new Error())  代表信号会自动超时reject
 *
 *  可以手动resolve或reject该signal
 *  当要结束等待时调用 signal.resolve()
 *  当等待出错时调用 signal.reject()
 *
 * 可以传入一个condition函数，当signal.resolve时，会同时进行调用，该函数必须返回true，否则会继承等待
 * 超时时不会调用
 * let signal = asyncSignal(()=>{})
 *
 *  当signal使用一次后，如果需要再次使用，则需要signal.reset()复位一下，然后就可以
 *   await signal()
 *
 *  @param {Function} constraint 约束函数，指定当resolve或reject时，需要同时满足这个约束函数返回true才会进行resolve或reject
 *
 */ 

 
 export class AsyncSignalAbort extends Error {}
 
 export interface IAsyncSignal {
    (timeout?:number,returns?:any):Awaited<Promise<any>>
    id:number
    reset(): void
    reject(e?:Error | string):void
    resolve(result?: any):void
    destroy():void
    isResolved():boolean
    isRejected():boolean
    isPending():boolean
 }


let AsyncSignalId = 0

/**
 * 生成一个异步信号
 * 
 * const signal = asyncSignal()
 * const signal = asyncSignal(()=>x==1,{timeout:10})
 * 
 * await  signal(timeout)
 * signal.resolve()
 * signal.reject()
 * signal.destroy()
 *
 * @param {function} constraint
 *      当调用signal.resolve()时，还需要满足额外的约束条件，仅当constraint返回true，则signal才可以进行真正resolve
 * @returns {function}
 */

export function asyncSignal(constraint?:Function,options:{timeout:number}={timeout:0}) : IAsyncSignal {     
     let isResolved:boolean = false,isRejected:boolean = false,isPending:boolean = false
     let resolveSignal:Function, rejectSignal:Function, timeoutId:any = 0
     let objPromise:Promise<any> | null
     let signalId = ++AsyncSignalId

     // 重置信号，可以再次复用
     const reset = function () {
         clearTimeout(timeoutId)
         isResolved = false
         isRejected = false
         isPending = false
         objPromise = new Promise((resolve, reject) => {
             resolveSignal = resolve
             rejectSignal = reject
         })
     }
     
     reset()

    async function signal(timeout:number =0 , returns?:any){
         // 如果constraint返回的true，代表不需要等待
         if (typeof (constraint) === "function" && constraint()) {
             isResolved = true
             return
         }

         // 如果信号上次已经完成了，则需要重置信号
         if (isResolved || isRejected) reset()
 
         // 指定超时功能
         if (timeout > 0) {
             timeoutId = setTimeout(() => {
                 isResolved = true
                 try {
                     if (returns instanceof Error) {
                         rejectSignal(returns)
                     } else {
                         resolveSignal(returns)
                     }
                 } catch {
                 }
             }, timeout)
         }
         isPending = true
         return objPromise
     }
     signal.id = signalId
     signal.resolve = (result?:any) => {        
         clearTimeout(timeoutId)
         if(!isPending) return 
         if (isResolved || isRejected) return
         // 注意：是否真正resolve还受约束条件的约束，只有满足约束条件时才会真正resolve
         if (typeof (constraint) === "function" && constraint()) {
             if(constraint()){
                 resolveSignal(result)
             }else{
                // 如果不满足约束条件，则静默返回，可以通过signal.isFulfilled()来判断是否完成
                return    
             }
         } else {
             resolveSignal(result)
         }
         isResolved = true
     } 

     signal.reject = (e?:Error | string) => {        
         clearTimeout(timeoutId)
         if(!isPending) return 
         if (isResolved || isRejected) return
         rejectSignal(typeof(e)==='string' ? new Error(e) : ((e instanceof Error) ? e : new Error()))
         isRejected = true
     }
 
     // 信号被销毁时，产生一个中止错误，信号的使用者可以据此进行善后处理
     signal.destroy = () => {
        clearTimeout(timeoutId)
        if(isPending) rejectSignal(new AsyncSignalAbort())   
        isResolved =false
        isPending = false         
        isRejected =false
        objPromise = null
     }

     signal.reset = reset
     signal.isResolved = () => isResolved
     signal.isRejected = () => isRejected 
     signal.isPending = () => isPending 
     return signal as unknown as IAsyncSignal
 }
 
 /**
  *   管理多个异步信号，并确保能正确resolve和reject
  *
  *
  *
  *  let signals = new AsyncSignalManager({
  *      timeout:60 * 1000,               // 所有信号均在1分钟后自动超时，0代表不设超时，并且此值应该大于signal(timeout)时指定的超时值
  *  })
  *
  *  signal = signals.create() 创建一个asyncSignal
  *
  *  signals.destroy()   销毁所有异步信号
  *  signal.resolve()    resolve所有异步信号
  *  signal.reject()     reject所有异步信号
  *  signal.reset()      reset所有异步信号
  *
  *
  */
  

 export class AsyncSignalManager {
    #_signals:Record<string,IAsyncSignal> = {}
    constructor(public options?:{timeout: number} ) {
         this.options = Object.assign({
             timeout:0,// 为所有异步信号提供一个默认的超时时间，当信号超时未resolve时，会自动进行reject(timeout)
         },options)
     }
     get signals():Record<string,IAsyncSignal> {return this.#_signals} 
 
     /**
      * 创建新的异步信号
      * @param constraint         额外的约束条件
      * @param id
      */
     create(constraint?:Function){
         let signal = asyncSignal(constraint,this.options)
         this.#_signals[signal.id] = signal
         return signal
     }
 
     /**
      * 销毁指定的或者所有异步信号
      *
      *  destroy(id)
      *  destroy([id,id,...])
      *  destroy()                   // 销毁所有
      * @param {string} id           可选的信号id,如果未指定则删除所有的信号
      *
      */ 
      
    destroy(id:number | number[] | undefined) {
         let ids = Array.isArray(id) ? id : (id===undefined ? Object.keys(this.#_signals) : [id])
         for(let id of ids){
             if(id in this.#_signals){
                 try{
                     this.#_signals[id].destroy()
                     delete this.#_signals[id]
                 }catch (e) { }
             }
         }
    }
    resolve(){
         let args = arguments
         Object.values(this.#_signals).forEach(signal=>signal.resolve(args))
    }
    reject(e:Error | string){
         Object.values(this.#_signals).forEach(signal=>signal.reject(e))
    }
    reset(){
         Object.values(this.#_signals).forEach(signal=>signal.reset())
    }
 } 

 