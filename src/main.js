import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import { store } from './store/index.js'
import router from './router'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(Vuetify)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
