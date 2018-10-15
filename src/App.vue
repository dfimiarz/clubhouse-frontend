<template>
  <div id="app">
    <v-app dark>
      <v-navigation-drawer
        fixed
        temporary
        v-model="drawer"
        app
      >
        <v-list dense>
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
      <v-toolbar app fixed clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>KnickerBocker Field Club</v-toolbar-title>
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
