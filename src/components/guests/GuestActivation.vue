<template>
  <v-container fluid>
    <div
      class="text-caption py-2"
    >Please enter host and guest(s) to activate for today. Guest activation must be repeated each day a guest utilizes club venues.</div>
    <v-form ref="guestsform">
      <v-row no-gutters>
        <v-col cols="12" md="8">
          <v-autocomplete
            v-model="host"
            label="Select Host"
            :items="activeMembers"
            item-text="name"
            item-value="id"
            :rules="[ rules.notempty]"
            :error-messages="hosterrors"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" class="subtitle-2">Guests</v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" md="8" v-for="(guest,index) in selectedGuests" :key="index">
          <v-autocomplete
            v-model="guest.id"
            :label="getGuestLabel(index+1)"
            :items="inactiveguests"
            item-text="name"
            item-value="id"
            :error-messages="guest.errors"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <v-btn outlined @click="resetForm" color="warning">Clear</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="activateGuests">Activate</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import dbservice from "./../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";

export default {
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
      loading: false,
      host: null,
      hosterrors: [],
      inactiveguests: [],
      rules: {
        notempty: (v) => !!v || "Please select a host",
      },
    };
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
    activateGuests() {
      if (!this.validateForm()) {
        return;
      }

      const host_id = this.host;
      const guests = this.selectedGuests.reduce((acc, guest) => {
        if (guest.id) {
          acc.push(guest.id);
        }
        return acc;
      }, []);

      this.setLoading(true);

      console.log(host_id);
      console.log(guests);

      dbservice
        .activateGuests()
        .then(() => {
          this.$emit("show:message", `Guests activated.`, "success");
        })
        .catch((err) => {
          const error = processAxiosError(err);
          this.$emit(
            "show:message",
            `Unable to activate guests: ${error}`,
            "error"
          );
        })
        .finally(() => {
          this.setLoading(false);
        });
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
