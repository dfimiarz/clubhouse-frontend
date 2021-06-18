import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router'

import vuetify from './plugins/vuetify';

import InitUtils from './utils/InitUtils'
import auth from './firebase';

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"
import advancedFormat from "dayjs/plugin/advancedFormat"

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

Vue.prototype.$dayjs = dayjs;

Vue.config.productionTip = false

let app = null;

function initializeApp() {
  app = new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
}

function setupFirebaseWatcher() {

  return auth.onAuthStateChanged((user) => {

    if (user) {
      store.dispatch('userstore/setUser', user.email);
    }
    else {
      store.dispatch('userstore/setUser', null);
    }

    if (!app) {
      store.commit('SET_INIT_STATUS', true);
      initializeApp()
    }

  }, () => {
    
    if (!app) {
      store.commit('SET_INIT_STATUS', 'Unable to check user authentication.');
      initializeApp()
    }

    store.dispatch('userstore/setUser', null);

  })


}

InitUtils.checkGeoAuth()
  .then((val) => {
    store.dispatch('userstore/setGeoAuth', val);
    setupFirebaseWatcher();
  })
  .catch(() => {
    store.commit('SET_INIT_STATUS', 'Network authentication check failed.');
    initializeApp();
  })

