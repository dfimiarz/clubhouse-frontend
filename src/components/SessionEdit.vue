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

      <v-layout v-if="notfound" fill-height justify-center align-center>
        <span class="display-1">Not found</span>
      </v-layout>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <v-layout v-if="sessioninfo" class="content" row wrap fill-height="" justify-center align-center>
        <v-flex xs12>
          <v-card>
            <v-img
              class="white--text"
              height="200px"
              :src="require('@/assets/match.jpg')"
              :lazy-src="require('@/assets/match_small.jpg')"
              gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
            >
              
              <v-container class="fill-height" fluid="">  
                <v-row no-gutters="" class="fill-height">
                  <v-col cols="12" align-self="start">
                    
                    <v-container fluid>
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
                    </v-container>
                    
                  </v-col>
                  
                  <v-col cols="12" align-self="end">
                    <span class="display-1 pa-1">Modify session</span>
                  </v-col>
                </v-row>
                
              </v-container>
            </v-img>
            <v-card-text> 
              <v-list two-line>
                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-calendar-range</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ sessioninfo.date | formatDate }}</v-list-item-title>
                    <v-list-item-subtitle>Date</v-list-item-subtitle>
                  </v-list-item-content>

                  
                  
                </v-list-item>
                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-clock-start</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ starttime | formatTime }}</v-list-item-title>
                    <v-list-item-subtitle>Start</v-list-item-subtitle>
                  </v-list-item-content>

                  
                  
                </v-list-item>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-clock-end</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ endtime | formatTime }}</v-list-item-title>
                    <v-list-item-subtitle>End</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>
                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-tennis</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ sessioninfo.court }}</v-list-item-title>
                    <v-list-item-subtitle>Court</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-close-circle</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ sessioninfo.bumpable ? 'Yes' : 'No' }}</v-list-item-title>
                    <v-list-item-subtitle>Bumpable</v-list-item-subtitle>
                  </v-list-item-content>

                  
                </v-list-item>

                <v-divider inset></v-divider>

                <v-list-item v-for="player in sessioninfo.players" :key="player.id" >
                  <v-list-item-icon>
                    <v-icon >mdi-account</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ player.firstname }} {{ player.lastname}}</v-list-item-title>
                    <v-list-item-subtitle> {{ player.type }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider inset></v-divider>

                <v-list-item >
                  <v-list-item-icon>
                    <v-icon >mdi-note</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ sessioninfo.note }}</v-list-item-title>
                    <v-list-item-subtitle> Note</v-list-item-subtitle>
                  </v-list-item-content>
                  
                </v-list-item>

              </v-list>
            </v-card-text>
            <v-card-actions class="mx-2">
              <v-btn color="warning" text="" @click="canceldialog = true" outlined v-show="canRemove">Remove Session</v-btn>
              <div class="flex-grow-1"></div>
              <v-btn large @click="enddialog = true" v-show="canEnd">End session</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog
      v-model="canceldialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Remove Session</v-card-title>

        <v-card-text>
          <div>Are you sure you wish to <span class="red--text font-weight-bold"> REMOVE </span> this session from club schedule?</div>
        </v-card-text>

        <v-card-actions>
          

          <v-btn
            
            text
            @click="canceldialog = false"
          >
            No
          </v-btn>

          <div class="flex-grow-1"></div>

          <v-btn
            color="warning"
            text
            @click="removeSession"
          >
            Yes, REMOVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="enddialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">End session?</v-card-title>

        <v-card-text>
          Are you sure you wish to end this session
        </v-card-text>

        <v-card-actions>
          

          <v-btn
            color="primary"
            text
            @click="enddialog = false"
          >
            No
          </v-btn>

          <div class="flex-grow-1"></div>

          <v-btn
            color="warning"
            text
            @click="endSession"
          >
            End now
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

import apihandler from './../services/db'
import moment from 'moment'

export default {
  props: ['id'],
  name: "sessiondetails",
  data: function() {
    return {
      currentTime: null,
      loading: false,
      error: null,
      sessioninfo: null,
      notfound: false,
      canceldialog: false,
      enddialog: false
    }
  },
  methods:{
    removeSession: function(){
      
      this.error = null
      this.loading = true

      var params = {
        id: this.sessioninfo.id,
        hash: this.sessioninfo.updated
      }

      apihandler.removeSession(params).then(() => {
        this.$router.push({name: 'calendar'})
      })
      .catch((error) => {

        if (error.response) {
          this.error = error.response.data 
          console.log(error.response.status)
          
        } else if (error.request) {
          this.error = error.request
          //console.log(error.request);
        } else {
          this.error = error.message
          
        }
        
      })
      .finally(()=>{
        this.loading = false
      })
    },
    endSession: function(){
      this.error = null
      this.loading = true

      var params = {
        id: this.sessioninfo.id,
        hash: this.sessioninfo.updated
      }

      

      apihandler.endSession(params).then(() => {
        this.$router.push({name: 'calendar'})
      })
      .catch((error) => {

        if (error.response) {
          this.error = error.response.data 
          console.log(error.response.status)
          
        } else if (error.request) {
          this.error = error.request
          //console.log(error.request);
        } else {
          this.error = error.message
          
        }
        
      })
      .finally(()=>{
        this.loading = false
      })
    },

    fetchData: function(){
      this.error = this.sessioninfo = null
      this.loading = true
      this.notfound = false

      apihandler.getSessionDetails(this.id).then((val) =>{
        
        if( val.data != null )
          this.sessioninfo = val.data
        else
          this.notfound = true
      })
      .catch((error) => {

        if (error.response) {
          this.error = error.response.data 
          console.log(error.response.status)
          
        } else if (error.request) {
          this.error = error.request
          //console.log(error.request);
        } else {
          this.error = error.message
          
        }
        
      })
      .finally(()=>{
        this.loading = false
      })
    }
  },
  filters: {
    formatTime: function(timestring){
      if( ! timestring ) return 'N/A'
      return moment(timestring).format('h:mm a')
    },
    formatDate: function(timestring){
      if( ! timestring ) return 'N/A'
      return moment(timestring).format('MMM Do, Y')
    }
  },
  computed:{
    starttime: function(){
      return new Date(this.sessioninfo.date.concat('T',this.sessioninfo.start))
    },
    endtime: function(){
      return new Date(this.sessioninfo.date.concat('T',this.sessioninfo.end))
    },
    canEnd: function(){
      return this.sessioninfo.hasOwnProperty('permissions')    ?
              (Array.isArray(this.sessioninfo.permissions)      ? 
              this.sessioninfo.permissions.includes('CAN_END') : false) : false
    },
    canRemove: function(){
      return this.sessioninfo.hasOwnProperty('permissions')       ?
              (Array.isArray(this.sessioninfo.permissions)         ? 
              this.sessioninfo.permissions.includes('CAN_REMOVE') : false) : false
    }
  },
  watch:{
    //needed to get new data when route changes
    '$route': 'fetchData'
  },
  created () {
    //fetch data here
    this.fetchData()

    this.currentTime = new Date('2019-10-18T15:00:00')

  },
  destroyed (){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
