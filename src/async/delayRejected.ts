export async function delayRejected(ms: number,rejectValue?:any){
    return new Promise<Error>((resolve, reject) =>setTimeout(()=>reject(rejectValue || new Error('TIMEOUT')), ms))
}
