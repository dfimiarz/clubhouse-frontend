<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-center="">
    <v-flex xs12 lg10>
      <v-stepper v-model="bookingStep">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Player Selection</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="e1 > 2" step="2">Court Selection</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Confirm Booking</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-layout wrap="" row justify-start="" align-center="">
              <v-flex 
                v-for="(player, index) in match.players"
                :key="index"
                xs12 sm6 
                class="mb-2"
              >
                <!--<player-booking :player="match.players[n-1]" v-on:remove-player="removePlayer" v-if="match.players[n-1] != null"></player-booking>-->
                <player-selector :index="index" :player="player" v-on:player-updated="updatePlayer" v-on:repeat-status-updated="updateRepeaterStatus"></player-selector>
              </v-flex>
              <v-btn @click="bookingStep = 2">
                Next
              </v-btn>
          </v-layout>
          </v-stepper-content>
          <v-stepper-content step="2">
            Court selection step
            <v-btn @click="bookingStep = 1">
                Players
              </v-btn>
            <v-btn @click="bookingStep = 3">
                Next
              </v-btn>
          </v-stepper-content>
          <v-stepper-content step="3">
            Confirm Step
            <v-btn @click="bookingStep = 1">
                Restart
            </v-btn>
            <v-btn>
                Complete
              </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

          
          
          <div v-if="! playersAdded()" class="title my-4 red--text">No players added!</div>
        
          

    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import PlayerBooking from './booking/PlayerBooking'
import PlayerSelector from './booking/PlayerSelector'

export default {
  name: "RegularMatchBooking",
  components:{
    PlayerBooking,
    PlayerSelector
  },
  data: function() {
    return {
      courts: ['# 1','# 2','# 3','# 4','# 5'],
      startOptions: ["Now","5 min"],
      startTime: "Now",
      selectedMember: null,
      players: [],
      match: { 
        players: [
            { memberid: 1, repeater: '1'},
            { memberid: 2, repeater: null},
            { memberid: null, repeater: null},
            { memberid: null, repeater: null}
          ],
        court: null,
        start: null
      },
      bookingStep: 0,
      title: "",
    }
  },
  methods:{
    updatePlayer: function (updatePlayerInfo){

      var index = updatePlayerInfo.index
      var newid = updatePlayerInfo.id

      var newplayer = { memberid: newid, repeater : null }

      this.match.players.splice(index,1,newplayer)
    },
    updateRepeaterStatus: function(updatedRepeaterStatus){

      var index = updatedRepeaterStatus.index
      var newStatus = updatedRepeaterStatus.repeater

      this.match.players[index].repeater = newStatus

    },
    addPlayer: function (){

      if(  this.players.length < 4 && this.selectedMember ){
        var player =  { repeater : null  } 
        this.players.push( Object.assign( player , this.selectedMember) )
        this.selectedMember = null
      }
    },
    removePlayer: function (id){
       this.players.splice(this.players.findIndex((player)=> player.id == id ),1)
    },
    isPlayerChosen: function (){
      return  this.player != null
    },
    playersAdded: function() {
      return  this.players.length > 0
    },
    canAddPlayer: function(){
      return  this.players.length < 4
    }
  },
  computed: {
    maxGameTime: function(){
      return this.players.length * 30
    },
    currentTitle: function(){
      switch( this.bookingStep ){
        case 1: return 'Step 1: Select players:'
        case 2: return 'Step 2: Select a court'
        default: return 'Step 3: Confirm'
      }
    },
    clubMembers: function(){
      return this.$store.getters['memberstore/clubMembers']
    }
  },
  created: function(){
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.player_container{
  /*font-size: calc(10px + 1vw);*/
  border: 1px dashed;
}
</style>
