import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router'

import vuetify from './plugins/vuetify';

// import InitUtils from './utils/InitUtils'

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

Vue.prototype.$dayjs = dayjs;

Vue.config.productionTip = false;


//---
//Register global onnline, offline listeners and use them to set flag in store
window.addEventListener('offline', handleConnectionStatechange);
window.addEventListener('online', handleConnectionStatechange);

handleConnectionStatechange();

function handleConnectionStatechange() {

  const online = window.navigator.onLine;

  if (online) {
    store.commit('SET_CONNECTED', true)
  } else {
    store.commit('SET_CONNECTED', false)
  }
}
//---

// eslint-disable-next-line no-unused-vars
function initializeVueApp() {
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')

}

/**
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Loading
 */
let imagesToLoad = document.querySelectorAll('img[data-src]');
const loadImages = (image) => {
  image.setAttribute('src', image.getAttribute('data-src'));
  image.onload = () => {
    image.removeAttribute('data-src');
  };
};

imagesToLoad.forEach((img) => {
  loadImages(img)
})


setTimeout(function(){
  initializeVueApp();
},1000);




