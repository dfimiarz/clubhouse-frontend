<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-content-start="" row wrap>
    <v-flex xs12 lg10 >
      <v-layout align-center="" justify-space-between="" row wrap>
        <div>
          <v-btn icon @click="resetDate()"> <v-icon> today </v-icon></v-btn>
          <v-btn icon @click="changeDay(-1)"> <v-icon> arrow_back </v-icon> </v-btn>
          <span class="title">{{ this.getTimeString()}}</span> 
          <v-btn icon @click="changeDay(1)"> <v-icon> arrow_forward </v-icon></v-btn>
        </div>
        <div>
          <v-btn icon @click="changeDisplayedCourts(-1)" > <v-icon> arrow_back </v-icon> </v-btn>
          <span class="title">Courts</span>
          <v-btn icon @click="changeDisplayedCourts(1)"> <v-icon> arrow_forward </v-icon></v-btn>
        </div>
      </v-layout>
    </v-flex>
    <v-flex xs12 lg10 >
     
          <div class="main-schedule-container" ref="scheduleContainer" @click="contClicked($event)">
            <div class="court-grid-container" v-bind:style="{ 'grid-template-columns': '40px repeat(' + displayableCourts.length + ',1fr)' }">
              <div v-for="(court,index) in displayableCourts" :key="court.id" class="pa-1" v-bind:style="{ 'grid-column' : index + 2, 'grid-row' : 1 }">
                <div class="text-xs-center headline">
                  {{ court.lbl }}    
                </div>
                <div class="text-xs-center">
                  <span class="green darken-3">{{ court.statelbl }}</span>
                </div>
              </div>
            </div>
            <div class="time-grid-container">
                <div v-for="(n) in totalCellCount" :key="n" class="cell"  v-bind:style="{ 'height':  cellHeight1H + 'px' }">
                    {{ getCellLabel(n) }}
                </div>
                
                <div 
                  class="session-grid-container" 
                  v-bind:style="{ 'grid-template-columns': '40px repeat(' + displayableCourts.length  + ',1fr)' }">
                  
                  <template 
                    v-for="(court,index) in displayableCourts">
                    <div 
                      :key="court.id" 
                      class="court-sessions-container" 
                      v-bind:style="{ 'grid-column' : index + 2, 'grid-row': 1, 'height' : (totalCellCount * cellHeight1H) + 'px'  }">
                    
                      <session v-for="match in getMachesForCourt(court.id)" :key="match.id" :session=match>
                        
                      </session>
                    
                    </div>  
                  </template>
                </div>
                
                
                
            </div> 
           
          </div>
           <v-btn
              fixed=""
              fab
              bottom
              right
              color="pink"
              :to="{name: 'AdminBooking'}"
            >
              <v-icon>add</v-icon>
            </v-btn>
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
      menu2: false
      
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
    },
    changeDisplayedCourts: function (step){
    
      const tempFirstCourt = this.firstCourt + step

      const end = tempFirstCourt + this.maxCourtCount

      console.log(this.firstCourt,tempFirstCourt,this.maxCourtCount)

      if( end <= this.courts.length && tempFirstCourt >= 0 ){
        
        this.firstCourt = tempFirstCourt
      }
        

    },
    getMachesForCourt(courtid){
      
      //return this.$store.getters['matchstore/loadedMatches']
      return this.$store.getters['matchstore/matchesForCourt'](courtid)
    }
    
  },
  computed: {
    courts: function(){
      return this.$store.getters['courtstore/getCourts']
    },
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
    
    visiableCourtSlots: function(){
      return null
    },
    displayableCourts:function(){  

      
      const diff = this.firstCourt + this.maxCourtCount - this.courts.length

      let firstCourt = this.firstCourt

      if( diff > 0 ){
        firstCourt -= diff
        
      }
      

      return this.courts.slice(firstCourt,firstCourt+this.maxCourtCount/*Math.min(this.lastCourt,this.courts.length,this.maxDisplayableCourts)*/)
    }
  
    
  },
  created: function() {
    
  },
  mounted: function(){
    this.resetDate()
    //console.log("Mounted")
  },
  beforeDestroy () {
   
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
  /*font-size: calc(10px + 1vw);*/
  
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
  position: relative;
  grid-column : 1;
  grid-row : 2;
  overflow: auto;
  
  
}

.session-grid-container{
  position: absolute;
  display: grid;
  /* grid-template-columns: 40px repeat(5,1fr);*/
  grid-template-rows: 1fr;
  top: 0px; 
  left: 0px;
  height: 100%;
  width: 100%;
}

.court-sessions-container{
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
