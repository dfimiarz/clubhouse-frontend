<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12">
        <v-text-field
          v-model="hostEmail"
          label="Host Email"
          :rules="emailRules"
        ></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-row no-gutters justify="end">
          <v-col cols="4">
            <v-text-field
              label="Total"
              value="$10.00"
              readonly
              outlined
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-checkbox v-model="paid" :rules="checkBoxRules">
          <template #label>
            <div class="caption">
              The total amount has been sent to club's Zelle account.
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ZelleProcessor",
  data: () => ({
    hostEmail: "",
    paid: false,
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid",
    ],
    checkBoxRules: [(v) => !!v || "Agreement required"],
  }),
  computed: {
    paymentInfo() {
      return JSON.stringify({
        hostEmail: this.hostEmail,
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
