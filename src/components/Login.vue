<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align-sm="end">
      <v-col cols="12" sm="6" md="3" xl="2">
        <v-card rounded="" raised>
          <v-card-subtitle>Log in</v-card-subtitle>
          <v-card-text>
            <v-form ref="form" v-model="formvalid">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-img :src="require(`@/assets/clublogo.png`)" />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    label="E-mail"
                    :rules="[rules.required, rules.isEmail]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="password"
                    label="Password"
                    :append-icon="showpassword ? eyeIcon : eyeOffIcon"
                    :type="showpassword ? 'text' : 'password'"
                    :rules="[rules.required, rules.min]"
                    counter=""
                    hint="Minimum 8 characters"
                    @click:append="showpassword = !showpassword"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn large block @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//import fbErrHandler from "@/utils/FirebaseErrorHandler";

import { mdiEye, mdiEyeOff } from "@mdi/js";
import { notification } from "./mixins/NotificationMixin";

export default {
  name: "LoginPage",
  mixins: [notification],
  data: function () {
    return {
      eyeIcon: mdiEye,
      eyeOffIcon: mdiEyeOff,
      email: null,
      password: null,
      showpassword: false,
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) =>
          (typeof v === "string" && v.length >= 8) || "Min 8 characters",
        isEmail: (v) => /.+@.+/.test(v) || "E-mail must be valid",
      },
      formvalid: false,
    };
  },
  methods: {
    login: function () {
      if (!this.$refs.form.validate()) {
        return false;
      }

      this.$store
        .dispatch("userstore/login", {
          login: this.email,
          password: this.password,
        })
        .then(() => {
          this.showNotification("You are logged in", "success");
        })
        .catch((err) => {
          this.showNotification(err.message, "error");
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
