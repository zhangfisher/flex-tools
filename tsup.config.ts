import { defineConfig } from 'tsup'

export default defineConfig({
    entry: [
        'src/index.ts'
    ],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake:false,  
    banner: {
        js: `/**
*        
*   ---=== FlexUtils ===---
*   https://zhangfisher.github.com/flex-utils
* 
*   一些实用工具函数
*
*/`}
}) 