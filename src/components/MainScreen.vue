<template>
  <div class="d-flex fill-height">
    <v-navigation-drawer v-model="drawer" temporary fixed app>
      <v-list>
        <v-list-item
          :to="{ name: 'home' }"
          exact
          :disabled="!canAccess('home')"
        >
          <v-list-item-action>
            <v-icon>{{ homeIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :to="{ name: 'calendar' }"
          exact
          :disabled="!canAccess('calendar')"
        >
          <v-list-item-action>
            <v-icon>{{ calendarIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Schedule</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :to="{ name: 'MatchBooking' }"
          exact
          :disabled="!canAccess('MatchBooking')"
        >
          <v-list-item-action>
            <v-icon>{{ calendarPlusIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Book a court</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :to="{ name: 'guestregistration' }"
          exact
          :disabled="!canAccess('guestregistration')"
        >
          <v-list-item-action>
            <v-icon>{{ accountMultipleIcon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Guests</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          :to="{ name: 'settings' }"
          exact
          :disabled="!canAccess('settings')"
        >
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
        <v-list-item
          v-if="!loggedin"
          :to="{ name: 'login' }"
          exact
          :disabled="!canAccess('login')"
        >
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
      <v-toolbar-title>{{ clubname }}</v-toolbar-title>
      <div class="flex-grow-1" />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text :to="{ name: 'home' }" exact :disabled="!canAccess('home')">
          Home
        </v-btn>
        <v-btn
          text
          :to="{ name: 'calendar' }"
          exact
          :disabled="!canAccess('calendar')"
        >
          Schedule
        </v-btn>
        <v-btn
          text
          :to="{ name: 'MatchBooking' }"
          exact
          :disabled="!canAccess('MatchBooking')"
        >
          Book a Court
        </v-btn>
        <v-btn text exact>Help</v-btn>
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
              <v-btn v-if="user" icon>
                <v-icon>
                  {{ accountIcon }}
                </v-icon>
              </v-btn>
              <v-btn v-else icon :to="{ name: 'login' }">
                <v-icon>
                  {{ accountOffIcon }}
                </v-icon>
              </v-btn>
              <span v-if="user" class="text-caption hidden-xs-only">
                {{ user }}
              </span>
            </div>
            <span>&copy; {{ new Date().getFullYear() }}</span>
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

import { AccessChecker } from "./mixins/AccessCheckerMixin";
import { notification } from "./mixins/NotificationMixin";

export default {
  mixins: [notification, AccessChecker],
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
    clubname: function () {
      return this.$store.state.clubName;
    },
  },
  created() {
    //Set default time zone for the club
    this.$dayjs.tz.setDefault(this.$store.state.clubtz);
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
