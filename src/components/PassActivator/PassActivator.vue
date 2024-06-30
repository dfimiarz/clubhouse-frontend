<template>
  <v-dialog
    v-model="show"
    :fullscreen="isSmallScreen"
    :max-width="dialogMaxWidth"
    :scrollable="isSmallScreen"
    persistent
  >
    <v-card>
      <v-toolbar v-if="isSmallScreen" class="flex-grow-0">
        <v-btn icon @click="show = false">
          <v-icon>{{ dialogCloseIcon }}</v-icon>
        </v-btn>
        <v-toolbar-title>Guest Pass</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text :disabled="!initlized" @click="activatePass">
            <v-icon left small>{{ cartCheckIcon }}</v-icon>
            Buy
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-title v-else>
        <span class="headline">Guest Pass</span>
      </v-card-title>
      <v-card-text>
        <v-container v-if="!initlized">
          <v-row>
            <v-col cols="12" sm="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-skeleton-loader
                    type="card-heading, list-item-two-line@3, list-item-three-line"
                    :loading="!initlized"
                  ></v-skeleton-loader>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6">
              <v-skeleton-loader
                v-if="!initlized"
                type="card-heading, list-item-two-line@3, list-item-three-line"
                :loading="!initlized"
              >
              </v-skeleton-loader>
            </v-col>
          </v-row>
        </v-container>
        <v-form v-else ref="passForm" autocomplete="off" lazy-validation>
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6">
                <v-row no-gutters>
                  <v-col cols="12" class="text-subtitle-1 py-1">1. Pass</v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="formattedGuest"
                      label="Guest"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="selectedHostId"
                      label="Host"
                      :items="hosts"
                      item-text="name"
                      item-value="id"
                      :rules="notEmpty"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
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
                  <v-col cols="12">
                    <div>
                      <div class="text-caption">Pass Terms</div>

                      <div class="text-subtitle-1">
                        Cost: {{ formattedPrice }}
                      </div>
                      <div class="text-body-2">
                        Valid:
                        {{ selectedPass ? selectedPass.valid : 0 }} day(s).
                        Limit: {{ selectedPass ? selectedPass.limit : 0 }} per
                        season.
                      </div>
                      <div class="text-body-2">
                        Description: One day pass. Expires at midnight of the
                        day of purchase.
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" sm="6">
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
                      item-value="id"
                      :rules="notEmpty"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <component
                      :is="processor"
                      :base-price="passPrice"
                      :fee="fee"
                      :fee-type="feeType"
                      :config="processorConfig"
                      @update:paymentinfo="setPaymentInfo"
                    ></component>
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="confirmed"
                      :rules="checkBoxRules"
                      dense
                    >
                      <template #label>
                        <div class="caption">
                          Host and guest information is correct.
                        </div>
                      </template>
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions v-if="!isSmallScreen">
        <v-btn text @click="show = false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="activatePass">
          <v-icon left>{{ cartCheckIcon }}</v-icon>
          Purchase
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="sbOpen"
      elevation="24"
      outlined
      :color="sbColor"
      :app="!isSmallScreen"
    >
      {{ sbMessage }}

      <template #action="{ attrs }">
        <v-btn text v-bind="attrs" @click="sbOpen = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>

<script>
import apiHandler from "@/services/db";
import processAxiosError from "@/utils/AxiosErrorHandler";
import { notification } from "@/components/mixins/NotificationMixin";
import { mdiCartCheck, mdiClose } from "@mdi/js";
import dbservice from "@/services/db";
import DirectTransferProcessor from "./PaymentProcessors/DirectTransferProcessor.vue";

/**
 * @typedef {import('@/types/guest_passes').PassInfo } PassInfo
 */

export default {
  name: "PassActivator",
  components: {
    DirectTransferProcessor,
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
    sbOpen: false,
    sbMessage: null,
    sbColor: null,
    selectedHostId: null,
    cartCheckIcon: mdiCartCheck,
    dialogCloseIcon: mdiClose,
    passes: [],
    selectedPass: null,
    paymentInfo: null,
    paymentTypes: [],
    selectedProcessor: null,
    notEmpty: [(v) => !!v || "Required"],
    initlized: false,
    checkBoxRules: [(v) => !!v || "Confirmation required"],
    confirmed: false,
  }),
  computed: {
    dialogMaxWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "100%";
        case "sm":
          return "70%";
        case "md":
          return "60%";
        case "lg":
          return "40%";
        default:
          return "50%";
      }
    },
    processor() {
      return this.selectedProcessor
        ? `${this.selectedProcessor.processor}Processor`
        : null;
    },
    fee() {
      return this.selectedProcessor ? this.selectedProcessor.fee : 0;
    },
    passPrice() {
      return this.selectedPass ? this.selectedPass.cost : 0;
    },
    feeType() {
      return this.selectedProcessor ? this.selectedProcessor.fee_type : "FA";
    },
    processorConfig() {
      return this.selectedProcessor
        ? this.selectedProcessor.processor_config
        : null;
    },
    formattedPrice() {
      //Add a $ to price
      return "$" + (this.passPrice / 100).toFixed(2);
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
        .filter((person) => person.guest_host === 1)
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
        this.confirmed = false;

        this.$refs.passForm.resetValidation();
      } else {
        if (this.initlized) {
          this.setupForm();
          return;
        }

        this.init()
          .then((data) => {
            this.passes = data.passes;
            this.paymentTypes = data.paymentTypes;

            this.setupForm();

            this.initlized = true;
          })
          .catch((err) => {
            const error = processAxiosError(err);
            //this.showNotification("Error initializing: " + error, "error");
            this.showMessage("Error initializing:" + error, "error")
          });
      }
    },
  },
  methods: {
    showMessage: function (text, type) {
      this.sbMessage = text;

      switch (type) {
        case "success":
          this.sbColor = "success";
          break;
        case "warning":
          this.sbColor = "warning";
          break;
        case "error":
          this.sbColor = "error";
          break;

        default:
          this.sbColor = null;
          break;
      }

      this.sbOpen = true;
    },
    setupForm() {
      if (this.paymentTypes.length > 0) {
        this.selectedProcessor = this.paymentTypes[0];
      }
      if (this.passes.length > 0) {
        this.selectedPass = this.passes[0];
      }
    },
    async init() {
      const response = await Promise.all([
        dbservice.getGuestPassTypes(),
        dbservice.getPaymentTypes(),
      ]);

      return { passes: response[0].data, paymentTypes: response[1].data };
    },
    setPaymentInfo(info) {
      console.log(info);
      this.paymentInfo = info;
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
        //this.showNotification("Please correct form errors", "error");
        this.showMessage("Please correct form errors", "error");
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
        })
        .catch((err) => {
          const error = processAxiosError(err);
          if (error.fielderrors) {
            this.handleFieldErrors(error.fielderrors);
          } else {
            this.showMessage("Error: " + error, "error");
            //this.showNotification("Error: " + error, "error");
          }
        });
    },
  },
};
</script>

<style scoped></style>
```
