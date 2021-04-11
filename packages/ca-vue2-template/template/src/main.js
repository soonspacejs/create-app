import Vue from 'vue'
import VueSoonspace from 'vue-soonspace'
import App from './App.vue'

Vue.use(VueSoonspace)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
