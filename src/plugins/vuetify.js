// import '@mdi/font/css/materialdesignicons.css'
import Vue from "vue";
import Vuetify, {
  VPicker,
  VTimePickerClock,
  VTimePickerTitle,
  VAlert,
} from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  components: {
    VPicker,
    VTimePickerClock,
    VTimePickerTitle,
    VAlert,
  },
  icons: {
    iconfont: "mdiSvg",
  },
  theme: {
    dark: true,
  },
});
