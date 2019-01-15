<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-content-start="" row wrap>
    <v-flex xs12 sm8 md6 lg4>
      <v-card>
        <v-card-title>
          <span class="headline">Add a session:</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  label="Court"
                  :items="courts"
                  item-value="id"
                  item-text="lbl"
                >
                  
                </v-select>
              </v-flex>
              <v-flex xs12>
                <v-layout wrap>
                  <v-flex xs6>
                    <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu2"
                    :nudge-right="40"
                    :return-value.sync="time"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                      <v-text-field
                        slot="activator"
                        v-model="time"
                        label="Select start time"
                        prepend-icon="access_time"
                        readonly
                      ></v-text-field>
                      <v-time-picker
                        v-if="menu2"
                        v-model="time"
                        full-width
                        @change="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex xs6>
                    <v-menu
                      ref="menu2"
                      :close-on-content-click="false"
                      v-model="menu3"
                      :nudge-right="40"
                      :return-value.sync="time"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      max-width="290px"
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="endtime"
                        label="Select end time"
                        prepend-icon="access_time"
                        readonly
                      ></v-text-field>
                      <v-time-picker
                        v-if="menu3"
                        v-model="endtime"
                        full-width
                        @change="$refs.menu.save(time)"
                      ></v-time-picker>
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-flex>
              
              <v-flex xs12>
                <v-layout wrap="">
                  <v-flex xs12 md6>
                    <v-autocomplete
                     label="Player 1"
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
                    label="Repeater"
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
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
                    label="Repeater"
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
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
                    label="Repeater"
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
                    >
                    </v-autocomplete>
                  </v-flex>
                  <v-flex xs12 md6>
                    <v-select
                    label="Repeater"
                    >
                      
                    </v-select>
                  </v-flex>
                </v-layout>
               
              </v-flex>
                
            </v-layout>
          </v-container>    
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat :to="{name: 'MatchCalendar'}">Close</v-btn>
          <v-btn flat >Save</v-btn>
        </v-card-actions>
      </v-card>
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
      message: "This is grid view",
      milTimeLabels: [ '12', '1' , '2', '3', '4' , '5' , '6' , '7' , '8', '9' , '10' , '11', '12' , '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ],
      civTimeLabels: [ '12 am', '1 am' , '2 am', '3 am', '4 am' , '5 am' , '6 am' , '7 am' , '8 am', '9 am' , '10 am' , '11 am', '12 pm' , '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm' ],
      courts: [ 
        {id: 1, lbl:"Court #1", status: "OPEN"} , 
        {id : 2,lbl:"Court #2", status: "OPEN"},  
        {id: 3,lbl:"Court #3", status: "OPEN"} ,
        {id : 4,lbl:"Court #4", status: "OPEN"} ,
        {id : 5, lbl:"Court #5", status: "OPEN"},
        {id: 6, lbl:"Court #6", status: "OPEN"} , 
        {id : 7,lbl:"Court #7", status: "OPEN"},  
        {id: 8,lbl:"Court #8", status: "OPEN"} ,
        {id : 9,lbl:"Court #9", status: "OPEN"} ,
        {id : 10, lbl:"Court #10", status: "OPEN"}
      ],
      scheduleStartTime: 8,
      scheduleEndTime: 20,
      dialog: false,
      date: null,
      courtSlots: null,
      maxDisplayableCourts: 5,
      firstCourt: 0,
      lastCourt: 5,
      resizeTimeout: null,
      time: null,
      endtime: null,
      menu2: false,
      menu3: false
      
    }
  },
  methods: {
    
  },
  computed: {
    
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
