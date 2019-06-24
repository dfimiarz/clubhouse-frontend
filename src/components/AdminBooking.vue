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
                  <v-form ref="timeform">
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-layout>
                        <v-flex xs12 md6>
                          <v-select
                            label="Court"
                            :items="courts"
                            item-value="id"
                            item-text="lbl"
                            :rules="[ rules.required ]"
                          >
                            
                          </v-select>
                        </v-flex>
                      </v-layout>
                      
                    </v-flex>
                    <v-flex xs12 md6>
                       <v-layout>
                        <v-flex xs12>
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
                                v-model="date"
                                label="Date"
                                prepend-icon="event"
                                readonly
                                v-on="on"
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
                            ref="time_dialog"
                            v-model="timedialog"
                            :return-value.sync="time"
                            persistent
                            :allowed-minutes="allowedminutes"
                            lazy
                            full-width
                            width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                v-model="time"
                                label="Start time"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-time-picker
                              v-model="time"
                              class="mt-3"
                            >
                            <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="timedialog = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.time_dialog.save(time)">OK</v-btn>
                            </v-time-picker>
                          </v-dialog>
                        </v-flex>
                       </v-layout>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-text-field
                            ref="bumpablefield"
                            label="Duration"
                            type="number"
                            v-model="duration"
                            :rules="[ rules.required, rules.durationlimit ]"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-checkbox v-model="bumpable" label="Bumpable"></v-checkbox>
                        </v-flex>
                      </v-layout>
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
                    <v-flex xs12>
                      <span class="headline">Confirm Booking</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="body-1">Players:</span>
                    </v-flex>
                    <v-flex xs12 v-for="(player,index) in playerDetails" :key="index">
                       <span class="subheading">{{ index + 1 }} - {{ player.name }} - {{ player.repeater }}</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Start: {{ date }} {{ time }}</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Duration: {{ duration }} min</span>
                    </v-flex>
                    <v-flex xs12 class="my-2">
                      <span class="subheading">Bumpable: {{ bumpable }}</span>
                    </v-flex>
                  </v-layout>
                </v-container>
                
                
                <v-layout>
                  <v-btn flat @click="step = 1">Go back</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
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

import Session from './Session'


export default {
  components:{
    'session' : Session
  },
  name: 'MatchCalendar',
  data: function() {
    return {
        selplayers: [
          { id: undefined, repeater: undefined },
          { id: undefined, repeater: undefined },
          { id: undefined, repeater: undefined },
          { id: undefined, repeater: undefined },
        ],
        step: 0,
        datedialog: false,
        timedialog: false,
        date: null,
        time: null,
        duration: 30,
        bumpable: false,
        rules: {
          required: value => !!value || 'Required.',
          durationlimit: value => value >= 15 || 'Min 15 min',
        }
    }
  },
  methods: {
    allowedminutes: m => m % 5 === 0,
    getPlayerLabel: index => "Player " + (index + 1),
    stepCheck: function(){

      
        

      this.step = 3
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
            
            accumulator.push({ id: player.id, name: member.name, repeater: repeaterDetails.label })
          }

          return accumulator
          
          
        },[])
       
    },
    
  },
  created: function() {
    
  },
  mounted: function(){
    
  },
  beforeDestroy () {
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
