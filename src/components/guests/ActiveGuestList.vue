<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="fill-height">
      <v-col class="fill-height">
        <v-card-title> Current Active Guests </v-card-title>
        <v-card-text>
          <v-sheet v-if="!loaded" :height="containerHeight">
            <v-row>
              <v-col cols="12" md="8">
                <v-skeleton-loader type="list-item-avatar-two-line@6" />
              </v-col>
            </v-row>
          </v-sheet>
          <template v-else>
            <v-sheet v-if="errMessage" :height="containerHeight">
              <v-row justify="center" align="center" class="fill-height">
                <v-col class="text-center">
                  <div class="text-body-1">
                    {{ errMessage }}
                  </div>
                  <v-icon large>
                    {{ alertCircleIcon }}
                  </v-icon>
                </v-col>
              </v-row>
            </v-sheet>
            <v-list
              v-else-if="hasGuests"
              three-line
              subheader
              :height="containerHeight"
              class="overflow-y-auto"
              elevation="2"
            >
              <template v-for="(item, index) in sorted_activations">
                <v-list-item :key="item.id">
                  <v-list-item-avatar>
                    <v-avatar color="green" size="56" class="white--text">
                      {{ item.guest_lastname.charAt(0) }}
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.guest_firstname }}
                      {{ item.guest_lastname }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Activated: {{ item.time_activated }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                      Host: {{ item.host_lastname }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      :disabled="item.has_played"
                      @click="deactivateGuest(index)"
                    >
                      <v-icon>
                        {{ accountMinusIcon }}
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider :key="index" />
              </template>
            </v-list>
            <v-sheet v-else :height="containerHeight">
              <v-row justify="center" align="center" class="fill-height">
                <v-col class="text-center">
                  <div class="text-body-1">No Active Guests</div>
                  <v-icon large>
                    {{ accountOffIcon }}
                  </v-icon>
                </v-col>
              </v-row>
            </v-sheet>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            large
            color="primary"
            :disabled="loading"
            @click="getCurrentActivations"
          >
            Refresh
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dbservice from "./../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";
import {
  mdiReload,
  mdiAccountOff,
  mdiAccountMinus,
  mdiAccount,
  mdiAlertCircle,
} from "@mdi/js";
import { notification } from "../mixins/NotificationMixin";

export default {
  name: "GuestActivation",
  mixins: [notification],
  beforeRouteLeave(to, from, next) {
    this.setLoading(false);
    next();
  },
  props: {
    loading: Boolean,
  },
  data: function () {
    return {
      accountIcon: mdiAccount,
      accountMinusIcon: mdiAccountMinus,
      accountOffIcon: mdiAccountOff,
      reloadIcon: mdiReload,
      alertCircleIcon: mdiAlertCircle,
      containerHeight: 450,
      guest_activations: null,
      loaded: false,
      errMessage: undefined,
    };
  },
  computed: {
    clubtz: function () {
      return this.$store.state.clubtz;
    },
    hasGuests: function () {
      return (
        Array.isArray(this.guest_activations) &&
        this.guest_activations.length != 0
      );
    },
    sorted_activations: function () {
      //Sort activations by guest lastname
      return this.guest_activations.slice().sort((a, b) => {
        var nameA = a.guest_lastname.toUpperCase(); // ignore upper and lowercase
        var nameB = b.guest_lastname.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    },
  },
  created: function () {
    this.getCurrentActivations();
  },
  methods: {
    setLoading(val) {
      this.$emit("update:loading", val);
    },
    deactivateGuest(index) {
      //Get needed info from the sorted_activations array
      const ga_data = (({ id, etag }) => ({ id, etag }))(
        this.sorted_activations[index]
      );

      this.errMessage = undefined;
      this.guest_activations = null;
      this.loaded = false;
      this.setLoading(true);

      this.deactivateAndReload(ga_data)
        .then((res) => {
          this.guest_activations = res.data;
          this.showNotification("Guest records updated", "success");
        })
        .catch((err) => {
          const error = processAxiosError(err);

          this.showNotification(`${error}`, "error");

          this.errMessage = "Error deactivating guest";
        })
        .finally(() => {
          this.loaded = true;
          this.setLoading(false);
        });
    },
    async deactivateAndReload(data) {
      await dbservice.deactivateGuest(data);

      return await dbservice.getCurrentGuestActivations();
    },
    getCurrentActivations: function () {
      this.setLoading(true);
      this.errMessage = undefined;
      this.loaded = false;
      this.guest_activations = null;

      dbservice
        .getCurrentGuestActivations()
        .then((res) => {
          this.guest_activations = res.data;
          this.updated = this.$dayjs(this.date).tz().format("h:mm a");
        })
        .catch((err) => {
          const error = processAxiosError(err);
          this.errMessage = "Unable to load guest list";
          this.showNotification(`${error}`, "error");
        })
        .finally(() => {
          this.loaded = true;
          this.setLoading(false);
        });
    },
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
