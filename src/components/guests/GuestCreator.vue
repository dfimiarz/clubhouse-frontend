<template>
  <v-container fluid>
    <div class="text-caption py-2">
      Please use this form to register a guest visitor. Only
      <span
        class="font-weight-bold info--text"
      >single</span> registration is required. Once in the system, a guest can be activated for a particular day through the
      <span
        class="font-weight-bold"
      >"ACTIVATE"</span> tab.
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
            label="First name"
            :error-messages="errors.firstname"
            :rules="nameRules"
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
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="8">
          <v-text-field
            v-model="guest.phone"
            label="Phone"
            :error-messages="errors.phone"
            :rules="phoneRules"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row no-gutters class="pt-4">
        <v-col cols="12" class="subtitle-2">Terms and Conditions</v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutters>
        <v-col cols="12">
          <v-checkbox v-model="agree" :rules="checkBoxRules">
            <template v-slot:label>
              <div class="caption">
                I have read, understood, and agree to all club
                <v-chip color="primary" x-small @click.stop.prevent="showRules">rules</v-chip>&nbsp;pertaining to guests visitors
              </div>
            </template>
            >
          </v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex justify-space-between">
          <v-btn color="warning" outlined @click="resetForm">Reset</v-btn>
          <v-btn :disabled="loading" @click="addGuest">Add Guest</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import dbservice from "../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";

export default {
  props: ["loading"],
  name: "RegisterMember",
  created: () => {
    //console.log("Created")
  },
  data: function () {
    return {
      valid: true,
      errors: {
        firstname: null,
        lastname: null,
        email: null,
        age: null,
        phone: null,
      },
      guest: {
        firstname: null,
        lastname: null,
        email: null,
        phone: null,
      },
      agree: false,
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
        (v) => !!v || "Phone is required",
        (v) => (v && v.length >= 10) || "Phone must be at least 10 characters",
        (v) => (v && v.length <= 24) || "Content must be at most 24 characters",
      ],
      checkBoxRules: [(v) => !!v || "Agreement required"],
    };
  },
  methods: {
    resetForm() {
      Object.keys(this.errors).forEach((elem) => {
        this.errors[elem] = null;
      });
      this.$refs.form.reset();
    },
    handleFieldErrors({ errors }) {
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
      this.$emit("show:message", "Please fix field errors", "error");
    },
    addGuest: function () {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.setLoading(true);

      dbservice
        .addGuest(this.guest)
        .then(() => {
          this.$emit("show:message", "Guest added", "success");
          this.resetForm();
        })
        .catch((err) => {
          const error = processAxiosError(err);
          if (Object.prototype.hasOwnProperty.call(error, "fielderrors")) {
            this.handleFieldErrors(error.fielderrors);
          } else {
            this.$emit("show:message", error, "error");
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
