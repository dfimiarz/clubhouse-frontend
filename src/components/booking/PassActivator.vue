<template>
  <v-dialog v-model="show" max-width="290" persistent>
    <v-card>
      <v-card-title class="text-h6"> Guest Pass Activation </v-card-title>
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
              <v-autocomplete
                label="Host"
                v-model="selectedHostId"
                :items="hosts"
                item-text="name"
                item-value="id"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Pass Type"
                value="One Day Pass"
                editable="false"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="close" text> Close </v-btn>
        <v-spacer></v-spacer>
        <v-btn> Activate </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ROLE_TYPES } from "@/constants/constants.js";

export default {
  name: "pass-activator",
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
        .filter(
          (person) =>
            person.role_type_id === ROLE_TYPES.MEMBER_TYPE ||
            person.role_type_id === ROLE_TYPES.MANAGER_TYPE
        )
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
      //this.selectedHostId = null;
      this.show = false;
    },
  },
};
</script>
