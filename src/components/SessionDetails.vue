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
              src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
            >
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">Session Details</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
            <v-card-text> 
              <div>
                Sesssion Details
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="orange">Share</v-btn>
              <v-btn color="orange">Explore</v-btn>
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
        that.sessioninfo = val
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
