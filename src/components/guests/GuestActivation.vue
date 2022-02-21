<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="fill-height">
      <v-col class="fill-height">
        <v-card-text>
          <v-container fluid>
            <div class="text-caption py-2">
              Please enter a host and guest(s) to activate for today. Guest activation
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
          <v-btn text @click="resetForm" :disabled="loading">Clear</v-btn>
          <v-spacer></v-spacer>
          <v-btn large @click="activateAndReload" :disabled="loading || error">Activate</v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
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
      error: false,
      activeMembers: [],
      inactiveguest: []
    };
  },
  beforeRouteLeave(to, from, next) {
    this.setLoading(false);
    next();
  },
  methods: {
    reset() {
      this.selected.splice(0);
    },
    async getMembersAndInactiveGuest(){
      return await Promise.all([dbservice.getActiveMembers(),dbservice.getInactiveGuests()]);
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

      const guestIds = new Set();
      const guestErrors = [];

      this.selectedGuests.forEach((guest,index) => {
        
        if( guest.id !==  null){
          guestIds.has(guest.id) ? guestErrors.push({
              index: index,
              message: "Duplicate Guest",
            })
            : guestIds.add(guest.id);
        }
      })

      if (guestIds.size === 0) {
        this.selectedGuests[0]["errors"].push("Select a guest");
        return false;
      }

      if (guestErrors.length != 0) {
        guestErrors.forEach((error) => {
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
        const results = await this.getMembersAndInactiveGuest()

        this.activeMembers = results[0].data.map((member) => ({
        name:  `${member.firstname} ${member.lastname}`,
        id: member.id
        }));

        this.inactiveguests = results[1].data;

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

    //Load both active members and inactive guests

    this.getMembersAndInactiveGuest()
    .then((results) => {

      this.error = false;

      this.activeMembers = results[0].data.map((member) => ({
        name:  `${member.firstname} ${member.lastname}`,
        id: member.id
        }));

      this.inactiveguests = results[1].data;

    })
    .catch((error) => {
      this.error = true;
      this.$emit("show:message", `${error.message}`, "error");
    })
    .finally(() => {

    })
   
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
