// @ts-nocheck
import { defineConfig } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
// import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "FlexTools",
  description: "typescript modular utilities.",
  base: '/flex-tools/',
  themeConfig: {
    outline: {
      label: "目录",
      level: [2, 5]
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: '更新历史', link: '/history' },
      { text: '开源推荐', link: 'https://zhangfisher.github.io/repos/' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: "数组", link: "/guide/array" },
          { text: "异步", link: "/guide/async" },
          { text: "中文", link: "/guide/chinese" },
          { text: "类", link: "/guide/classs" },
          { text: "集合", link: "/guide/collection" },
          { text: "事件", link: "/guide/events" },
          { text: "文件", link: "/guide/fs" },
          { text: "函数", link: "/guide/func" },
          { text: "迭代", link: "/guide/iterators" },          
          { text: "对象", link: "/guide/object" },
          { text: "包", link: "/guide/package" },
          { text: "字符串", link: "/guide/string" },
          { text: "树", link: "/guide/tree" },
          { text: "类型检测", link: "/guide/typecheck" },
          { text: "杂项", link: "/guide/misc" },
          { text: "Typescript类型", link: "/guide/types" }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhangfisher/flex-tools' }
    ]
  },
  vue: {
      template: {
          compilerOptions: {
              whitespace: 'preserve'
          }
      }
  },
  markdown: {
      codeTransformers: [
          transformerTwoslash({
            // typesCache: createFileSystemTypesCache()
          })          
      ],
      languages: ['js', 'jsx', 'ts', 'tsx']
  }
})
