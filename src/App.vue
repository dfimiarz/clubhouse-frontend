<template>
  <v-app dark>
    <transition name="slide-fade" mode="out-in">
      <loading-screen v-if="!active" />
      <mainscreen v-else />
    </transition>
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <v-snackbar
      v-model="sbvis"
      elevation="24"
      :app="this.active"
      outlined
      :color="sbcolor"
    >
      {{ sbmsg }}

      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="sbvis = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import mainscreen from "./components/MainScreen";
import LoadingScreen from "./components/LoadingScreen.vue";

export default {
  name: "App",
  components: {
    mainscreen: mainscreen,
    LoadingScreen,
  },
  data: function () {
    return {
      initErrors: {
        geo_err: null,
        user_err: null,
        shared_err: null,
        targetRouteName: null,
      },
      sbvis: false,
      sbmsg: null,
      sbcolor: null,
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
    connected: function () {
      return this.$store.state.connected;
    },
    overlay_visible: function () {
      return this.loading || this.error;
    },
    active: function () {
      return this.$store.getters["appActive"];
    },
    userAuthenticated: function () {
      return this.$store.getters["userstore/isUserAuthenticated"];
    },
    authenticated: function () {
      return this.$store.getters["userstore/isAuthenticated"];
    },
    isAppInitializing: function () {
      return this.$store.state.initializing;
    },
    notification: function () {
      return this.$store.state.notificationstore.notification;
    },
  },
  methods: {
    navigateToHome: function () {
      if (this.$route.name !== "home") {
        this.$router.push({ name: "home" });
      }
    },
    showMessage: function (text, type) {
      console.log("showing message", text, type);

      this.sbmsg = text;

      switch (type) {
        case "success":
          this.sbcolor = "success";
          break;
        case "warning":
          this.sbcolor = "warning";
          break;
        case "error":
          this.sbcolor = "error";
          break;

        default:
          this.sbcolor = null;
          break;
      }

      this.sbvis = true;
    },
  },
  watch: {
    connected: {
      handler: function (newval) {
        if (newval === true) {
          if (!this.active) {
            this.$store
              .dispatch("initializeApplication")
              .then(() => {})
              .catch((err) => {
                this.$store.dispatch("setLoadingError", err.message);
              })
              .finally(() => {});
          }
        } else {
          this.$store.dispatch("resetApplicationState");
        }
      },
    },
    userAuthenticated: {
      handler: function (newval) {
        //App active and user logged in
        if (this.active && newval) {
          this.loading = true;

          this.$store
            .dispatch("loadAppResources")
            .then(() => {
              this.navigateToHome();
            })
            .catch((err) => {
              this.$store.dispatch("setLoadingError", err.message);
            })
            .finally(() => {
              this.loading = false;
            });
        }
      },
    },
    authenticated: {
      handler: function (newval) {
        //App is active and no longer authenticated
        if (this.active && !newval) {
          this.$store.dispatch("clearAppResources");
          this.navigateToHome();
        }
      },
    },
    sbvis: function (newval) {
      if (!newval) {
        this.sbmsg = null;
        this.$store.dispatch("notificationstore/removeNotification");
      }
    },
    notification: function (notification) {
      if (notification) {
        this.showMessage(notification.text, notification.type);
      }
    },
  },
  created: function () {
    //laod settings saved in local storage
    this.$store.dispatch("loadPersistantSettings");

    //Set default time zone for the club
    this.$dayjs.tz.setDefault(this.$store.state.clubtz);
  },
  beforeDestroy: function () {},
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  /* transform: translateX(10px); */
  opacity: 0;
}
</style>
