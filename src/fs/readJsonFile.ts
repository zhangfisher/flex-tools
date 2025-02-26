
import fs from 'node:fs'
import { deepMerge } from '../object/deepMerge';
import { promises as fsPromises } from 'node:fs';

export function readJsonFile<T extends  Record<string,any> = Record<string,any>>(jsonfile: string,defaultValue?:Partial<T>):T | undefined {
    let json:T = {} as T
    if(fs.existsSync(jsonfile)){
        json = JSON.parse(fs.readFileSync(jsonfile,{encoding:'utf-8'}).toString())
    }
    if(defaultValue){
        json = deepMerge({},defaultValue,json as any) as T
    }
    return json
}

export async function readJsonFileAsync<T extends Record<string,any>= Record<string,any>>(jsonfile: string, defaultValue?: Partial<T>):Promise<T | undefined> {
    let json = {} as T 
    if (await fsPromises.access(jsonfile).then(() => true).catch(() => false)) {
        json = JSON.parse((await fsPromises.readFile(jsonfile, { encoding: 'utf-8' })).toString());
    }
    if (defaultValue) {
        json = deepMerge({}, defaultValue, json) as T
    }
    return json;
}
