import moduleTools, { defineConfig } from '@modern-js/module-tools';

export default defineConfig({
    plugins: [moduleTools()],
    buildConfig: [
        {
          format: "cjs",
          target: "es6",
          buildType: "bundleless",
          outDir: "./dist/cjs",
          minify:'terser'
        },
        {
          format: "esm",
          target: "es6",
          buildType: "bundleless",
          outDir: "./dist/es",
          splitting: true,
          minify:'terser'
        },
        {
          buildType: "bundleless",
          outDir: "./dist/types",
          dts: {
            only: true,
          },
        },
      ],
})