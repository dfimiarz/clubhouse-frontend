<template>
  <div>
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          v-model="hostEmail"
          label="Host's Email"
          :rules="emailRules"
          hint="Verify the host's email address"
          persistent-hint
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <div class="text-caption text-right">
          Pass: {{ basePriceFormatted }}
        </div>
        <div class="text-caption text-right">
          Processing Fee: {{ feeFormatted }}
        </div>
      </v-col>
      <v-col cols="12">
        <div class="py-2 text-h6 text-right">
          <span>Total:&nbsp;</span>
          <span class="warning--text">{{ totalFormatted }}</span>
        </div>
      </v-col>
      <v-col cols="12">
        <v-checkbox v-model="paid" :rules="checkBoxRules">
          <template #label>
            <div class="caption">
              The total amount has been placed in the cash box.
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "CashProcessor",
  props: {
    basePrice: {
      type: Number,
      required: true,
    },
    fee: {
      type: [Number, null],
      default: null,
    },
  },
  data: () => ({
    hostEmail: "",
    paid: false,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid",
    ],
    checkBoxRules: [(v) => !!v || "Payment confirmation required"],
  }),
  computed: {
    paymentInfo() {
      return JSON.stringify({
        hostEmail: this.hostEmail,
        paid: this.paid,
      });
    },
    total: function () {
      return this.basePrice + this.fee;
    },
    totalFormatted: function () {
      return "$" + this.total.toFixed(2);
    },
    feeFormatted: function () {
      //Add a $ to fee if it exists
      if (this.fee) {
        return "$" + this.fee.toFixed(2);
      } else {
        return "$0.00";
      }
    },
    basePriceFormatted: function () {
      return "$" + this.basePrice.toFixed(2);
    },
  },
  watch: {
    paymentInfo(val) {
      this.$emit("update:paymentinfo", val);
    },
  },
};
</script>
