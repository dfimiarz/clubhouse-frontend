<template>
    <v-container fluid="">
        <div class="py-2"> Please enter a host's email to find guest(s) to activate.</div>
        <v-row no-gutters="">
          <v-col cols="12" lg="10">
            <v-row justify="center" align="center" no-gutters="">
              
                <v-text-field
                  label="Host's e-mail"
                ></v-text-field>
              
                <v-btn icon> <v-icon> mdi-account-search </v-icon> </v-btn>
              
            </v-row>           
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
          </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
  name: "RegisterMember",
  created: () => {
    //console.log("Created")
  },
  data: function() {
    return {
    }
  },
  methods: {
    addNewMember: function() {
      //console.log(this.newMember);
      this.$store.dispatch("memberstore/REGISTER_MEMBER", this.newMember);
    }
  },
  computed: {
    error: function() {
      return this.$store.getters.error;
    },
    loading: function() {
      return this.$store.getters.loading;
    }
  }
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
