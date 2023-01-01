import { defineConfig } from 'tsup'

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