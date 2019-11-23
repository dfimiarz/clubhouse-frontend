<template>
<v-container fluid >
  <v-row align="start" class="px-1" no-gutters="">
    <v-col cols="12">
        <v-row align="center" justify="space-between" no-gutters="" class="py-1">
          <v-col cols="auto" >
            <v-row align="center" no-gutters="">
              <v-btn color="primary" small outlined @click="resetDate()" class="mr-2">Today</v-btn>

              <v-btn icon @click="changeDay(-1)"> <v-icon> mdi-arrow-left-bold </v-icon> </v-btn>
              <span class="title mx-1">{{ this.getTimeString()}}</span> 
              <v-btn icon @click="changeDay(1)"> <v-icon> mdi-arrow-right-bold </v-icon></v-btn>
            </v-row>
          </v-col>
          <!-- <v-col cols="auto">
            <v-row justify="end" align="center" no-gutters="">
              <v-btn color="warning" icon><v-icon> mdi-help </v-icon></v-btn>
            </v-row>
          </v-col> -->
        </v-row>    
    </v-col>
    <v-col cols="12">
      
          <div class="main-schedule-container" ref="scheduleContainer">
            <div class="court-grid-container" v-bind:style="{ 'grid-template-columns': '40px repeat(' + this.displayableCourts.length + ',1fr)' }">
              
              <div class="pa-1 court-grid-item" v-for="(court,index) in displayableCourts" :key="court.id"  v-bind:style="{ 'grid-column' : index + 2, 'grid-row' : 1 }" >
                
                  <v-btn v-if="index == 0" :disabled="firstCourt == 0" small="" @click="changeDisplayedCourts(-1)" style="grid-row: 1; grid-column: 1 / span 1;"><v-icon> mdi-arrow-left </v-icon> </v-btn>
                  <span class="headline" style="grid-row: 1; grid-column: 2 / span 1;">{{ court.name }}</span>
                  <v-btn v-if="index == (displayableCourts.length - 1 )"  :disabled="( (firstCourt + index) == (courts.length - 1))" small="" @click="changeDisplayedCourts(1)" style="grid-row: 1; grid-column: 3 / span 1;"><v-icon> mdi-arrow-right </v-icon> </v-btn>   
                
              </div>
            </div>
            <div class="time-grid-container" ref="tcontainer">
                <div v-for="(n) in totalCellCount" :key="n" class="cell"  v-bind:style="{ 'height':  cellHeight1H + 'px' }">
                    {{ getCellLabel(n) }}
                </div>
                
                <div 
                  class="session-grid-container" 
                  v-bind:style="{ 'grid-template-columns': '40px repeat(' + this.displayableCourts.length  + ',1fr)' }">
                  
                  <div 
                    v-for="(court,index) in displayableCourts"
                    :key="court.id" 
                    class="court-sessions-container" 
                    v-bind:style="{ 'grid-column' : index + 2, 'grid-row': 1, 'height' : (totalCellCount * cellHeight1H) + 'px'  }">
                  
                    <transition-group name="fade" mode="out-in">
                      <session v-for="match in getMachesForCourt(court.id)" :key="match.id" :session=match>
                        
                      </session>
                    </transition-group>
                  </div>  
                </div>
                <timeindicator :currtime="currtime" v-if="timeIndicatorVisible"></timeindicator>
                
                
                
            </div> 
           
          </div>
           <v-btn
              fixed=""
              fab
              bottom
              right
              color="primary"
              :to="{name: 'AdminBooking'}"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
    </v-col>
  </v-row>
</v-container>
</template>

<script>

import Session from './Session'
import TimeIndicator from './TimeIndicator'
import moment from 'moment'

export default {
  components:{
    'session' : Session,
    'timeindicator': TimeIndicator
  },
  name: 'MatchCalendar',
  data: function() {
    return {
      message: "This is grid view",
      milTimeLabels: [ '12', '1' , '2', '3', '4' , '5' , '6' , '7' , '8', '9' , '10' , '11', '12' , '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ],
      civTimeLabels: [ '12 am', '1 am' , '2 am', '3 am', '4 am' , '5 am' , '6 am' , '7 am' , '8 am', '9 am' , '10 am' , '11 am', '12 pm' , '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm' ],
      dialog: false,
      date: null,
      courtSlots: null,
      maxDisplayableCourts: 5,
      firstCourt: 0,
      resizeTimeout: null,
      currtime: null,
      menu2: false,
      timerHandle: null,
      showTimeIndicator: true
      
    }
  },
  methods: {
    /**
     * scrollCalendar moves the scrollbar to the position corresponding to current time
     */
    scrollCalendar: function(){

      //Get total lenght of the day
      var day_len = this.endMin - this.startMin

      //Do nothing if day is not "long enough"
      if ( day_len < 1 ){
        console.log("Check start and end time")
        return
      }

      //Check if container has height
      if( ! (this.$refs.tcontainer.clientHeight !== undefined && this.$refs.tcontainer.clientHeight >= 0) ){
        console.log("Element height error")
        return
      }

      //Check if container has scrollheight
       if( ! (this.$refs.tcontainer.scrollHeight !== undefined && this.$refs.tcontainer.scrollHeight >= 0) ){
        console.log("Scroll Height error")
        return
      }

      //Get current minutes
      var curr_min = this.currtime.getHours() * 60 + this.currtime.getMinutes()

      //Adjust current minuate for start and end
      var adj_curr_min = curr_min <= this.startMin ? this.startMin : curr_min >= this.endMin ? this.endMin : curr_min

      //Calculate scroll distance
      var initScrollDistance = Math.ceil((adj_curr_min - this.startMin) / ( day_len ) * this.$refs.tcontainer.scrollHeight)

      /**
       * initScrollDistance will align top of the container with current time.
       * We drop that value by clientHeigh / 2 to put current time right in the middle
       * of the screen
       */
      var scrollAdjHeight = Math.ceil(this.$refs.tcontainer.clientHeight / 2);

      /**
       * set scrollTop to substracting scrollAjdHeight from initScrollDistnace
       * According to doc scrollTop will ensure that values are not out of bounds
       */
      this.$refs.tcontainer.scrollTop = initScrollDistance - scrollAdjHeight

    },
    getCellLabel: function(cellnumber) {
        return this.hourLabels[cellnumber-1]
    },
    getTimeString(){
      return this.date != null ? moment(this.date).format("ddd, MMM Do") : 'N/A' 
    },
    changeDay(day_diff){
      const oneday = 1000*3600*24
      this.date = new Date(this.date.getTime() + day_diff * oneday)
    },
    resetDate(){

       const date = new Date()
       date.setHours(0)
       date.setMinutes(0)
       date.setMilliseconds(0)
       date.setSeconds(0)
       this.date = date
    },
    changeDisplayedCourts: function (step){
    
      //Compute next first court to display
      let nextFirstCourt = this.firstCourt + step
      
      if( nextFirstCourt < 0 ){
        nextFirstCourt = 0
      } 

      let nextLimit = nextFirstCourt + this.maxCourtCount

      if( nextLimit > this.courts.length ){
        nextFirstCourt -= nextLimit - this.courts.length
      }
        
      this.firstCourt = nextFirstCourt

    },
    getMachesForCourt(courtid){
      
      return this.$store.getters['matchstore/matchesForCourt'](courtid)
    }
    
  },
  computed: {
    startMin: function(){
      return this.$store.getters['openMin']
    },
    endMin: function(){
      return this.$store.getters['closeMin']
    },
    startHour: function(){
      return Math.trunc(this.startMin/60)
    },
    endHour: function(){
      return Math.trunc(this.endMin/60)
    },
    courts: function(){
      return this.$store.getters['courtstore/getCourts']
    },
    hourLabels: function(){
      return this.civTimeLabels.slice(this.startHour,this.endHour)
    },
    totalCellCount: function(){
      return (this.endHour - this.startHour)
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
        case 'lg': return 3
        case 'xl': return 5
        default : return 5
      }
    },
    
    visiableCourtSlots: function(){
      return null
    },
    displayableCourts:function(){  

      const lastIndex = this.firstCourt + this.maxCourtCount
      /* 
        From docs
        If end [here lastIndex] is greater than the length of the sequence, slice extracts through to the end of the sequence (arr.length).
      */
      return this.courts.slice(this.firstCourt,lastIndex)
    
    },
    timeIndicatorVisible: function(){
      //Get current time in ms
      var now_ms = this.currtime.getTime()

      //Get date start in ms
      var date_start_ms = this.date.getTime()

      //Get date end in ms
      var date_end_ms = date_start_ms + 86400000

      //Check if now_ms falls between date_start and date_end
      return now_ms < date_start_ms ? false : now_ms >= date_end_ms ? false : true

    }
  
    
  },
  created: function() {

    this.resetDate()
    this.currtime = new Date()
    
    
    
  },
  mounted: function(){
    
    this.scrollCalendar()

    this.timerHandle = setInterval(() => {
      this.currtime = new Date()
    },30000)

    // this.$nextTick(() => {
    //   this.scrollCalendar()
    // })
    
    //this.$store.dispatch('matchstore/watchCourts',this.date)
    
  },
  destroyed: function(){
    
    this.$store.dispatch('matchstore/clearMatches')
    clearInterval(this.timerHandle)
  },
  watch: {
    maxCourtCount: function(val){

      let newFirstCourt = this.firstCourt - val + 1

      if( newFirstCourt < 0 )
        newFirstCourt = 0

      this.firstCourt = newFirstCourt

    },
    date: function(val){
      console.log("Date changed" + val)
      this.$store.dispatch('matchstore/loadMatches',moment(this.date).format("YYYY-MM-DD"))
      if( this.timeIndicatorVisible ){
        this.scrollCalendar()
      }
    }
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
  grid-template-rows: 50px;
  border: 1px solid;
}

.court-grid-item{
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(3,1fr);
  justify-items: center;
  align-items: center;
}

.time-grid-container{
  position: relative;
  grid-column : 1;
  grid-row : 2;
  overflow: auto;
  height: 75vh;
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

.change_court_btn {
  position: absolute; 
  grid-row: 1; 
  height: 100%;  
  display: flex; 
  align-items: center; 
  
}

.change_court_btn_forward{

  justify-content: flex-end;

}

.change_court_btn_back{
  justify-content: flex-start;
}

.fade-enter-active,
.fade-leave-active{
    transition: opacity .3s;
}

.fade-enter,
.fade-leave-to{
    opacity: 0;
}

</style>
