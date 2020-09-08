import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router'

import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

store.dispatch('loadToken').then(() => {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')    
})
.catch(() => {
  let element = document.getElementById('app');
  element.textContent="Error accessing localstorage";
})
