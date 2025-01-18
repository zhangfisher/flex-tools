import { writeFile,copyFile as copy } from "./nodefs";
import { existsSync } from "node:fs";
import path from "node:path"
import artTemplate from "art-template";
import { getDynamicValue } from "../misc/getDynamicValue";

export type CopyTemplateFileOptions = {
	vars?            : Record<string, any> | ((file: string) => Record<string, any> | Promise<Record<string, any>>); 
    overwrite?       : boolean | ((filename: string) => boolean | Promise<boolean>); 
    templateOptions? : Record<string, any> | ((file: string) => Record<string, any> | Promise<Record<string, any>>); 
}


const JsonFilter =(v:any)=>{
    try{
        return JSON.stringify(v,null,4);
    }catch{
        return v
    }
}


export async function copyFile( source: string,target: string, options?:CopyTemplateFileOptions) {    
    const opts = Object.assign({  
        overwrite: false
    }, options);    
    const shouldOverwrite = await getDynamicValue.call(opts,opts.overwrite,[target])
    if (shouldOverwrite === false && existsSync(target)) {
        return;
    }    

    if (target.endsWith(".art")) {
        target = path.join( path.dirname(target), path.basename(target, ".art") );
    }

    if(source.endsWith(".art")){
        const template = artTemplate(source);        
        artTemplate.defaults.imports.json = JsonFilter    
        const templateVars = await getDynamicValue.call(opts,opts.vars,[ source ]); 
        const templateOptions = Object.assign({
            escape : false
        },await getDynamicValue.call(opts,opts.templateOptions,[ source ]))                                    
        await writeFile(target, template(templateVars,templateOptions), { encoding:"utf-8" });
    }else{
        await copy(source, target);
    }
    
}