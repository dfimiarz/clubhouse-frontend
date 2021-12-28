<template>
  <div>
    <v-card-text>
      <v-container fluid>
        <div class="text-caption py-2">
          Please enter host and guest(s) to activate for today. Guest activation
          must be repeated each day a guest utilizes club venues.
        </div>
        <v-form ref="guestsform">
          <v-row no-gutters>
            <v-col cols="12" md="8">
              <v-autocomplete
                v-model="host"
                label="Select Host"
                :items="activeMembers"
                item-text="name"
                item-value="id"
                :rules="[rules.notempty]"
                :error-messages="hosterrors"
                no-data-text="No active members found"
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" class="subtitle-2">Guests</v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <v-col
              cols="12"
              md="8"
              v-for="(guest, index) in selectedGuests"
              :key="index"
            >
              <v-autocomplete
                v-model="guest.id"
                :label="getGuestLabel(index + 1)"
                :items="inactiveguests"
                item-text="name"
                item-value="id"
                :error-messages="guest.errors"
                no-data-text="No inactive guests found"
                :disabled="loading"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn outlined @click="resetForm">Clear</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="activateAndReload" :disabled="loading">Activate</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import dbservice from "./../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";

export default {
  props: ["loading"],
  name: "GuestActivation",
  data: function () {
    return {
      selectedGuests: [
        { id: null, errors: [] },
        { id: null, errors: [] },
        { id: null, errors: [] },
        { id: null, errors: [] },
      ],
      guests: [],
      host: null,
      hosterrors: [],
      inactiveguests: [],
      rules: {
        notempty: (v) => !!v || "Please select a host",
      },
    };
  },
  beforeRouteEnter(to,from, next){
    next((vm) => {
      vm.$store.getters["userstore/isAuthenticated"] ? next() : next({ name: 'login' })
    });
  },
  beforeRouteLeave(to, from, next) {
    this.setLoading(false);
    next();
  },
  methods: {
    reset() {
      this.selected.splice(0);
    },
    getInactiveGuests() {
      this.inactiveguests.splice(0);
      this.setLoading(true);

      dbservice
        .getInactiveGuests()
        .then((result) => {
          this.inactiveguests = result.data;
        })
        .catch((err) => {
          const error = processAxiosError(err);
          this.$emit(
            "show:message",
            `Unable to load guests: ${error}`,
            "error"
          );
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    validateForm() {
      let hostValid = this.validateHost();
      let guestsValid = this.validateGuests();

      return !(hostValid && guestsValid) ? false : true;
    },
    validateHost() {
      this.hosterrors.splice(0);

      if (!this.host) {
        this.hosterrors.push("Please select a host");
        return false;
      }

      return true;
    },

    validateGuests() {
      this.clearGuestErrors();

      let guestCheck = this.selectedGuests.reduce(
        (accumulator, guest, index) => {
          if (guest.id !== null) {
            accumulator["guests"].indexOf(guest.id) != -1
              ? accumulator["errors"].push({
                  index: index,
                  message: "Duplicate Guest",
                })
              : accumulator["guests"].push(guest.id);
          }

          return accumulator;
        },
        { guests: [], errors: [] }
      );

      if (guestCheck.guests.length === 0) {
        this.selectedGuests[0]["errors"].push("Select a guest");
        return false;
      }

      if (guestCheck.errors.length != 0) {
        guestCheck.errors.forEach((error) => {
          let index = error.index;
          let msg = error.message;

          this.selectedGuests[index]["errors"].push(msg);
        });

        return false;
      }

      return true;
    },
    clearGuestErrors() {
      this.selectedGuests.forEach((guestslot) => {
        guestslot.errors.splice(0);
      });
    },
    activateAndReload() {
      if (!this.validateForm()) {
        return;
      }

      this.setLoading(true);

      this.activateGuests()
        .then(() => {
          this.$emit("show:message", `Guests activated`, "success");
          this.resetForm();
        })
        .catch((error) => {
          this.$emit("show:message", `${error.message}`, "error");
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    async activateGuests() {
      const host_id = this.host;
      const guest_array = this.selectedGuests.reduce((acc, guest) => {
        if (guest.id) {
          acc.push(guest.id);
        }
        return acc;
      }, []);

      try {
        await dbservice.activateGuests(host_id, guest_array);
      } catch (err) {
        const error = processAxiosError(err);
        throw new Error(`${error}`);
      }

      try {
        const result = await Promise.all([
          dbservice.getInactiveGuests(),
          //TO DO: load only new list of active guests no the entire list
          this.$store.dispatch("memberstore/loadEligiblePersons"),
        ]);

        this.inactiveguests = result[0].data;
      } catch (err) {
        const error = processAxiosError(err);
        throw new Error(
          `Unable to reload data: ${error}. Contact club admin if error persists`
        );
      }
    },
    getGuestLabel: (index) => `Guest #${index}`,
    resetForm() {
      this.selectedGuests.forEach((element) => {
        element.id = null;
        element.errors.splice(0);
      });

      this.host = null;
      this.hosterrors.splice(0);

      this.$refs.guestsform.resetValidation();
    },
    setLoading(val) {
      this.$emit("update:loading", val);
    },
  },
  computed: {
    guestcount: function () {
      return this.guests.length;
    },
    clubmembers: function () {
      return this.$store.getters["memberstore/clubMembers"];
    },
    activeMembers: function () {
      return this.$store.getters["memberstore/getActiveMembers"];
    },
    selGuestList: function () {
      return this.selectedGuets.reduce((acc, curr) => {
        if (curr.id) {
          acc.push(curr.id);
        }
        return acc;
      }, []);
    },
  },
  created: function () {
    this.getInactiveGuests();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
