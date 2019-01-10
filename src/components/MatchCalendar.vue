<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-content-start="" row wrap>
    <v-flex xs12 lg10 >
      <v-layout align-center="">
        <v-btn icon @click="resetDate()"> <v-icon> today </v-icon></v-btn>
        <v-btn icon @click="changeDay(-1)"> <v-icon> arrow_back </v-icon> </v-btn>
        <span class="title" @click="resetDate()">{{ this.getTimeString()}}</span> 
        <v-btn icon @click="changeDay(1)"> <v-icon> arrow_forward </v-icon></v-btn>
      </v-layout>
    </v-flex>
    <v-flex xs12 lg10 >
     
          <div class="main-schedule-container" ref="scheduleContainer" @click="contClicked($event)">
            <div class="court-grid-container" v-bind:style="{ 'grid-template-columns': '40px repeat(' + this.maxCourtCount + ',1fr)' }">
              <div v-for="(court,index) in displayableCourts" :key="court.id" class="pa-1" v-bind:style="{ 'grid-column' : index + 2, 'grid-row' : 1 }">
                <div class="text-xs-center headline">
                  {{ court.lbl }}    
                </div>
                <div class="text-xs-center" style="font-size: .7em;">
                  <span class="green darken-3">{{ court.status }}</span>
                </div>
              </div>
            </div>
            <div class="time-grid-container">
                <div v-for="(n) in totalCellCount" :key="n" class="cell"  v-bind:style="{ height:  + cellHeight1H + 'px' }">
                    {{ getCellLabel(n) }}
                </div>
                
                <div class="session-grid-container" v-bind:style="{ 'grid-template-columns': '40px repeat(' + this.maxCourtCount + ',1fr)' }">
                  
                  <div v-for="(court,index) in displayableCourts" :key="court.id" class="court-sessions-container" v-bind:style="{ 'grid-column' : index + 2, 'grid-row' : 1 }">
                    
                    <session v-for="match in matches" :key="match.id" :session=match>
                      
                    </session>
                    
                  </div>

                  <!--
                  <div style="grid-column : 2 ; grid-row : 1; height: 720px; border: 1px solid; position: relative;">
                    <session v-for="match in matches" :key="match.id" :session=match>
                      
                    </session>
                  </div>
                  <div style="grid-column : 3 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  <div style="grid-column : 4 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  <div style="grid-column : 5 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  <div style="grid-column : 6 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  -->
                </div>
                
                
                
            </div> 
           
          </div>
          <v-dialog v-model="dialog" max-width="600px">
            <v-btn
              fixed=""
              fab
              bottom
              right
              color="pink"
              slot="activator"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Add Match</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Legal first name*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-text-field
                        label="Legal last name*"
                        hint="example of persistent helper text"
                        persistent-hint
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Email*" required></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="Password*" type="password" required></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select
                        :items="['0-17', '18-29', '30-54', '54+']"
                        label="Age*"
                        required
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-autocomplete
                        :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                        label="Interests"
                        multiple
                      ></v-autocomplete>
                    </v-flex>
                  </v-layout>
                </v-container>
                <small>*indicates required field</small>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="dialog = false">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
           
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
      courts: [ {id: 1, lbl:"Court #1", status: "OPEN"} , {id : 2,lbl:"Court #2", status: "OPEN"},  {id: 3,lbl:"Court #3", status: "OPEN"} , {id : 4,lbl:"Court #4", status: "OPEN"} , {id : 5, lbl:"Court #5", status: "OPEN"} ],
      scheduleStartTime: 8,
      scheduleEndTime: 20,
      dialog: false,
      date: null
    }
  },
  methods: {
    contClicked: function(){
      //console.log(event.target)
    },
    getCellLabel: function(cellnumber) {
        return this.hourLabels[cellnumber-1]
    },
    getTimeString(){
      return this.date != null ? this.date.toDateString() : 'N/A' 
    },
    changeDay(day_diff){
      const oneday = 1000*3600*24
      this.date = new Date(this.date.getTime() + day_diff * oneday)
    },
    resetDate(){
       this.date = new Date()
    }
  },
  computed: {
    hourLabels: function(){
      return this.civTimeLabels.slice(this.scheduleStartTime,this.scheduleEndTime)
    },
    totalCellCount: function(){
      return (this.scheduleEndTime - this.scheduleStartTime)
    },
    matches: function () {
      return this.$store.getters['matchstore/loadedMatches']
    },
    cellHeight1H: function(){
      return this.$store.getters['calCellHeight1H'];
    },
    maxCourtCount:function(){
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 2
        case 'md': return 3
        case 'lg': return 5
        case 'xl': return 5
      }
    },
    displayableCourts:function(){
      return this.courts.slice(0,Math.min(this.maxCourtCount,this.courts.length))
    }
    
  },
  created: function() {
      this.resetDate()
  },
  mounted: function(){
    //console.log("Mounted")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.main-schedule-container{
  border: 1px solid darkgray;
  box-sizing: border-box;
  user-select: none;
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr auto;
  font-size: calc(10px + 1vw);
  
}

.court-grid-container{
  position: relative;
  display: grid;
  /* grid-template-columns: 40px repeat(5,1fr); */
  grid-template-rows: 1fr;
  border: 1px solid;
  /*height: 100%;*/
}

.time-grid-container{
  height: 100%;
  position: relative;
  grid-column : 1;
  grid-row : 2;
  overflow: auto;
  
  
}

.session-grid-container{
  position: absolute;
  display: grid;
  grid-template-columns: 40px repeat(5,1fr);
  grid-template-rows: 1fr;
  top: 0px; 
  left: 0px;
  height: 100%;
  width: 100%;
}

.court-sessions-container{
  height: 720px; 
  border: 1px solid;
  position: relative;
  box-sizing: border-box;
  
}

.cell{
  border-top: 1px dotted gray;
  box-sizing: border-box;
  font-size: small;
}

.court-grid{
  height: 100%;
  border: 1px solid;
}
</style>
