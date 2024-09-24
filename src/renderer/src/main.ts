import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useStore } from '@renderer/store/index'

const app = createApp(App)


useStore(app)
app.use(router)
app.mount('#app')
