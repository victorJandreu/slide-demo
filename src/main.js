import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://eb867467f63dcda3fe1bbb9dc29ba6c4@o4509020591423488.ingest.de.sentry.io/4509020623011920',
})

app.use(createPinia())
app.use(router)

app.mount('#app')
