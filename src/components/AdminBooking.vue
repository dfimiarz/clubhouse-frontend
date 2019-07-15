<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-content-start="" row wrap>
    <v-flex xs12 sm8 md6 lg4>
     
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1">Players</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="step > 2" step="2">Court and time</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">Confirm</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="2">
                <v-container grid-list-md>
                  <v-form ref="timeform" lazy>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-layout>
                        <v-flex xs12 md6>
                          <v-select
                            label="Court"
                            :items="courts"
                            item-value="id"
                            item-text="name"
                            required=""
                            :rules="[ rules.required ]"
                            v-model="court"
                          >
                            
                          </v-select>
                        </v-flex>
                      </v-layout>
                      
                    </v-flex>
                    <v-flex xs12>
                       <v-layout>
                        <v-flex xs12 md6>
                          <v-dialog
                            ref="date_dialog"
                            v-model="datedialog"
                            :return-value.sync="date"
                            persistent
                            lazy
                            full-width
                            width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="computedDateFormatted"
                                label="Date"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required=""
                                :rules="[ rules.required ]"
                              ></v-text-field>
                            </template>
                            <v-date-picker v-model="date" scrollable>
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="datedialog = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.date_dialog.save(date)">OK</v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-flex>
                       </v-layout>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-layout>
                        <v-flex xs12>
                          <v-dialog
                            ref="stdialog"
                            v-model="stimedialog"
                            :return-value.sync="s_time"
                            persistent
                            lazy
                            full-width
                            width="290px"
                            
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="s_time"
                                label="Start time"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required=""
                                :rules="[ rules.required ]"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-model="s_time"
                              class="mt-3"
                              format="24hr"
                              :allowed-minutes="allowedminutes"
                              :min="opentime"
                              :max="closetime"
                            >
                            <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="stimedialog = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.stdialog.save(s_time)">OK</v-btn>
                            </v-time-picker>
                          </v-dialog>
                        </v-flex>
                       </v-layout>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-dialog
                            ref="etdialog"
                            v-model="etimedialog"
                            :return-value.sync="e_time"
                            persistent
                            lazy
                            full-width
                            width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="e_time"
                                label="End time"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                                required=""
                                :rules="[ rules.required ]"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-model="e_time"
                              class="mt-3"
                              format="24hr"
                              :allowed-minutes="allowedminutes"
                              :min="s_time"
                              :max="closetime"
                            >
                            <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="etimedialog = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.etdialog.save(e_time)">OK</v-btn>
                            </v-time-picker>
                          </v-dialog>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 md6>
                      <v-checkbox v-model="bumpable" label="Bumpable"></v-checkbox>  
                    </v-flex>
                    <v-flex xs12>
                      <v-textarea
                        v-model="note"
                        label="Note"
                      ></v-textarea>
                    </v-flex>
                   
                  </v-layout>
                  </v-form>
                </v-container>
                <v-layout row>
                  
                    <v-btn flat @click="step = 1">Go back</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn @click="stepCheck(3)">
                      Continue
                    </v-btn>
                   
                </v-layout>
                
              </v-stepper-content>

              <v-stepper-content step="1">
                <v-container fluid="" grid-list-md="">
                  <v-form ref="playerform">
                  <v-layout row wrap>
                    <v-flex xs12 v-for="(player,index) in selplayers" :key="index">
                      <v-layout wrap="">
                        <v-flex xs12 md6>
                          <v-autocomplete
                          v-model="selplayers[index].id"
                          :label="getPlayerLabel(index)"
                          :items="clubmembers"
                          item-text="name"
                          item-value="id"
                          >
                          </v-autocomplete>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-select
                            v-model="selplayers[index].repeater"
                            :items="repeaterTypes"
                            label="Repeater status:"
                            item-text="label"
                            item-value="id"
                          >
                            
                          </v-select>
                        </v-flex>
                      </v-layout>  
                    </v-flex>
                  </v-layout>
                  </v-form>
                </v-container>
                <v-layout row>
                  
                  <v-spacer></v-spacer>
                  <v-btn
                    @click="step = 2"
                  >
                    Continue
                  </v-btn>
                </v-layout>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-container fluid="">
                  <v-layout row wrap>
                    <v-flex xs12 v-if="error">
                      <div class="title red--text py-2">Error: {{ error }}</div>
                    </v-flex>
                    <v-flex xs12>
                      <span class="headline">Confirm Booking</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="body-1">Players:</span>
                    </v-flex>
                    <v-flex xs12 v-for="(player,index) in playerDetails" :key="index">
                       <span class="subheading">{{ index + 1 }} - {{ player.firstname }} {{ player.lastname }} - {{ player.repeater_lbl }}</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Time: {{ date }} {{ s_time }} - {{ e_time }}</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Duration: {{ duration }} min</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Bumpable: {{ bumpable }}</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Note: {{ note }}</span>
                    </v-flex>
                  </v-layout>
                </v-container>
                
                
                <v-layout>
                  <v-btn flat @click="step = 1">Go back</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="loading"
                    :disabled="loading"
                    @click="submitMatch()"
                  >
                    Book
                </v-btn>

                
                </v-layout>
                
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper> 
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>

import apihandler from './../services/db'
import { isNull } from 'util';
import utils from './../services/utils'

export default {
  components:{
  },
  name: 'MatchCalendar',
  data: function() {
    return {
        court: null,
        selplayers: [
          { id: undefined, repeater: undefined },
          { id: undefined, repeater: undefined },
          { id: undefined, repeater: undefined },
          { id: undefined, repeater: undefined },
        ],
        step: 0,
        datedialog: false,
        stimedialog: false,
        etimedialog: false,
        date: null,
        s_time: null,
        e_time: null,
        note: null,
        bumpable: false,
        rules: {
          required: value => !!value || 'Required.',
          durationlimit: value => value >= 15 || 'Min 15 min',
        },
        loading: false,
        error: null
    }
  },
  methods: {
    allowedminutes: m => m % 5 === 0,
    getPlayerLabel: index => "Player " + (index + 1),
    stepCheck: function(nextstep){
      if( nextstep == 3 ){
        if( ! this.$refs.timeform.validate() )
          return false

        if( isNull(this.computedStart) )
          return false

        this.step = 3
      }
    },
    formatDate(date){
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    validate: function(){

        // console.log(this.date, this.s_time)

        // let datepattern = /^(19|20)\d\d([- /.])(0[1-9]|1[012])\2(0[1-9]|[12][0-9]|3[01])$/

        // console.log(datepattern.test(this.date))

        // let d = new Date(this.date)

        return true
    },
    sendData(match){

      this.loading = true
      this.error = null

      let that = this

      apihandler.newMatch(match)
      .then(function (response) {
          console.log(response)
          that.loading = false
          that.$router.push({ name: 'calendar' })
      })
      .catch(function (error) {

          
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          that.error = error.response.data
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
      .finally(() => {
        that.loading = false
      })
    },
    submitMatch: function(){

      if( ! this.validate() )
        return false

      const match = {
          court: this.court,
          bumpable: this.bumpable == true ? 1 : 0,
          starttime: this.date.concat(" ",this.s_time,":00"),
          endtime: this.date.concat(" ",this.e_time,":00"),
          note: this.note,
          players: this.playerInfo
      }

      console.log("Will send ", match)
      this.sendData(match)
      
    }
  },
  computed: {
    courts: function(){
      return this.$store.getters['courtstore/getCourts']
    },
    clubmembers: function(){
      return this.$store.getters['memberstore/clubMembers'] 
    },
    repeaterTypes: function(){
        return this.$store.getters['repeaterTypes']
    },
    startHours: function(){
      return  Array(12).fill().map((_, idx) => 1 + idx)
    },
    startMinutes: function(){
      return  Array(4).fill().map((_, idx) => 0 + idx*15)
    },
    playerDetails: function(){

      return this.selplayers.reduce( (accumulator,player) => {
          

          const member = this.$store.getters['memberstore/getMemberById'](player.id)
          const repeaterDetails = this.$store.getters['getRepeaterType'](player.repeater)

          if( member && repeaterDetails ){
            
            accumulator.push({ id: player.id, firstname: member.firstname, lastname: member.lastname, repeater: player.repeater, repeater_lbl: repeaterDetails.label })
          }

          return accumulator
          
          
        },[])
       
    },
    playerInfo: function(){
      return this.selplayers.reduce( (accumulator,player) => {

          if( player.id && player.repeater ){
            accumulator.push({ id: player.id, repeater: player.repeater })
          }

          return accumulator
          
          
        },[])
    },
    computedDateFormatted () {
      return this.formatDate(this.date)
    },
    opentime(){
      return this.$store.state.opentime
    },
    closetime(){
      return this.$store.state.closetime
    },
    startmin: function(){
      return utils.timetoInt(this.s_time)
    },
    endmin: function(){
      return utils.timetoInt(this.e_time)
    },
    duration: function(){
      return this.endmin - this.startmin 
    }
  },
  created: function() {
    
  },
  mounted: function(){
    
  },
  beforeDestroy () {
   
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>