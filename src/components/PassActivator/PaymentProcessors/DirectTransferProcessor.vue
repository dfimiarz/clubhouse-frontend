<template>
  <div>
    <fee-panel
      :base-price="basePrice"
      :base-fee="fee"
      :fee-type="feeType"
    ></fee-panel>
    <v-row v-if="config.message" dense>
      <v-col cols="12" class="text-subtitle-2 warning--text">
        {{ config.message }}
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-checkbox v-model="paid" :rules="checkBoxRules" dense>
          <template #label>
            <div class="caption">The total amount has been paid.</div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import FeePanel from "./FeePanel.vue";

export default {
  name: "DirectTransferProcessor",
  components: {
    FeePanel,
  },
  props: {
    basePrice: {
      type: Number,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    fee: {
      type: [Number, null],
      default: null,
    },
    feeType: {
      type: String,
      validator(value) {
        return ["FA", "PA"].includes(value);
      },
      default: "FA",
    },
  },
  data: () => ({
    paid: false,
    checkBoxRules: [(v) => !!v || "Payment confirmation required"],
  }),
  computed: {
    paymentInfo() {
      return JSON.stringify({
        paid: this.paid,
      });
    },
  },
  watch: {
    paymentInfo(val) {
      this.$emit("update:paymentinfo", val);
    },
  },
};
</script>
