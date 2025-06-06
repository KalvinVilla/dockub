/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import transmitPlugin from '../plugins/transmit'

import.meta.glob(['../../resources/favicon/**', '../../resources/manifest.webmanifest'])

const appName = import.meta.env.VITE_APP_NAME || 'Dockhub'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .use(transmitPlugin)
      .mount(el)
  },
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => {
        console.log('SW registered: ', reg)
        if (reg.installing) {
          console.log('Service worker installing')
        } else if (reg.waiting) {
          console.log('Service worker installed')
        } else if (reg.active) {
          console.log('Service worker active')
        }
      })
      .catch((err) => {
        console.error('SW registration failed: ', err)
      })
  })
}
