
import fs from 'node:fs'
import { deepMerge } from '../object/deepMerge';
import { promises as fsPromises } from 'node:fs';

export function readJsonFile(jsonfile: string,defaultValue?:Record<string,any>) {
    let json = {}
    if(fs.existsSync(jsonfile)){
        json = JSON.parse(fs.readFileSync(jsonfile,{encoding:'utf-8'}).toString())
    }
    if(defaultValue){
        json = deepMerge({},defaultValue,json)
    }
    return json
}

export async function readJsonFileAsync(jsonfile: string, defaultValue?: Record<string, any>) {
    let json = {};
    if (await fsPromises.access(jsonfile).then(() => true).catch(() => false)) {
        json = JSON.parse((await fsPromises.readFile(jsonfile, { encoding: 'utf-8' })).toString());
    }
    if (defaultValue) {
        json = deepMerge({}, defaultValue, json);
    }
    return json;
}