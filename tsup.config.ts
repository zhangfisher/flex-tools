import { defineConfig } from 'tsup'
import copy from "esbuild-copy-files-plugin";


export default defineConfig({
    entry: [
        'src/**/*.ts'
    ],
    format: ['esm','cjs'],
    dts: true,
    splitting: true,
    sourcemap: false,
    clean: true,
    treeshake:true,  
    minify: true,
    esbuildPlugins:[
        copy({
            source:['package.json','README.md','LICENSE'],
            target:"dist/"
        })
    ],
    noExternal:["lodash"],
    banner: {
        js: `/**
*        
*   ---=== FlexTools ===---
*   https://zhangfisher.github.com/flex-tools
* 
*   一些实用工具函数
*
*/`}
}) 