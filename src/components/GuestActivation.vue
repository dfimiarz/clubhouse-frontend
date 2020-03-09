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
            <v-item-group multiple="" mendatory="">
              <v-row no-gutters="">
                <v-col cols="6" md="3" v-for="guest in guests" :key="guest.id">
                  <v-card>
                    <v-img src="https://dummyimage.com/50x50/DDD/000000.jpg&text=GUEST"
                    max-height="50" height="50" aspect-ratio="1">

                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-item-group>
          </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
  name: "GuestActivation",
  created: () => {
    //console.log("Created")
  },
  data: function() {
    return {
      guests : [
        { "id":"1","name" : "Daniel Smith", "email" : "dsmith@email.com" },
        { "id":"2","name" : "Daniel Smith", "email" : "dsmith@email.com" },
        { "id":"3","name" : "Daniel Smith", "email" : "dsmith@email.com" },
        { "id":"4","name" : "Daniel Smith", "email" : "dsmith@email.com" }
      ]

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
