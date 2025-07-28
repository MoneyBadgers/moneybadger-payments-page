import './assets/main.css'
import './assets/typography.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MixpanelPlugin } from './plugins/mixpanel';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(MixpanelPlugin, {
  token: "54c90b6336e7bc3c325cfad1afb0da6e",
  debug: import.meta.env.MODE !== 'production',
})

app.mount('#app')
