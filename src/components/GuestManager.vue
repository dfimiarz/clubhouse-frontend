<template>
    <v-container>
         <v-row no-gutters="" dense="" justify="center">
           <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            
            <v-card
              class="mx-auto"
              
            >
              <v-img
                class="white--text align-end"
                height="150px"
                :src="require(`@/assets/guestsbg.jpg`)"
                :lazy-src="require(`@/assets/guestsbg_small.jpg`)"
                gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
              >
                <v-card-title>Manage Guest Players</v-card-title>
              </v-img>
              <v-tabs
                  
                  dark
                  
                  
              >
                  <v-tab :to="{ 'name':'guestregistration'}" exact="">
                  Register
                  </v-tab>
                  <v-tab :to="{ 'name':'guestactivation'}" exact="">
                  Activate
                  </v-tab>
                  
              </v-tabs>
              <v-card-text>
              <router-view></router-view>
              </v-card-text>
            </v-card>
            
             
            </v-col>
         </v-row>
    </v-container>
</template>

<script>
export default {
  name: "GusetManager",
  data: function() {
    return {
        tab: null,
        items: [
          'add guest','active guests'
        ],
        drawer: false
    };
  },
  methods: {

  },
  computed: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
