<template>
  <v-app dark>
      <v-fade-transition hide-on-leave>
        <mainscreen v-if="active"></mainscreen>
        <loading-screen v-else :errors="initErrors"></loading-screen>
      </v-fade-transition>
      <v-overlay :value="overlay_visible">
        <v-progress-circular indeterminate size="64" v-if="loading"></v-progress-circular>
        <div class="d-flex flex-column text-h6 black" v-else-if="error">
            <div class="text-center pb-2"> {{ error }} </div>
        </div>
    </v-overlay>
  </v-app>
</template>

<script>

import mainscreen from "./components/MainScreen"
import auth from './firebase';
import api from './services/db'
import LoadingScreen from './components/LoadingScreen.vue';

let unsubAuthListenerFun = null;

export default {
  name: "app",
  components: {
    'mainscreen': mainscreen,
    LoadingScreen
  },
  data: function() {
    return {
      initErrors:{
        geoauth: null,
        userauth: null,
        data: null
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
    authInitilized: function(){
      return this.$store.getters['userstore/isInitialized'];
    },
    overlay_visible: function() {
      return this.loading || this.error;
    },
    active: function () {
      return this.$store.getters["appActive"];
    },
  },
  methods: {
    loadSharedAppData(){
      
      this.$store.dispatch('loadAppResources')
      .then(()=> {
        this.$store.dispatch('setDataLoaded',true)
      })
      .catch(() => {
        this.initErrors["data"] = "Unable to load shared resoruces";
      })
      .finally(() => {
        
      })
    },
    subAuthListener(){

      unsubAuthListenerFun = auth.onAuthStateChanged((user) => {

        if( user ){
          this.$store.dispatch('userstore/setUser',user.email)
        }
        else {
          this.$store.dispatch('userstore/setUser',null)
        }

      },() => {
        this.initErrors["userauth"] = "Error in user init"
      })
    },
    unsubAuthListener(){

      this.$store.dispatch('userstore/resetUserAuthState');
      if( unsubAuthListenerFun && typeof unsubAuthListenerFun === 'function' ){
        unsubAuthListenerFun();
      }
    },
    checkGeoAuth(){
      api.checkGeoAuth()
      .then((result) => {
        this.$store.dispatch('userstore/setGeoAuth',result.data.geoauth);
      })
      .catch(() => {
        this.initErrors["geoauth"] = "Failed to check geoauth."
      })
      .finally(() => {

      })
    }
  },
  watch: {
    connected: {
      handler: function(newval){
        if( newval === true ){
          //console.log("Setup auth and check geo")
          this.subAuthListener();
          this.checkGeoAuth();
        }
        else {
          //console.log("Remove auth and reset geo")
          this.unsubAuthListener();
          this.$store.dispatch('userstore/resetGeoAuthState');
        }
        
      },
      immediate: true
    },
    authInitilized: {
      handler: function(newval){
        console.log("authInitialized changed", newval)
        if( newval ){
          console.log("Loading share app data");
          this.loadSharedAppData();
        } else {
          console.log("Removing shared app data");
          this.$store.dispatch('clearAppResources');
        }
      },
      immediate: true
    }
  },
  created: function(){

    //laod settings saved in local storage
    this.$store.dispatch('loadPersistantSettings');
    
    //Set default time zone for the club
    this.$dayjs.tz.setDefault(this.$store.state.clubtz);
    
  },
  beforeDestroy: function(){
    this.unsubAuthListener();
  }
};
</script>

<style scoped>


</style>
