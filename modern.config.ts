import moduleTools, { defineConfig } from '@modern-js/module-tools'
import type { CliPlugin, ModuleTools } from '@modern-js/module-tools';
import copy from "esbuild-copy-files-plugin";

const esbuildOptions = {
  plugins: [
    copy({
      source: ['package.json', 'README.md', 'LICENSE'],
      target: "dist/"
    })
  ],
  banner: {
    js: `/**
*        
*   ---=== FlexTools ===---
*   https://zhangfisher.github.com/flex-tools
* 
*   一些实用工具函数
*
*/`}
}

const ModulePlugin = (): CliPlugin<ModuleTools> => ({
  name: 'module',
  setup: () => ({
    modifyLibuild(config) {
      config.esbuildOptions = c => {
        c.banner = esbuildOptions.banner;
        c.plugins?.push(...esbuildOptions.plugins);
        c.entryNames = '[dir]/[name]'
        c.chunkNames = '[name]-[hash]';
        if (config.format === 'esm') {
          c.outExtension = { '.js': '.mjs' }
        }
        return c;
      };
      return config;
    },
  }),
});

export default defineConfig({
  plugins: [moduleTools(), ModulePlugin()],
  buildConfig: [
    {
      input: ['src'],
      format: 'esm',
      splitting: true,
      sourceMap: false,
      minify: 'esbuild',
      dts: false,
      target: 'es2021',
    },
    {
      buildType: 'bundleless',
      dts: {
        only: true
      }
    },
    {
      input: ['src'],
      format: 'cjs',
      splitting: true,
      sourceMap: false,
      minify: 'esbuild',
      dts: false,
      target: 'es2021',
    },
  ]
}) 