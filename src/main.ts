import './assets/main.css'
import './assets/typography.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MixpanelPlugin } from './plugins/mixpanel';

import App from './App.vue'
import router from './router'

const app = createApp(App)

console.log(import.meta.env)
console.log(import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN)

app.use(createPinia())
app.use(router)
app.use(MixpanelPlugin, {
  token: import.meta.env.VITE_MIXPANEL_PROJECT_TOKEN,
  debug: process.env.NODE_ENV !== 'production',
})

app.mount('#app')
