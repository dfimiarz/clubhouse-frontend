<template>
  <v-app dark>
    <transition name="fade">
      <splashscreen
        v-if="!loaded"
        :loading="loading"
        :error="loadingError"
      ></splashscreen>
      <mainscreen v-else></mainscreen>
    </transition>
  </v-app>
</template>

<script>
import splashscreen from "./components/SplashScreen";
import mainscreen from "./components/MainScreen.vue";

export default {
  name: "app",
  components: {
    splashscreen: splashscreen,
    mainscreen: mainscreen
  },
  data: () => ({
    drawer: false,
    loaded: false,
    loading: false,
    loadingError: null,
  }),
  methods: {
    handleConnectionStatechange: function(){
      const online = window.navigator.onLine;

      if( online ){
        this.$store.commit('SET_CONNECTED',true)
      } else {
        this.$store.commit('SET_CONNECTED',false)
      }
    },
    loadApp() {
      this.loading = true;

      this.$store.dispatch('loadSettings');

      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      })
        .then(() => {
          this.loaded = true;
        })
        .catch((err) => {
          this.loadingError = err.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  computed: {
    initStatus: function () {
      return this.$store.state.initStatus;
    }
  },
  mounted: function () {
    if (this.initStatus === true) {
      this.loadApp();
    } else if (typeof this.initStatus === "string") {
      this.loadingError = this.initStatus;
    } else {
      this.loadingError = "Unable to initilize";
    }
  },
  created: function(){

    this.$dayjs.tz.setDefault(this.$store.state.clubtz);

    window.addEventListener('offline',this.handleConnectionStatechange);
    window.addEventListener('online', this.handleConnectionStatechange);
    
  },
  beforeDestroyed: function(){
    window.removeEventListener('offline',this.handleConnectionStatechange);
    window.removeEventListener('online', this.handleConnectionStatechange);
  }
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
