<template>
  <v-dialog
    v-model="show"
    width="auto"
    :max-width="isSmallScreen ? 290 : 580"
    persistent
  >
    <v-card>
      <v-card-title class="text-h6">Guest Pass Purchase</v-card-title>
      <v-card-text>
        <v-form ref="passForm" autocomplete="off" lazy-validation>
          <v-container fluid>
            <v-row dense>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12" class="text-subtitle-1 py-1">1. Pass</v-col>

                  <v-col cols="10">
                    <v-text-field
                      v-model="formattedGuest"
                      label="Guest"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="10">
                    <v-autocomplete
                      v-model="selectedHostId"
                      label="Host"
                      :items="hosts"
                      item-text="name"
                      item-value="id"
                      :rules="notEmpty"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="10">
                    <v-select
                      v-model="selectedPass"
                      label="Pass Type"
                      :items="passes"
                      item-text="label"
                      item-value="id"
                      return-object
                      :rules="notEmpty"
                    ></v-select>
                  </v-col>
                  <v-col cols="10">
                    <div>
                      <div class="text-caption">Pass Details</div>
                      <div class="text-subtitle-1">
                        Price: {{ formattedPrice }}
                      </div>
                      <span class="text-caption">
                        Valid:
                        {{ selectedPass ? selectedPass.valid : 0 }} day(s),
                        Season Limit:
                        {{ selectedPass ? selectedPass.limit : 0 }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12" class="text-subtitle-1 py-1">
                    2. Payment
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="selectedProcessor"
                      label="Payment Method"
                      :items="paymentTypes"
                      item-text="name"
                      item-value="processor"
                      :rules="notEmpty"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <component
                      :is="
                        selectedProcessor ? selectedProcessor.processor : null
                      "
                      :base-price="passPrice"
                      :fee="transactionFees"
                      @update:paymentinfo="setPaymentInfo"
                    ></component>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="close">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="activatePass">
          <v-icon left>{{ cartCheckIcon }}</v-icon>
          Purchase
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import apiHandler from "@/services/db";
import processAxiosError from "@/utils/AxiosErrorHandler";
import { notification } from "@/components/mixins/NotificationMixin";
import { mdiCartCheck } from "@mdi/js";
import dbservice from "@/services/db";

/**
 * @typedef {import('@/types/guest_passes').PassInfo } PassInfo
 */

export default {
  name: "PassActivator",
  components: {
    CashProcessor: () => import("./PaymentProcessors/CashProcessor.vue"),
    ZelleProcessor: () => import("./PaymentProcessors/ZelleProcessor.vue"),
  },
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
    cartCheckIcon: mdiCartCheck,
    passes: [],
    selectedPass: null,
    paymentInfo: null,
    paymentTypes: [
      { id: 1, name: "Cash", processor: "CashProcessor", fee: 0.0 },
      { id: 2, name: "Zelle", processor: "ZelleProcessor", fee: 0.0 },
    ],
    selectedProcessor: null,
    notEmpty: [(v) => !!v || "Required"],
    initlized: false,
  }),
  computed: {
    transactionFees() {
      return this.selectedProcessor ? this.selectedProcessor.fee : 0;
    },
    passPrice() {
      return this.selectedPass ? this.selectedPass.cost / 100 : 0;
    },
    formattedPrice() {
      //Add a $ to price
      return "$ " + this.passPrice.toFixed(2);
    },
    isSmallScreen: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
        default:
          return false;
      }
    },
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
  watch: {
    show(val) {
      if (!val) {
        this.selectedHostId = null;
        this.selectedPass = null;
        this.selectedProcessor = null;

        this.$refs.passForm.resetValidation();
      } else {
        if (this.initlized) {
          this.setupForm();
          return;
        }

        this.init()
          .then((data) => {
            this.passes = data;

            this.setupForm();

            this.initlized = true;
          })
          .catch((err) => {
            const error = processAxiosError(err);
            this.showNotification("Error initializing: " + error, "error");
          });
      }
    },
  },
  methods: {
    setupForm() {
      if (this.paymentTypes.length > 0) {
        this.selectedProcessor = this.paymentTypes[0];
      }
      if (this.passes.length > 0) {
        this.selectedPass = this.passes[0];
      }
    },
    async init() {
      const response = await dbservice.getGuestPassTypes();

      return response.data;
    },
    setPaymentInfo(info) {
      console.log(info);
      this.paymentInfo = info;
    },
    close() {
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
      if (this.$refs.passForm.validate() === false) {
        return;
      }

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

<style scoped></style>
```
