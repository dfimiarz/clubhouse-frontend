<template>
  <div>
    <v-card-text>
      <v-container fluid>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="text-caption py-2">
              Please use this form to register a guest visitor. Only
              <span class="font-weight-bold info--text">single</span>
              registration is required. Once in the system, a guest can be
              activated for a particular day through the
              <span class="font-weight-bold">"ACTIVATE"</span> tab.
            </div>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row no-gutters class="pt-4">
                <v-col cols="12" class="subtitle-2">Guest information</v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row no-gutters>
                <v-col cols="12" lg="8">
                  <v-text-field
                    v-model="guest.firstname"
                    label="First Name"
                    :error-messages="errors.firstname"
                    :rules="nameRules"
                    :disabled="!formenabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" lg="8">
                  <v-text-field
                    v-model="guest.lastname"
                    label="Last Name"
                    :error-messages="errors.lastname"
                    :rules="nameRules"
                    :disabled="!formenabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" lg="8">
                  <v-text-field
                    v-model="guest.email"
                    label="E-mail"
                    :error-messages="errors.email"
                    :rules="emailRules"
                    :disabled="!formenabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12" lg="8">
                  <v-text-field
                    v-model="guest.phone"
                    :error-messages="errors.phone"
                    :rules="phoneRules"
                    :disabled="!formenabled"
                    clearable
                  >
                  <template v-slot:label>
                    <div>
                      Phone <small>(optional)</small>
                    </div>
                  </template>
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row dense v-if="!authenticated">
                <v-col cols="12" md="8">
                  <knick-captcha
                    :imgdata="imgdata"
                    :error="errors.requestid"
                    v-on:reload:captcha="getCaptcha"
                  ></knick-captcha>
                </v-col>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="captcha"
                    :rules="captchaRules"
                    label="Captcha Text"
                    :error-messages="errors.captcha"
                    :disabled="!formenabled"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row no-gutters class="pt-4">
                <v-col cols="12" class="subtitle-2">Terms and Conditions</v-col>
              </v-row>
              <v-divider></v-divider>
               <v-row no-gutters>
                <v-col cols="12">
                  <v-checkbox
                    v-model="vaccinated"
                    :rules="checkBoxRules"
                    :disabled="!formenabled"
                    :error-messages="errors.vaccinated"
                  >
                    <template v-slot:label>
                      <div class="caption">
                        I affirm that I have seen proof of vaccination of my guest and take full responsibility for this verification.
                      </div>
                    </template>
                    >
                  </v-checkbox>
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-checkbox
                    v-model="agree"
                    :rules="checkBoxRules"
                    :disabled="!formenabled"
                    :error-messages="errors.agree"
                  >
                    <template v-slot:label>
                      <div class="caption">
                        I have read, understood, and agree to all club rules
                        pertaining to guests visitors
                      </div>
                    </template>
                    >
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="resetForm">Reset</v-btn>
      <v-spacer></v-spacer>
      <v-btn large :disabled="!formenabled" :loading="loading" @click="addGuest">Add Guest</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import dbservice from "../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";
import KnickCaptcha from "../KnickCaptcha.vue";

export default {
  components: { KnickCaptcha },
  props: ["loading"],
  name: "RegisterMember",
  created: function () {
    this.getCaptcha();
  },
  data: function () {
    return {
      imgdata: null,
      captcha: null,
      requestid: null,
      initialized: false,
      valid: true,
      errors: {
        firstname: null,
        lastname: null,
        email: null,
        age: null,
        phone: null,
        captcha: null,
        requestid: null,
        agree: null,
        vaccinated: null
      },
      guest: {
        firstname: null,
        lastname: null,
        email: null,
        phone: null,
      },
      agree: false,
      vaccinated: false,
      captchaRules: [(v) => !!v || "Field is required"],
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
        (v) => (!v || (typeof v === 'string' && v.length >= 10)) || "Phone must be at least 10 characters",
        (v) => (!v || (typeof v === 'string' && v.length <= 24)) || "Content must be at most 24 characters",
      ],
      checkBoxRules: [(v) => !!v || "Agreement required"],
    };
  },
  computed: {
    formenabled: function () {
      return this.authenticated || this.requestid;
    },
    authenticated: function () {
      return this.$store.getters["userstore/isAuthenticated"];
    },
  },
  methods: {
    getCaptcha() {
      //Don't load captcha when authenticated
      if (this.authenticated) {
        return;
      }

      this.setLoading(true);
      this.errors.requestid = null;
      this.requestid = null;
      this.imgdata = null;

      dbservice
        .getCaptcha()
        .then((data) => {
          this.imgdata = data.svg;
          this.requestid = data.reqid;
        })
        .catch((err) => {
          const error = processAxiosError(err);

          if (Object.prototype.hasOwnProperty.call(error, "captchaerr")) {
            this.handleCaptchaError(error.captchaerr);
          } else {
            this.errors.requestid = error;
          }
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    resetForm() {
      this.clearErrors();
      this.$refs.form.reset();
      this.getCaptcha();
    },
    clearErrors() {
      Object.keys(this.errors).forEach((elem) => {
        this.errors[elem] = null;
      });
    },
    handleFieldErrors(errors) {
      
      //Loop through each error and add it to array of error for specific field
      if (Array.isArray(errors)) {
        errors.forEach((element) => {
          
          if ( Object.prototype.hasOwnProperty.call(this.errors, element.param)) {
            this.errors[element.param] = element.msg;
          }
        });
      }
    },
    addGuest: function () {
      this.clearErrors();

      if (!this.$refs.form.validate()) {
        return;
      }

      this.setLoading(true);

      const guestdata = {
        ...this.guest,
        captcha: this.captcha,
        requestid: this.requestid,
        agree: this.agree,
        vaccinated: this.vaccinated
      };

      dbservice
        .addGuest(guestdata)
        .then(() => {
          this.$emit("show:message", "Guest added", "success");
          this.resetForm();
        })
        .catch((err) => {
          const error = processAxiosError(err);

          if (error.fielderrors) {
            this.handleFieldErrors(error.fielderrors);
          } else {
            this.$emit("show:message", "Error: " + error, "error");
          }
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
    setLoading(val) {
      this.$emit("update:loading", val);
    },
    showRules: function () {
      alert("Will show rules");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.errcontainer {
  margin: 10px 0px 10px 0px;
  border: 1px solid;
  color: red;
  font-weight: bold;
  box-sizing: border-box;
}
</style>
