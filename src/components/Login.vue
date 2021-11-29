<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card>
          <v-card-subtitle>Log in</v-card-subtitle>
          <v-card-text>
            <v-form v-model="formvalid" ref="form">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-text-field
                    label="Email"
                    outlined
                    v-model="email"
                    :rules="[rules.required, rules.isEmail]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password"
                    outlined
                    v-model="password"
                    :append-icon="showpassword ? eyeIcon : eyeOffIcon"
                    :type="showpassword ? 'text' : 'password'"
                    :rules="[rules.required, rules.min]"
                    @click:append="showpassword = !showpassword"
                    counter=""
                    hint="At least 8 characters"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn text small @click="$refs.form.reset()">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="login">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import fbErrHandler from "@/utils/FirebaseErrorHandler";

import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  name: "login",
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
          this.$router.push({ name: "home" });
        })
        .catch((err) => {
          this.$emit("show:message", fbErrHandler(err));
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
