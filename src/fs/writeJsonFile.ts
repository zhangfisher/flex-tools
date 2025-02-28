
import fs from 'node:fs';
import { deepMerge } from '../object/deepMerge';
import { promises as fsPromises } from 'node:fs';

export function writeJsonFile<T extends  Record<string,any> = Record<string,any>>(jsonfile: string, data:T) {
    let json = {} as T
    if(fs.existsSync(jsonfile)){
        json = JSON.parse(fs.readFileSync(jsonfile,{encoding:'utf-8'}).toString())
    }
    json = deepMerge(json,data) as T   
    fs.writeFileSync(jsonfile,JSON.stringify(json,null,4))
    return json
    
}

export async function writeJsonFileAsync<T extends  Record<string,any> = Record<string,any>>(jsonfile: string, data: Record<string, any>):Promise<T | undefined> {
    let json = {} as T;
    if (await fsPromises.stat(jsonfile).then(() => true).catch(() => false)) {
        const fileContent = await fsPromises.readFile(jsonfile, { encoding: 'utf-8' });
        json = JSON.parse(fileContent.toString());
    }
    json = deepMerge(json, data) as T
    await fsPromises.writeFile(jsonfile, JSON.stringify(json, null, 4));
    return json;
}