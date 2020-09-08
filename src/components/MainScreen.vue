<template>
  <div class="d-flex fill-height">
    <v-navigation-drawer temporary fixed v-model="drawer" app>
      <v-list>
        <v-list-item :to="{name: 'home'}" exact>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'calendar'}" exact>
          <v-list-item-action>
            <v-icon>mdi-calendar</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Schedule</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'AdminBooking'}" exact>
          <v-list-item-action>
            <v-icon>mdi-calendar-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Book a court</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{name: 'guestregistration'}" exact>
          <v-list-item-action>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Guests</v-list-item-title>
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
        <v-list-item :to="{name: 'token'}" exact>
          <v-list-item-action>
            <v-icon>mdi-shield-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Manage Access</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app elevate-on-scroll>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>KnickerBocker Field Club</v-toolbar-title>
      <div class="flex-grow-1"></div>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text :to="{name: 'home'}" exact>Home</v-btn>
        <v-btn text :to="{name: 'calendar'}" exact>Schedule</v-btn>
        <v-btn text :to="{name: 'AdminBooking'}" exact>Book a Court</v-btn>
        <v-btn text exact>Help</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-footer app>
      <v-row>
        <v-col cols="12">
          <div class="d-flex justify-space-between">
            <span class="white--text">&copy; 2020</span>
            <span class="white--text">Authorized: OK</span>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style>
</style>