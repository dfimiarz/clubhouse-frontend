<template>
  <v-layout fill-height justify-center >
    <v-flex xs12 sm10 md6 lg4>
      <v-layout v-if="loading" fill-height justify-center align-center>
        <v-progress-circular
        :size="70"
        :width="7"
        indeterminate
      ></v-progress-circular>
      </v-layout>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <v-layout v-if="sessioninfo" class="content" row wrap justify-center align-center>
        <v-flex xs12>
          <v-card>
            <v-img
              class="white--text"
              height="200px"
              src="../assets/match.jpg"
              gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
            >
              
              <v-container class="fill-height" fluid="">  
                <v-row no-gutters="" class="fill-height">
                  <v-col cols="12" align-self="start">
                    
                    <v-conainer fluid>
                      <v-row class="mx-1">
                        <div class="flex-grow-1 text-start">
                          <v-btn dark icon :to="{name: 'calendar'}">
                            <v-icon>mdi-chevron-left</v-icon>
                          </v-btn>
                        </div>
                        <div style="Flex-grow:2;"></div>
                        <div class="flex-grow-1 text-end">
                          <v-btn icon>
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </div>
                      </v-row>
                    </v-conainer>
                    
                  </v-col>
                  
                  <v-col cols="12" align-self="end">
                    <span class="display-1 pa-1">Match Details</span>
                  </v-col>
                </v-row>
                
              </v-container>
            </v-img>
            <v-card-text> 
              <v-list two-line>
                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-clock-start</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>09/20/2019 12:30 pm</v-list-item-title>
                    <v-list-item-subtitle>Start</v-list-item-subtitle>
                  </v-list-item-content>

                  
                  
                </v-list-item>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-clock-end</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>09/20/2019 13:30 pm</v-list-item-title>
                    <v-list-item-subtitle>End</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>
                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-tennis</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>1</v-list-item-title>
                    <v-list-item-subtitle>Court</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-close-circle</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Yes</v-list-item-title>
                    <v-list-item-subtitle>Bumpable</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>

                <v-divider inset></v-divider>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-account</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>John Doe</v-list-item-title>
                    <v-list-item-subtitle>Player</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-account</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Marry Pupins</v-list-item-title>
                    <v-list-item-subtitle>Player</v-list-item-subtitle>
                  </v-list-item-content>
                 
                </v-list-item>

                 <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-account</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Marry Pupins 2</v-list-item-title>
                    <v-list-item-subtitle>Player</v-list-item-subtitle>
                  </v-list-item-content>
                  
                </v-list-item>


                <v-list-item >
                 <v-list-item-icon>
                    <v-icon >mdi-account</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>Marry Pupins 3</v-list-item-title>
                    <v-list-item-subtitle>Player</v-list-item-subtitle>
                  </v-list-item-content>
                  
                </v-list-item>

                <v-divider inset></v-divider>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-note</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </v-list-item-content>
                  
                </v-list-item>

              </v-list>
            </v-card-text>
            <v-card-actions class="mx-2">
              <v-btn color="warning" text="" outlined>Cancel</v-btn>
              <div class="flex-grow-1"></div>
              <v-btn large>End</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

import apihandler from './../services/db'

export default {
  props: ['id'],
  name: "sessiondetails",
  data: function() {
    return {
      loading: false,
      error: null,
      sessioninfo: null
    }
  },
  methods:{
    fetchData: function(){
      this.error = this.sessioninfo = null
      this.loading = true

      let that = this

      apihandler.getSessionDetails(this.id).then((val) =>{
        that.sessioninfo = val.data
      })
      .catch(function (error) {

        if (error.response) {
          that.error = error.response.data 
          console.log(error.response.status)
          
        } else if (error.request) {
          that.error = error.request
          //console.log(error.request);
        } else {
          that.error = error.message
          
        }
        
      })
      .finally(()=>{
        this.loading = false
      })
    }
  },
  computed:{
    

  },
  watch:{
    //needed to get new data when route changes
    '$route': 'fetchData'
  },
  created () {
    //fetch data here
    this.fetchData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
