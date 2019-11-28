<template>
  
  
  <div>
    <v-app dark>
      <transition name="fade">
      <splashscreen v-if="! loaded" :loading="loading" :error="loadingError"></splashscreen>
      <div v-else>
        <v-navigation-drawer
          temporary=""
          fixed=""
          v-model="drawer"
          app
        >
          <v-list>
            <v-list-item :to="{name: 'Home'}" exact="">
              <v-list-item-action>
                <v-icon>mdi-home</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'calendar'}" exact="">
              <v-list-item-action>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Schedule</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{name: 'AdminBooking'}" exact="">
              <v-list-item-action>
                <v-icon>mdi-calendar-plus</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Book a court</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item  :to="{name: 'ManageMembers'}">
              <v-list-item-action>
                <v-icon>mdi-account-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Members</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-settings</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-action>
                <v-icon>mdi-help</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Help</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-app-bar app elevate-on-scroll   >
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>KnickerBocker Field Club</v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn text :to="{name: 'Home'}" exact>Home</v-btn>
            <v-btn text :to="{name: 'calendar'}" exact="">Schedule</v-btn>
            <v-btn text="" :to="{name: 'AdminBooking'}" exact>Book a Court</v-btn>
            <v-btn text exact>Help</v-btn>
          </v-toolbar-items>
        </v-app-bar>
        <v-content>
        <router-view></router-view>
        </v-content>
        <v-footer app>
          <v-layout>
            <v-flex sm6>
              <span class="white--text">&copy; 2018</span>
            </v-flex>
          </v-layout>
        </v-footer>
      </div>
      </transition>
    </v-app>
    
  </div>
</template>

<script>

//import splashscreen from './components/SplashScreen'

export default {
  name: "app",
  components:{
    splashscreen: () => import(/* webpackPrelaod: true,webpackChunkName: "splashscreen" */ './components/SplashScreen')
  },
  data: () => ({
    drawer: false,
    loaded: false,
    loading: true,
    loadingError: null
  }),
  created: function(){

    //console.log("Loading app data...")

    new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      },500)
    })
    .then(() => {
      return this.$store.dispatch('loadAppInfo')
    })
    .then(() => { 
      //console.log("App data loaded!")
      this.loaded = true
     })
    .catch((err) => { 
      //console.log("Loading error:",err.message)
      this.loadingError = err.message 
    })
    .finally(() => {
      this.loading = false;
    }) 

  }
};
</script>

<style scoped>

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.25s ease-out;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
