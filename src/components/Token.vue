<template>
  <v-container fluid>
    <v-row justify="center" no-gutters>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card outlined>
          <v-card-subtitle>Manage Access Token</v-card-subtitle>
          <v-card-text>
            <v-text-field dense label="Token" outlined append-icon="mdi-lock" v-model="token"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn text small color="warning">Request</v-btn>
            <v-btn text small color="error" @click="clearToken">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="addToken">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "token",
  data: function () {
    return {
      token: null,
    };
  },
  methods: {
    addToken() {
      if (!this.token) {
        return false;
      }

      this.$store
        .dispatch("saveToken", this.token)
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch(() => {
          //console.log(err);
        });
    },
    clearToken() {
      this.$store
        .dispatch("clearToken")
        .then(() => {
          //console.log("Cleared");
        })
        .catch(() => {
          //console.log(err);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
