<template>
  <v-dialog
    ref="durdialog_ref"
    v-model="durDialog"
    persistent
    :return-value.sync="duration"
    width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="duration"
        label="Duration"
        :prepend-icon="timerIcon"
        readonly
        required
        :rules="[rules.required, rules.minduration, rules.lessThanMax]"
        :disabled="!isStartSet"
        :loading="loading"
        suffix="min"
        v-on="on"
      >
      </v-text-field>
    </template>

    <vnumberpad v-model="duration" :cold="cold">
      <template #actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="durDialog = false">Cancel</v-btn>
        <v-btn text color="primary" @click="$refs.durdialog_ref.save(duration)"
          >OK</v-btn
        >
      </template>
    </vnumberpad></v-dialog
  >
</template>

<script>
import vnumberpad from "./vuetify-numberpad";

import { mdiTimer } from "@mdi/js";

export default {
  name: "DurationPicker",
  components: {
    vnumberpad,
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    startTime: {
      type: String,
    },
    max: {
      type: Number,
    },
    pref: {
      type: Number,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timerIcon: mdiTimer,
      durDialog: false,
      rules: {
        required: (value) => !!value || "Required.",
        minduration: (value) => value >= 5 || "Min 5 min",
        lessThanMax: (value) =>
          typeof this.max === "number"
            ? value <= this.max || `Max duration ${this.max} min`
            : true,
      },
      cold: true,
    };
  },
  computed: {
    duration: {
      get: function () {
        return this.value;
      },
      set: function (newVal) {
        this.cold = false;
        this.$emit("input", newVal);
      },
    },
    isStartSet: function () {
      return this.startTime !== null;
    },
  },
  watch: {
    durDialog: function (newval) {
      if (newval === true) {
        this.cold = true;
      }
    },
  },
  methods: {
    computeBestDuration: function () {
      return;
    },
  },
};
</script>
