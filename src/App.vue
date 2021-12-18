<template>
  <v-app dark>
      <mainscreen></mainscreen>
  </v-app>
</template>

<script>

import maincreen from "./components/MainScreen"

export default {
  name: "app",
  components: {
    'mainscreen': maincreen
  },
  data: () => ({
    drawer: false
  }),
  methods: {
    handleConnectionStatechange: function(){
      const online = window.navigator.onLine;

      if( online ){
        this.$store.commit('SET_CONNECTED',true)
      } else {
        this.$store.commit('SET_CONNECTED',false)
      }
    }
  },

  created: function(){

    this.$store.dispatch('loadPersistantSettings');

    //Set default time zone for the club
    this.$dayjs.tz.setDefault(this.$store.state.clubtz);

    window.addEventListener('offline',this.handleConnectionStatechange);
    window.addEventListener('online', this.handleConnectionStatechange);
    
  },
  beforeDestroy: function(){
    window.removeEventListener('offline',this.handleConnectionStatechange);
    window.removeEventListener('online', this.handleConnectionStatechange);
  }
};
</script>

<style scoped>


</style>
