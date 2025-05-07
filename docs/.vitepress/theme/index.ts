// @ts-nocheck
// https://vitepress.dev/guide/custom-theme 
import type { Theme } from 'vitepress'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import DefaultTheme from 'vitepress/theme'
import '@shikijs/vitepress-twoslash/style.css'

import './style.css'

export default {
  extends: DefaultTheme, 
  enhanceApp({ app}) {
    app.use(TwoslashFloatingVue) 
  }
} satisfies Theme
