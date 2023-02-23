import { test,expect} from "vitest"
import {  asyncSignal,AsyncSignalAbort } from "../src/async"


test("中止异步信号asyncSignal",async () => {
    let signal = asyncSignal()
    try{
        setTimeout(() =>signal.reject(new Error("SignalReject")))
        let r = await signal()
    }catch(e:any){
        expect(e.message).toBe("SignalReject")
    }
    try{
        setTimeout(() =>signal.destroy())
        let r = await signal()
    }catch(e:any){
        expect(e).toBeInstanceOf(AsyncSignalAbort)
    }
})
