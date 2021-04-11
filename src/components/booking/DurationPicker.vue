<template>
  <v-dialog
    ref="durdialog_ref"
    v-model="durDialog"
    persistent
    :return-value.sync="duration"
    width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
          v-model="duration"
          label="Duration"
          prepend-icon="mdi-timer"
          readonly
          v-on="on"
          required
          :rules="[rules.required, rules.minduration, rules.lessThanMax]"
          :disabled="! isStartSet"
          suffix="min"
      >
      </v-text-field>
    </template>

    <vnumberpad v-model="duration" :cold="cold">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="durDialog = false">Cancel</v-btn>
        <v-btn
          text
          color="primary"
          @click="$refs.durdialog_ref.save(duration)"
          >OK</v-btn
        >
      </template>
    </vnumberpad></v-dialog
  >
</template>

<script>
import vnumberpad from "./vuetify-numberpad";

export default {
  name: "duration-picker",
  props: {
      value: {
        type:  Number,
        required: true
      },
      startTime: {
        type:  String,
      },
      max: {
          type: Number
      },
      pref: {
          type: Number
      }
  },
  components: {
    vnumberpad,
  },
  data() {
    return {
        durDialog: false,
        rules: {
            required: (value) => !!value || "Required.",
            minduration: (value) => value >= 5 || "Min 5 min",
            lessThanMax: (value) => typeof this.max === 'number' ? value <= this.max || `Max duration ${this.max} min` : true
        },
        cold: true
    }
  },
  methods: {
    computeBestDuration: function(){
      return 
    }
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
    isStartSet: function(){
        return this.startTime !== null;
    }
  },
  watch: {
      durDialog: function(newval){
          if( newval === true ){
              this.cold = true;
          }
      }
  }
};
</script>