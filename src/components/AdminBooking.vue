<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-content-start="" row wrap>
    <v-flex xs12 sm8 md6 lg4>
     
          <v-stepper v-model="step">
            <v-stepper-header>
              <v-stepper-step :complete="step > 1" step="1">Court and time</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="step > 2" step="2">Players</v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3">Confirm</v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-layout>
                        <v-flex xs12 md6>
                          <v-select
                            label="Court"
                            :items="courts"
                            item-value="id"
                            item-text="lbl"
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
                        <!-- <v-flex xs4> 
                          <v-select
                          label="Hour"
                          :items="startHours"
                          ></v-select>
                        </v-flex>
                        <v-flex xs4>
                          <v-select
                          label="Min"
                          :items="startMinutes"
                          ></v-select>
                        </v-flex>
                        <v-flex xs4>
                          <v-select
                          label="AM/PM"
                          :items="partofday"
                          ></v-select>
                        </v-flex> -->
                      </v-layout>
                    
                    </v-flex>
                    <v-flex xs12>
                      <v-layout wrap>
                        <v-flex xs12 md6>
                          <v-select
                          label="Duration"
                          
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 md6>
                          <v-select
                          label="Bumpable after"
                          
                          ></v-select>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-container>

                <v-btn
                  
                  @click="step = 2"
                >
                  Continue
                </v-btn>

                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card
                  class="mb-5"
                  color="grey lighten-1"
                  height="200px"
                ></v-card>

                <v-btn
                  color="primary"
                  @click="step = 3"
                >
                  Continue
                </v-btn>

                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card
                  class="mb-5"
                  color="grey lighten-1"
                  height="200px"
                ></v-card>

                <v-btn
                  color="primary"
                  @click="step = 1"
                >
                  Continue
                </v-btn>

                <v-btn flat>Cancel</v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <!--
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 md6>
                <v-select
                  label="Court"
                  :items="courts"
                  item-value="id"
                  item-text="lbl"
                >
                  
                </v-select>
              </v-flex>
              <v-flex xs12 md6>
                <v-layout>
                  <v-flex xs4> 
                    <v-select
                    label="Hour"
                    :items="startHours"
                    ></v-select>
                  </v-flex>
                  <v-flex xs4>
                    <v-select
                     label="Min"
                    :items="startMinutes"
                    ></v-select>
                  </v-flex>
                  <v-flex xs4>
                    <v-select
                    label="AM/PM"
                    :items="partofday"
                    ></v-select>
                  </v-flex>
                </v-layout>
               
              </v-flex>
              <v-flex xs12>
                <v-layout wrap>
                  <v-flex xs12 md6>
                    
                  </v-flex>
                  <v-flex xs12 md6>
                   
                  </v-flex>
                </v-layout>
              </v-flex>
              
              <v-flex xs12>
                <v-layout wrap="">
                  <v-flex xs12 md6>
                    <v-autocomplete
                     label="Player 1"
                     :items="players"
                      item-text="name"
                      item-value="id"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
                      :items="repeaterTypes"
                      label="Repeater status:"
                      item-text="label"
                      item-value="id"
                    >
                      
                    </v-select>
                  </v-flex>
                </v-layout>
               
              </v-flex>
              <v-flex xs12>
                <v-layout wrap="">
                  <v-flex xs12 md6>
                    <v-autocomplete
                     label="Player 2"
                     :items="players"
                      item-text="name"
                      item-value="id"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
                      :items="repeaterTypes"
                      label="Repeater status:"
                      item-text="label"
                      item-value="id"
                    >
                    </v-select>
                  </v-flex>
                </v-layout>
               
              </v-flex>
              <v-flex xs12>
                <v-layout wrap="">
                  <v-flex xs12 md6>
                    <v-autocomplete
                     label="Player 3"
                     :items="players"
                      item-text="name"
                      item-value="id"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                   <v-select
                      :items="repeaterTypes"
                      label="Repeater status:"
                      item-text="label"
                      item-value="id"
                    >
                      
                    </v-select>
                  </v-flex>
                </v-layout>
               
              </v-flex>
              <v-flex xs12>
                <v-layout wrap="">
                  <v-flex xs12 md6>
                    <v-autocomplete
                     label="Player 4"
                     :items="players"
                      item-text="name"
                      item-value="id"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
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
          </v-container>
          -->   
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
        partofday: [{val: 0, text:"AM"},{val: 12, text:"PM"}],
        months: [
          { val: 1, text: "Jan"},
          { val: 2, text: "Feb"},
          { val: 3, text: "Mar"},
          { val: 4, text: "Apr"},
          { val: 5, text: "May"},
          { val: 6, text: "Jun"},
          { val: 7, text: "Jul"},
          { val: 8, text: "Aug"},
          { val: 9, text: "Sep"},
          { val: 10, text: "Oct"},
          { val: 11, text: "Nov"},
          { val: 12, text: "Dec"},
        ],
        step: 0,
        datedialog: false,
        timedialog: false,
        date: null,
        time: null
    }
  },
  methods: {
    allowedminutes: m => m % 5 === 0
  },
  computed: {
    courts: function(){
      return this.$store.getters['courtstore/getCourts']
    },
    players: function(){
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
    }
    
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
