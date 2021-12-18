import Vue from 'vue'
import App from './App.vue'
import store from './store/index.js'
import router from './router'

import vuetify from './plugins/vuetify';

import InitUtils from './utils/InitUtils'

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"
import advancedFormat from "dayjs/plugin/advancedFormat"

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

Vue.prototype.$dayjs = dayjs;

Vue.config.productionTip = false;

// eslint-disable-next-line no-unused-vars
function initializeVueApp(){
  new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
}

function showLoadingError(text){
  const loader_error_elem = document.getElementById('loader_error');
  const loader_elem = document.getElementById('loader');
  
  loader_elem.remove();
  loader_error_elem.textContent = text;
}

function startApp(){

    let initStatus = null;

    Promise.allSettled([InitUtils.checkFirebaseLogin(),InitUtils.checkGeoAuth()])
      .then( values => {
        
        const geoAuthResult = values[1];
        const fireBaseResult = values[0];

        initStatus = InitUtils.getInitStatus(geoAuthResult,fireBaseResult);

        if( initStatus === true ){

          const geoauth = geoAuthResult.value.result;
          store.dispatch('userstore/setGeoAuth', geoauth);

          const user = fireBaseResult.value.result
          
          if (user) {
            store.dispatch('userstore/setUser', user.email);
          }
          else {
            store.dispatch('userstore/setUser', null);
          }
        } else {
          showLoadingError(initStatus);
        }
      } )
      .then(() => new Promise((resolve) => setTimeout(resolve,1000)))
      .catch( () => {
        showLoadingError("Unable to verify auth data");
      })
      .finally(() => {
        if( initStatus === true ){
          initializeVueApp()
        }
      })
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

startApp();
 


