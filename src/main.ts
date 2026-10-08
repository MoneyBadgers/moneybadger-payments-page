import './assets/main.css'
import './assets/typography.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MixpanelPlugin } from './plugins/mixpanel';
import Honeybadger from "@honeybadger-io/js"
import HoneybadgerVue from "@honeybadger-io/vue"

import App from './App.vue'
import router from './router'
import Vue3Lottie from 'vue3-lottie'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vue3Lottie, { name: "Vue3Lottie" })
app.use(MixpanelPlugin, {
  token: "54c90b6336e7bc3c325cfad1afb0da6e",
  debug: false,
})

let environment = 'testing'
const host = import.meta.env.VITE_HOST
if (/api.cryptoqr.net/i.test(host)){
  environment = 'production'
}
const config = {
    apiKey: "hbp_U5MJeXdUl1pL1SGSn9XPo8tS1hLvqN0D3IEP",
    environment: environment,
}

app.use(HoneybadgerVue, config)

// Drop errors thrown by browser extensions (e.g. "reading 'M_ID'" from chrome-extension://.../executors/200.js); not our code
Honeybadger.beforeNotify((notice) => {
  const fromExtension =
    /(chrome|moz|safari-web)-extension:\/\//.test(notice?.stack ?? '') ||
    notice?.backtrace?.some((frame) => /-extension:\/\//.test(frame.file ?? ''))
  if (fromExtension) return false
})
app.mount('#app')
