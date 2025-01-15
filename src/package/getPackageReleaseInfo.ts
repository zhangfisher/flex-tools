import { execScript } from "../misc/execScript"
import semver from "semver"

export type PackageReleaseInfo = {
    name         : string
    tags         : { [key:string]:string }
    license      : string
    author       : string
    version      : string
    latestVersion: string
    firstCreated : string
    lastPublish  : string
    size         : number
}


/**
 * 从NPM获取包最近发布的版本信息
 * {
    tags: { latest: '1.1.30' },
    license: 'MIT',
    author: 'wxzhang',
    version: '1.1.30-latest',
    latestVersion: '1.1.30',
    firstCreated: '2022-03-24T09:32:51.748Z',
    lastPublish: '2023-01-28T08:49:33.139Z',
    size: 888125
    }
 * @param {*} packageName 
 */
export async function getPackageReleaseInfo(packageName:string) { 
    let results = await execScript(`npm info ${packageName} --json`,{silent:true})
    const info = JSON.parse(results as any)
    const distTags = info["dist-tags"] as string[]

    // 取得最新版本的版本号，不是latest
    const lastVersion = Object.entries(distTags).reduce((result,[tag,value])=>{
        if(semver.gt(value, result.value)){
            result = {tag,value}
        }
        return result
    },{
        tag   : 'latest',
        value : info["version"]
    })

    return {
        name         : packageName,
        tags         : distTags, 
        license      : info["license"], 
        author       : info["author"],
        version      : `${lastVersion.value}-${lastVersion.tag}`,
        latestVersion: info["version"],
        firstCreated : info.time["created"],
        lastPublish  : info.time["modified"],
        size         : info.dist["unpackedSize"] 
    }  
}
    

