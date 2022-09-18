<template>
  <v-dialog
    ref="dialog"
    v-model="showdialog"
    :return-value.sync="loc_dates"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="dateRangeText"
        label="Report date range"
        :prepend-icon="calendarIcon"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="loc_dates" scrollable range>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="showdialog = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="saveAndClose"> OK </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
import { mdiCalendar } from "@mdi/js";

export default {
  props: {
    show: {
      type: Boolean,
    },
    dates: {
      type: Array,
    },
  },
  data: () => ({
    loc_dates: [],
    calendarIcon: mdiCalendar,
  }),
  methods: {
    loadDates: function () {
      this.loc_dates = this.dates;
    },
    clearDates: function () {
      this.loc_dates = [];
    },
    saveAndClose() {
      this.$emit("update:dates", this.loc_dates);
      this.showdialog = false;
    },
  },
  computed: {
    showdialog: {
      get: function () {
        return this.show;
      },
      set: function (newval) {
        this.$emit("update:show", newval);
      },
    },
    dateRangeText() {
      return !!this.dates ? this.dates.join(" ~ ") : null;
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.loadDates();
      } else {
        this.clearDates();
      }
    },
  },
};
</script>

<style></style>
