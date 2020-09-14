<template>
  <v-row no-gutters>
    <v-col cols="12" v-if="loaded">
      <div v-if="Array.isArray(guest_activations) && guest_activations.length != 0 ">
        <v-row dense>
          <v-col cols="12">
            <div class="d-flex align-center">
              <span class="subtitle-2">Last Update: {{ updated }}</span>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="getCurrentActivations" :loading="loading" small>Refresh</v-btn>
            </div>
          </v-col>
          <v-col cols="12">
            <v-list two-line :disabled="loading">
              <v-list-item v-for="(activation, i) in guest_activations" :key="i">
                <v-list-item-avatar>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="activation.guest"></v-list-item-title>
                  <v-list-item-subtitle>Host: {{ activation.member }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </div>
      <div v-else>No current active guests</div>
    </v-col>
    <v-col cols="12" v-else>
      <v-row no-gutters style="height: calc(100vh - 380px);" justify="center" align="center">
        <v-col cols="12" class="text-center subtitle-1">Loading ...</v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import dbservice from "./../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";
import moment from 'moment-timezone'

export default {
  props: ['loading'],
  name: "GuestActivation",
  data: function () {
    return {
      guest_activations: null,
      loaded: false,
      updated: "N/A"
    };
  },
  methods: {
    setLoading(val) {
      this.$emit("update:loading", val);
    },
    getCurrentActivations: function () {
      this.setLoading(true);

      dbservice
        .getCurrentGuestActivations()
        .then((res) => {
          this.guest_activations = res.data;
          this.loaded = true;
          this.updated = moment().format('h:mm a')
        })
        .catch((err) => {
          const error = processAxiosError(err);
          this.$emit("show:message", `${error}`, "error");
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
  },
  computed: {},
  created: function () {
    this.getCurrentActivations();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
