
import fs from 'node:fs';
import { deepMerge } from '../object/deepMerge';
import { promises as fsPromises } from 'node:fs';

export function writeJsonFile(jsonfile: string, data:Record<string,any>) {
    let json = {}
    if(fs.existsSync(jsonfile)){
        json = JSON.parse(fs.readFileSync(jsonfile,{encoding:'utf-8'}).toString())
    }
    json = deepMerge(json,data)    
    fs.writeFileSync(jsonfile,JSON.stringify(json,null,4))
    return json
    
}

export async function writeJsonFileAsync(jsonfile: string, data: Record<string, any>) {
    let json = {};
    if (await fsPromises.stat(jsonfile).then(() => true).catch(() => false)) {
        const fileContent = await fsPromises.readFile(jsonfile, { encoding: 'utf-8' });
        json = JSON.parse(fileContent.toString());
    }
    json = deepMerge(json, data);
    await fsPromises.writeFile(jsonfile, JSON.stringify(json, null, 4));
    return json;
}