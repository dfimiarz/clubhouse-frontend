import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue';
import Vuetify,{ VChip,VDivider, VItemGroup, VListItem, VDialog, VAlert } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  components:{
    VChip,VDivider, VListItem, VItemGroup, VDialog, VAlert
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    dark: true
  }
});
