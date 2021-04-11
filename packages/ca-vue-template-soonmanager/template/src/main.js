import { createApp } from 'vue'
import App from './App.vue'
import VueSoonspace from 'vue-soonspace'

const app = createApp(App)

app.use(VueSoonspace)
app.mount('#app')
