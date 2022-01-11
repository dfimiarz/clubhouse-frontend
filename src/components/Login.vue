<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align-sm="end">
      <v-col cols="12" sm="6" md="4" xl="2">
        <v-card>
          <v-card-subtitle>Log in</v-card-subtitle>
          <v-card-text>
            <v-form v-model="formvalid" ref="form">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-img :src="require(`@/assets/clublogo.png`)"></v-img>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="[rules.required, rules.isEmail]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password"
                    v-model="password"
                    :append-icon="showpassword ? eyeIcon : eyeOffIcon"
                    :type="showpassword ? 'text' : 'password'"
                    :rules="[rules.required, rules.min]"
                    @click:append="showpassword = !showpassword"
                    counter=""
                    hint="Minimum 8 characters"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn text @click="$refs.form.reset()">Clear</v-btn>
            <v-spacer></v-spacer> -->
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
        .catch((err) => {
          this.$emit("show:message", err.message);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
