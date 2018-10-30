
<template>
<v-container fluid fill-height="" grid-list-xs >
  <v-layout justify-center="" align-start="" row wrap>
    <v-flex xs12 md10 >
        <div class="main-schedule-container" ref="scheduleContainer" @click="contClicked($event)">
          <div style="grid-column : 1 / 7 ; grid-row : 2; overflow: auto;" class="time-grid-container">
              <div v-for="(n) in totalCellCount" :key="n" class="cell">
                {{ getCellLabel(n) }}
              </div>
          </div>
        </div>
    </v-flex>
    <!--
    <v-flex xs2 >
      <div class="schedule-container" ref="scheduleContainer" @click="contClicked($event)">
        <div v-for="n in civTime" :key="n" class="cell">
          
        </div>
        <div v-for="session in sessions" :key="session.id" class="session" :style="{ height: session.durMin + 'px', top: session.startMin + 'px' }">
          
          <div>{{session.text}}</div>

        </div>
      </div>
    </v-flex>-->
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: 'MatchCalendar',
  data() {
    return {
      message: "This is grid view",
      milTimeLabels: [ '12', '1' , '2', '3', '4' , '5' , '6' , '7' , '8', '9' , '10' , '11', '12' , '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23' ],
      civTimeLabels: [ '12 am', '1 am' , '2 am', '3 am', '4 am' , '5 am' , '6 am' , '7 am' , '8 am', '9 am' , '10 am' , '11 am', '12 pm' , '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm' ],
      sessions: [
          { text: '4 players, bumpable', durMin: 120, startMin: 60, id:1, court: 1 },
          { text: '4 players, bumpable', durMin: 120, startMin: 360, id:2, court: 1 }
      ],
      courts: [ {id: 1} , {id : 2},  {id: 3} , {id : 4} , {id : 5} ],
      scheduleStartTime: 8,
      scheduleEndTime: 20 
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
  grid-template-columns: 50px repeat(5,1fr);
  grid-template-rows: 150px 650px;
  overflow: hidden;
  
}

.time-grid-container{
  height: 100%;
}

.session-grid-container{
  
  height: 100%;
  border: 1px solid;
  

}

.cell{
  border-top: 1px dotted gray;
  height: 90px;
  box-sizing: border-box;
  font-size: small;
}

.session{
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
