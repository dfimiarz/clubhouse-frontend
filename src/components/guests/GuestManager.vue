<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-img
            class="white--text"
            height="150px"
            :src="getImageSrcByName('GUESTS_COVER')"
            :lazy-src="require(`@/assets/lazyloader.jpg`)"
            gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
            position="top center"
          >
            <v-container class="fill-height" fluid>
              <v-row no-gutters class="fill-height">
                <v-col cols="12" align-self="end">
                  <span class="text-h5">GUEST PLAYERS</span>
                </v-col>
              </v-row>
            </v-container>
            <v-progress-linear v-show="loading" indeterminate absolute bottom />
          </v-img>
          <v-tabs dark>
            <v-tab
              :to="{ name: 'guestregistration' }"
              :disabled="loading"
              exact
            >
              New Guest
            </v-tab>
            <!-- <v-tab :to="{ name: 'guestactivation' }" :disabled="loading" exact>
              Guest Passes
            </v-tab> -->
            <!-- <v-tab :to="{ name: 'activeguests' }" :disabled="loading" exact>
              Show Guests
            </v-tab> -->
          </v-tabs>

          <router-view :loading.sync="loading" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ImageProvider } from '../mixins/ImageProviderMixin';

export default {
  name: "GuestManager",
  mixins: [ImageProvider],
  data: function () {
    return {
      tab: null,
      items: ["add guest", "active guests"],
      drawer: false,
      loading: false,
    };
  },
  computed: {},
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
