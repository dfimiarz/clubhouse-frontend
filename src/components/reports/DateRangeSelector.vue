<template>
  <v-dialog
    ref="dialog"
    v-model="showdialog"
    :return-value.sync="loc_dates"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        :value="dateRangeText"
        label="Date range"
        :prepend-icon="calendarIcon"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="loc_dates" scrollable range>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="showdialog = false">Cancel</v-btn>
      <v-btn text color="primary" @click="saveAndClose">OK</v-btn>
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
      default: () => [],
    },
  },
  data: () => ({
    loc_dates: [],
    calendarIcon: mdiCalendar,
  }),
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
      const formatedDates = this.dates.map((date) =>
        this.$dayjs(date).tz().format("MMM DD, YYYY")
      );
      return formatedDates.join(" - ");
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
};
</script>

<style></style>
