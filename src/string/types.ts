export {}
declare global {
    interface String {
        params(params: Record<string, any>): string;
        params(...args: any[]): string;
        params(args: any[]): string;
        rjust(width:number,fillChar:string):string
        ljust(width:number,fillChar:string):string
        firstUpper(): string;
        center(width: number, fillChar?: string): string;
        trimBeginChars(chars: string,atBegin?:boolean): string
        trimEndChars(chars: string,atEnd?:boolean): string 
    }
}
 