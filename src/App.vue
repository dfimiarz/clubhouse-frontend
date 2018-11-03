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
          <v-list-tile :to="{name: 'Home'}" exact="">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="{name: 'MatchCalendar'}">
            <v-list-tile-action>
              <v-icon>schedule</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Schedule</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile :to="{name: 'NewBooking'}" exact="">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>New Booking</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile  :to="{name: 'ManageMembers'}">
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Members</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>dashboard</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Dashboard</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon>settings</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app   >
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>KnickerBocker Field Club</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat :to="{name: 'Home'}" exact>Home</v-btn>
          <v-btn flat :to="{name: 'MatchCalendar'}" exact="">Schedule</v-btn>
          <v-btn flat :to="{name: 'NewBooking'}" exact>Quick book</v-btn>
        </v-toolbar-items>
      </v-toolbar>
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
  })
};
</script>

<style>
</style>
