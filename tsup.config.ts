import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/**/*.ts'
    ],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    treeshake:true,  
    publicDir:"./release",
    // external:[/^\./],
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