<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" no-gutters="">
      <v-col cols="12" md="6" lg="4">
        <v-card outlined="">
          <v-card-subtitle>Manage Access Token</v-card-subtitle>
          <v-card-text>
            <v-text-field dense=""
              label="Token"
              outlined=""
              append-icon="mdi-lock"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn text small color="warning"> Request New </v-btn>
            <v-spacer></v-spacer>
            <v-btn> Add </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "token",
  data: function() {
    return {

    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
