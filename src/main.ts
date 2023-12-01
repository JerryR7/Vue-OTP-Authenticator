import './assets/main.css'
import './assets/reset.css'

import { createApp } from 'vue'
import mock from './mocks/server'
import App from './App.vue'

mock.start({
  onUnhandledRequest: 'bypass',
})
createApp(App).mount('#app')

