<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="fill-height">
      <v-col class="fill-height">
        <v-card-text>
          <v-container fluid>
            <v-row no-gutters>
              <v-col cols="12">
                <div class="text-caption py-2">
                  <div class="pt-1">
                    Please use this form to register a new guest visitor. Only
                    <span class="font-weight-bold warning--text">SINGLE</span>
                    guest registration is required per guest.
                  </div>
                </div>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row no-gutters class="pt-4">
                    <v-col cols="12" class="subtitle-2">
                      Guest information
                    </v-col>
                  </v-row>
                  <v-divider />
                  <v-row no-gutters>
                    <v-col cols="12" lg="8">
                      <v-text-field
                        v-model="guest.firstname"
                        label="First Name"
                        :error-messages="errors.firstname"
                        :rules="nameRules"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" lg="8">
                      <v-text-field
                        v-model="guest.lastname"
                        label="Last Name"
                        :error-messages="errors.lastname"
                        :rules="nameRules"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" lg="8">
                      <v-text-field
                        v-model="guest.email"
                        label="E-mail"
                        :error-messages="errors.email"
                        :rules="emailRules"
                      />
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="12" lg="8">
                      <v-text-field
                        v-model="guest.phone"
                        :error-messages="errors.phone"
                        :rules="phoneRules"
                        clearable
                      >
                        <template #label>
                          <div>
                            Phone
                            <small>(optional)</small>
                          </div>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row dense>
                    <v-col cols="12" class="subtitle-2">
                      Terms and Conditions
                    </v-col>
                  </v-row>
                  <v-divider />
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-checkbox
                        v-model="agreement"
                        :rules="checkBoxRules"
                        :error-messages="errors.agreement"
                      >
                        <template #label>
                          <div class="caption">
                            I have read, understood, and agree to all club rules
                            pertaining to guests visitors
                          </div>
                        </template>
                        >
                      </v-checkbox>
                    </v-col>
                  </v-row>
                  <v-row v-if="!authenticated" dense>
                    <v-col cols="12" lg="8">
                      <vue-hcaptcha
                        ref="hcaptcha"
                        :key="hCaptchaSize"
                        :sitekey="hcaptcha.sitekey"
                        theme="dark"
                        :size="hCaptchaSize"
                        @verify="onVerify"
                        @expired="onExpire"
                        @challenge-expired="onExpire"
                        @error="onError"
                        @reset="onCaptchaReset"
                      ></vue-hcaptcha>
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <div style="min-height: 14px">
                        <div
                          v-if="errors.hcaptcha"
                          style="line-height: 12px"
                          class="text-caption error--text"
                        >
                          {{ errors.hcaptcha }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="resetForm">Reset</v-btn>
          <v-spacer />
          <v-btn large color="primary" :loading="loading" @click="addGuest">
            <v-icon left>
              {{ addAccountIcon }}
            </v-icon>
            Register
          </v-btn>
        </v-card-actions>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dbservice from "../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";
// import KnickCaptcha from "../KnickCaptcha.vue";
import { mdiAccountPlus } from "@mdi/js";

import { notification } from "@/components/mixins/NotificationMixin";

import VueHcaptcha from "@hcaptcha/vue-hcaptcha";

export default {
  name: "RegisterMember",
  components: { VueHcaptcha },
  mixins: [notification],
  props: {
    loading: Boolean,
  },
  data: function () {
    return {
      hcaptcha: {
        sitekey: process.env.VUE_APP_HCAPTCHA_SITEKEY,
        verified: false,
        expired: false,
        token: null,
        eKey: null,
      },
      addAccountIcon: mdiAccountPlus,
      valid: true,
      errors: {
        firstname: null,
        lastname: null,
        email: null,
        age: null,
        phone: null,
        agreement: null,
        hcaptcha: null,
      },
      guest: {
        firstname: null,
        lastname: null,
        email: null,
        phone: null,
      },
      agreement: false,
      nameRules: [
        (v) => !!v || "Field is required",
        (v) => (v && v.length >= 2) || "Content must be more than 3 characters",
        (v) =>
          (v && v.length <= 64) || "Content must be less than 64 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid",
      ],
      phoneRules: [
        (v) =>
          !v ||
          (typeof v === "string" && v.length >= 10) ||
          "Phone must be at least 10 characters",
        (v) =>
          !v ||
          (typeof v === "string" && v.length <= 24) ||
          "Content must be at most 24 characters",
      ],
      checkBoxRules: [(v) => !!v || "Agreement required"],
    };
  },
  computed: {
    authenticated: function () {
      return this.$store.getters["userstore/isAuthenticated"];
    },
    hCaptchaSize: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
        case "sm":
          return "compact";
        default:
          return "normal";
      }
    },
  },
  watch: {
    hCaptchaSize: function () {
      this.onCaptchaReset();
    },
  },
  methods: {
    onExpire() {
      this.hcaptcha.verified = false;
      this.hcaptcha.token = null;
      this.hcaptcha.eKey = null;
      this.hcaptcha.expired = true;
      this.errors.hcaptcha = "hCaptcha challange expired";
    },
    onChallengeExpire() {
      this.hcaptcha.verified = false;
      this.hcaptcha.token = null;
      this.hcaptcha.eKey = null;
      this.errors.hcaptcha = "hCaptcha challange expired";
    },
    onError(err) {
      this.hcaptcha.token = null;
      this.hcaptcha.eKey = null;
      this.errors.hcaptcha = err;
    },
    onVerify(token, ekey) {
      this.hcaptcha.verified = true;
      this.hcaptcha.token = token;
      this.hcaptcha.eKey = ekey;
      this.errors.hcaptcha = null;
    },
    onCaptchaReset() {
      this.hcaptcha.verified = false;
      this.hcaptcha.token = null;
      this.hcaptcha.eKey = null;
      this.errors.hcaptcha = null;
    },
    resetForm() {
      this.clearErrors();
      this.$refs.form.reset();

      if (this.$refs.hcaptcha) {
        this.$refs.hcaptcha.reset();
      }
    },
    clearErrors() {
      Object.keys(this.errors).forEach((elem) => {
        this.errors[elem] = null;
      });
    },
    isFormValid() {
      //Create errors array
      let formValid = true;

      if (!(this.hcaptcha.verified || this.authenticated)) {
        this.errors.hcaptcha = "Please complete hCaptcha";
        formValid = false;
      }

      if (!this.$refs.form.validate()) {
        formValid = false;
      }

      return formValid;
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
    addGuest: function () {
      this.clearErrors();

      if (!this.isFormValid()) {
        return false;
      }

      this.completeRegistration();
    },
    completeRegistration() {
      this.setLoading(true);

      const guestdata = {
        ...this.guest,
        hcaptcha: this.hcaptcha.token,
        agreement: this.agreement,
      };

      dbservice
        .addGuest(guestdata)
        .then(() => {
          this.showNotification("Guest added", "success");
          this.resetForm();
          return true;
        })
        .catch((err) => {
          const error = processAxiosError(err);

          //Reset captcha if it exists
          if (this.$refs.hcaptcha) {
            this.$refs.hcaptcha.reset();
          }

          if (error.fielderrors) {
            this.handleFieldErrors(error.fielderrors);
          } else {
            this.showNotification("Error: " + error, "error");
          }
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    setLoading(val) {
      this.$emit("update:loading", val);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
