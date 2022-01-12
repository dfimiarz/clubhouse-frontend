<template>
  <v-app dark>
    <transition name="slide-fade" mode="out-in">
      <loading-screen v-if=" ! active "></loading-screen>
      <mainscreen v-else></mainscreen>
    </transition>
    <v-overlay :value="overlay_visible">
        <v-progress-circular indeterminate size="64" v-if="loading"></v-progress-circular>
        <div class="d-flex flex-column text-h6 black" v-else-if="error">
            <div class="text-center pa-2"> {{ error }} </div>
        </div>
    </v-overlay>
  </v-app>
</template>

<script>

import mainscreen from "./components/MainScreen"
import LoadingScreen from './components/LoadingScreen.vue';

export default {
  name: "app",
  components: {
    'mainscreen': mainscreen,
    LoadingScreen
  },
  data: function() {
    return {
      initErrors:{
        geo_err: null,
        user_err: null,
        shared_err: null,
        targetRouteName: null
      }
    }
  },
  computed: {
    loading: {
      get: function(){
        return this.$store.state.loading;
      },
      set: function(val) {
        this.$store.dispatch('setLoading',val)
      }
    },
    error: {
      get: function(){
        return this.$store.state.error;
      },
      set: function(val){
        this.$store.dispatch('setError',val)
      }
    },
    connected: function(){
      return this.$store.state.connected;
    },
    overlay_visible: function() {
      return this.loading || this.error;
    },
    active: function () {
      return this.$store.getters["appActive"];
    },
    userAuthenticated: function(){
      return this.$store.getters['userstore/isAuthenticated'];
    },
    isAppInitializing: function(){
      return this.$store.state.initializing;
    }
  },
  methods: {
    navigateToHome: function(){
      if (this.$route.name !== "home") {
        this.$router.push({ name: "home" });
      }
    }
  },
  watch: {
    connected: {
      handler: function(newval){

        if( newval === true ){

          if( ! this.$store.getters['appActive'] ){

            this.$store.dispatch("initializeApplication")
            .then(() => {
              
            })
            .catch((err) =>{
              this.$store.dispatch("setLoadingError",err.message);
            })
            .finally(() => {
              
            })
          }
          
        }
        else {
          this.$store.dispatch("resetApplicationState");
        }
        
      }
    },
    userAuthenticated: {
      handler: function(newval){


        if( this.active ){

          if( newval ){

            this.loading = true;

            this.$store.dispatch("loadAppResources")
            .then(() => {
              this.navigateToHome();
            })
            .catch((err) => {
              this.$store.dispatch("setLoadingError",err.message);
            })
            .finally(() => {
              this.loading = false;
            })

          } else {

            this.$store.dispatch("clearAppResources");
            this.navigateToHome();
            
          }
        }
      }
    }
  },
  created: function(){

    //laod settings saved in local storage
    this.$store.dispatch('loadPersistantSettings');
    
    //Set default time zone for the club
    this.$dayjs.tz.setDefault(this.$store.state.clubtz);
    
  },
  beforeDestroy: function(){
    
  }
}
</script>

<style scoped>

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
{
  /* transform: translateX(10px); */
  opacity: 0;
}

</style>