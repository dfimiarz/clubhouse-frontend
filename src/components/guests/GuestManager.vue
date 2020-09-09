<template>
  <v-container>
    <v-row no-gutters dense justify="center">
      <v-col cols="12" sm="8" xl="4">
        <v-card class="mx-auto">
          <v-img
            class="white--text align-end"
            height="150px"
            :src="require(`@/assets/guestsbg.jpg`)"
            :lazy-src="require(`@/assets/guestsbg_small.jpg`)"
            gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
          >
            <v-card-title>Guest Players</v-card-title>
            <v-progress-linear indeterminate v-show="loading" absolute bottom></v-progress-linear>
          </v-img>
          <v-tabs dark>
            <v-tab :to="{ 'name':'guestregistration'}" exact>Register</v-tab>
            <v-tab :to="{ 'name':'guestactivation'}" exact>Activate</v-tab>
          </v-tabs>
          <v-card-text>
            <router-view :loading.sync="loading" @show:message="showSnackBar"></router-view>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="snackbar.open" top>
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn :color="snackbar.color" text v-bind="attrs" @click="snackbar.open = false">Close</v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GusetManager",
  data: function () {
    return {
      tab: null,
      items: ["add guest", "active guests"],
      drawer: false,
      loading: false,
      snackbar: {
        text: null,
        open: false,
        color: null,
      },
    };
  },
  methods: {
    showSnackBar(text, color) {
      this.snackbar.open = true;
      this.snackbar.text = text;
      this.snackbar.color = color;
    },
  },
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
