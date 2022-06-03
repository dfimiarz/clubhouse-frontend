<template>
  <div class="d-flex fill-height">
    <v-navigation-drawer temporary fixed v-model="drawer" app>
      <v-list>
        <v-list-item :to="{ name: 'home' }" exact>
          <v-list-item-action>
            <v-icon>{{ homeIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'calendar' }" exact>
          <v-list-item-action>
            <v-icon>{{ calendarIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Schedule</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'MatchBooking' }" exact>
          <v-list-item-action>
            <v-icon>{{ calendarPlusIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Book a court</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'guestregistration' }" exact>
          <v-list-item-action>
            <v-icon>{{ accountMultipleIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Guests</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'settings' }" exact>
          <v-list-item-action>
            <v-icon>{{ cogIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>{{ helpIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item :to="{ name: 'login' }" exact v-if="!loggedin">
          <v-list-item-action>
            <v-icon>{{ loginIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else @click="logout">
          <v-list-item-action>
            <v-icon>{{ logoutIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app elevate-on-scroll>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Knickerbocker Field Club</v-toolbar-title>
      <div class="flex-grow-1" />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text :to="{ name: 'home' }" exact> Home </v-btn>
        <v-btn text :to="{ name: 'calendar' }" exact> Schedule </v-btn>
        <v-btn text :to="{ name: 'MatchBooking' }" exact> Book a Court </v-btn>
        <v-btn text exact> Help </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-fade-transition hide-on-leave>
        <router-view />
      </v-fade-transition>
    </v-main>
    <v-footer app>
      <v-row no-gutters>
        <v-col cols="12">
          <div class="d-flex justify-space-between align-center">
            <div class="d-inline mx-1">
              <v-icon v-if="geoAuthenticated" color="success">
                {{ networkIcon }}
              </v-icon>
              <v-icon v-else>
                {{ networkOffOutlineIcon }}
              </v-icon>
              <v-btn icon v-if="user">
                <v-icon>
                  {{ accountIcon }}
                </v-icon>
              </v-btn>
              <v-btn icon v-else :to="{ name: 'login' }">
                <v-icon>
                  {{ accountOffIcon }}
                </v-icon>
              </v-btn>
              <span class="text-caption hidden-xs-only" v-if="user">
                {{ user }}
              </span>
            </div>
            <span> &copy; {{ new Date().getFullYear() }} </span>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import {
  mdiHome,
  mdiCalendar,
  mdiLogin,
  mdiLogout,
  mdiHelp,
  mdiCog,
  mdiCalendarPlus,
  mdiAccountMultiple,
  mdiNetworkOutline,
  mdiNetworkOffOutline,
  mdiAccount,
  mdiAccountOff,
} from "@mdi/js";

import { notification } from "./NotificationMixin";

export default {
  mixins: [notification],
  data() {
    return {
      homeIcon: mdiHome,
      calendarIcon: mdiCalendar,
      calendarPlusIcon: mdiCalendarPlus,
      loginIcon: mdiLogin,
      logoutIcon: mdiLogout,
      helpIcon: mdiHelp,
      cogIcon: mdiCog,
      accountMultipleIcon: mdiAccountMultiple,
      networkIcon: mdiNetworkOutline,
      networkOffOutlineIcon: mdiNetworkOffOutline,
      accountIcon: mdiAccount,
      accountOffIcon: mdiAccountOff,
      drawer: false,
    };
  },
  computed: {
    loading: {
      get: function () {
        return this.$store.state.loading;
      },
      set: function (val) {
        this.$store.dispatch("setLoading", val);
      },
    },
    error: {
      get: function () {
        return this.$store.state.error;
      },
      set: function (val) {
        this.$store.dispatch("setError", val);
      },
    },
    loggedin: function () {
      return !!this.$store.state.userstore.user;
    },
    geoAuthenticated: function () {
      return this.$store.getters["userstore/isGeoAuthenticated"];
    },
    userAuthenticated: function () {
      return this.$store.getters["userstore/isUserAuthenticated"];
    },
    user: function () {
      return this.$store.state.userstore.user;
    },
  },

  methods: {
    logout: function () {
      this.$store
        .dispatch("userstore/logout")
        .then(() => {
          this.showNotification("You are logged out", "success");
        })
        .catch((err) => {
          this.showNotification("Error logging out: " + err.code, "error");
        })
        .finally(() => {
          //Redirect to home
          if (this.$route.name !== "home") {
            this.$router.push({ name: "home" });
          }
        });
    },
  },
};
</script>

<style></style>
