<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-img
            class="white--text"
            height="150px"
            :src="require(`@/assets/guestsbg.jpg`)"
            :lazy-src="require(`@/assets/guestsbg_small.jpg`)"
            gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
          >
            <v-container class="fill-height" fluid>
              <v-row no-gutters class="fill-height">
                <v-col cols="12" align-self="end">
                  <span class="text-h5">Guest Players</span>
                </v-col>
              </v-row>
            </v-container>
            <v-progress-linear indeterminate v-show="loading" absolute bottom />
          </v-img>
          <v-tabs dark>
            <v-tab
              :to="{ name: 'guestregistration' }"
              :disabled="loading"
              exact
            >
              Register
            </v-tab>
            <v-tab :to="{ name: 'guestactivation' }" :disabled="loading" exact>
              Activate
            </v-tab>
            <v-tab :to="{ name: 'activeguests' }" :disabled="loading" exact>
              List
            </v-tab>
          </v-tabs>

          <router-view :loading.sync="loading" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "GuestManager",
  data: function () {
    return {
      tab: null,
      items: ["add guest", "active guests"],
      drawer: false,
      loading: false,
    };
  },
  methods: {},
  computed: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
