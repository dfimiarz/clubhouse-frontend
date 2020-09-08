<template>
  <v-app dark>
    <transition name="fade">
      <splashscreen v-if="! loaded" :loading="loading" :error="loadingError"></splashscreen>
      <mainscreen v-else></mainscreen>
    </transition>
  </v-app>
</template>

<script>
import splashscreen from './components/SplashScreen'

export default {
  name: "app",
  components: {
    splashscreen: splashscreen,
    mainscreen: () =>
      import(
        /* webpackPrelaod: true,webpackChunkName: "main" */ "./components/MainScreen"
      ),
  },
  data: () => ({
    drawer: false,
    loaded: false,
    loading: true,
    loadingError: null,
  }),
  created: function () {
    //console.log("Loading app data...")

    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    })
      .then(() => {
        return this.$store.dispatch("loadAppInfo");
      })
      .then(() => {
        //console.log("App data loaded!")
        this.loaded = true;
      })
      .catch((err) => {
        //console.log("Loading error:",err.message)
        this.loadingError = err.message;
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
