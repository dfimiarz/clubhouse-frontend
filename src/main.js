import Vue from "vue";
import App from "./App.vue";
import store from "./store/index.js";
import router from "./router";

import vuetify from "./plugins/vuetify";

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

// eslint-disable-next-line no-unused-vars
function initializeVueApp() {
  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Loading
 */
// let imagesToLoad = document.querySelectorAll('img[data-src]');
// const loadImages = (image) => {
//   image.setAttribute('src', image.getAttribute('data-src'));
//   image.onload = () => {
//     image.removeAttribute('data-src');
//   };
// };

// imagesToLoad.forEach((img) => {
//   loadImages(img)
// })

var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {
  // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    store.dispatch("setBrowserInActive");
  } else {
    store.dispatch("setBrowserActive");
  }
}

document.addEventListener(visibilityChange, handleVisibilityChange, false);

store
  .dispatch("checkConnection")
  .then(() => {
    store.dispatch("setUpConnectionWatcher");
  })
  .finally(() => {
    initializeVueApp();
  });
