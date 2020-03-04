<template>
    <v-container>
        <v-layout justify-center align-start="" row="" wrap="">
          <v-flex xs12>
            Guset info              
          </v-flex>
        </v-layout>
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
