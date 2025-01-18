import { copyFiles } from "../../src/fs/copyFiles";
import path from "node:path";
 

async function copydemo(){
    await copyFiles("*.*", "target",{
        cwd: path.join(__dirname,"source"),
        overwrite:true,
        vars: {
            scopeId: "app",
            languages:[
                { name:"zh-CN",title:"中文", nativeTitle:"中文" },
                { name:"en-US",title:"English", nativeTitle:"English" },
                { name:"ja-JP",title:"日本語", nativeTitle:"日本語" }
            ],
            library:false,
            activeLanguage:"zh-CN",
            defaultLanguage:"zh-CN"
        }
    })
}


copydemo().then(()=>{
    console.log("copyFiles done")
})

