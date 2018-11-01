
import func from './vue-temp/vue-editor-bridge';
<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-content-start="" row wrap>
    <v-flex xs12 lg10 >
      Date: 2018/10/01
    </v-flex>
    <v-flex xs12 lg10 >
     
          <div class="main-schedule-container" ref="scheduleContainer" @click="contClicked($event)">
            <div class="court-grid-container">
              <div v-for="(court,index) in courts" :key="court.id" class="pa-1" v-bind:style="{ 'grid-column' : index + 2, 'grid-row' : 1 }">
                <div class="text-xs-center" style=" font-size: 2vw;">
                  {{ court.lbl }}    
                </div>
                <div class="title text-xs-center">
                  <span class="green darken-3 px-2" style=" font-size: 1.5vw;">{{ court.status }}</span>
                </div>
              </div>
            </div>
            <div class="time-grid-container">
                <div v-for="(n) in totalCellCount" :key="n" class="cell"  v-bind:style="{ height:  + cellHeight1H + 'px' }">
                    {{ getCellLabel(n) }}
                </div>
                <div class="session-grid-container">
                  <div style="grid-column : 2 ; grid-row : 1; height: 720px ; border: 1px solid; position: relative;">
                    <match v-for="match in matches" :key="match.id" :vpos="(match.startMin * cellHeight1H/60)" :height="(match.durMin * cellHeight1H/60)"></match>
                  </div>
                  <div style="grid-column : 3 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  <div style="grid-column : 4 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  <div style="grid-column : 5 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                  <div style="grid-column : 6 ; grid-row : 1; height: 100%; border: 1px solid;"> </div>
                </div>
                
            </div> 
           
          </div>
           <v-btn
                fixed=""
                fab
                bottom
                right
                color="pink"
              >
                <v-icon>add</v-icon>
              </v-btn> 
        
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>

import Match from './Match'

export default {
  components:{
    Match
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
      cellHeight1H: 60
    }
  },
  methods: {
    contClicked: function(event){
      console.log(event.target)
    },
    getCellLabel: function(cellnumber) {
        return this.hourLabels[cellnumber-1]
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
    }
    
  },
  created: function() {
      
  },
  mounted: function(){
    console.log("Mounted")
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
  grid-template-rows: 1fr 650px;
  
}

.court-grid-container{
  position: relative;
  display: grid;
  grid-template-columns: 40px repeat(5,1fr);
  grid-template-rows: 1fr;
  border: 1px solid;
  height: 100%;
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

.cell{
  border-top: 1px dotted gray;
  box-sizing: border-box;
  font-size: small;
}

.session_cell {
  position: absolute;
  border: 2 px solid;
  background-color: lightgreen;
  width: 100%;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 2px 3px black;
  color: black;
  padding: 5px;
}

.court-grid{
  height: 100%;
  border: 1px solid;
}
</style>
