<template>
  <v-dialog v-model="show" max-width="290" persistent>
    <v-card>
      <v-card-title class="text-h6">Guest Pass Activation</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                label="Guest"
                :value="formattedGuest"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Pass Type"
                value="One Day Pass"
                editable="false"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model="selectedHostId"
                label="Host"
                :items="hosts"
                item-text="name"
                item-value="id"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="rememberHost"
                dense
                label="Remember Host"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="close">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="activatePass">Activate</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import apiHandler from "@/services/db";
import processAxiosError from "@/utils/AxiosErrorHandler";
import { notification } from "@/components/mixins/NotificationMixin";

/**
 * @typedef {import('@/types/guest_passes').PassInfo } PassInfo
 */

export default {
  name: "PassActivator",
  mixins: [notification],
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    persons: {
      type: Array,
      required: true,
    },
    guestId: {
      type: [Number, null],
      default: null,
    },
  },
  data: () => ({
    selectedHostId: null,
    rememberHost: true,
  }),
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    hosts() {
      return this.persons
        .filter((person) => person.can_host === 1)
        .map((person) => ({
          id: person.id,
          name: person.firstname + " " + person.lastname,
        }));
    },
    guest() {
      return this.persons.find((person) => person.id === this.guestId);
    },
    formattedGuest() {
      return this.guest
        ? this.guest.firstname + " " + this.guest.lastname
        : null;
    },
  },
  methods: {
    close() {
      if (!this.rememberHost) {
        this.selectedHostId = null;
      }

      this.show = false;
    },
    handleFieldErrors(errors) {
      //Loop through each error and add it to array of error for specific field
      if (Array.isArray(errors)) {
        errors.forEach((element) => {
          if (
            Object.prototype.hasOwnProperty.call(this.errors, element.param)
          ) {
            this.errors[element.param] = element.msg;
          }
        });
      }
    },
    activatePass() {
      apiHandler
        .createGuestPass({
          host: this.selectedHostId,
          guest: this.guestId,
          pass_type: 1000,
        })
        .then((res) => {
          this.$emit("passactivated", {
            guestId: this.guestId,
            pass: res.data,
          });
          this.close();
        })
        .catch((err) => {
          const error = processAxiosError(err);
          if (error.fielderrors) {
            this.handleFieldErrors(error.fielderrors);
          } else {
            this.showNotification("Error: " + error, "error");
          }
        });
    },
  },
};
</script>
