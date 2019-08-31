<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        temporary=""
        fixed=""
        v-model="drawer"
        app
      >
        <v-list>
          <v-list-item :to="{name: 'Home'}" exact="">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{name: 'calendar'}" exact="">
            <v-list-item-action>
              <v-icon>schedule</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Schedule</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item :to="{name: 'QuickBooking'}" exact="">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Book a court</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item  :to="{name: 'ManageMembers'}">
            <v-list-item-action>
              <v-icon>people</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Members</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-icon>dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-icon>settings</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar app   >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>KnickerBocker Field Club</v-toolbar-title>
        <div class="flex-grow-1"></div>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn text :to="{name: 'Home'}" exact>Home</v-btn>
          <v-btn text :to="{name: 'calendar'}" exact="">Schedule</v-btn>
          <v-btn text="" :to="{name: 'AdminBooking'}" exact>Book a Court</v-btn>
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
    </v-app>
    
  </div>
</template>

<script>
export default {
  name: "app",
  data: () => ({
    drawer: false
  }),
  created: function(){
    console.log("Loading main app")
    this.$store.dispatch('loadAppInfo')
  }
};
</script>

<style>
</style>
