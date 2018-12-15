<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-center="">
    <v-flex xs12 lg10>
      <v-stepper v-model="bookingStep">
        <v-stepper-header>
          <v-stepper-step :complete="bookingStep > 1" step="1">Court Selection</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="bookingStep > 2" step="2">Player Selection</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Finalize Booking</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="2">
            <v-layout wrap="" row justify-start="" align-start="">
              <v-flex xs12>
                <div class="my-2">
                   <v-btn @click="bookingStep = 1">
                      <span> Back to courts</span>
                   </v-btn>    
                </div>
              </v-flex>
              <v-flex 
                v-for="(player, index) in match.players"
                :key="index"
                xs12 sm6 
                class="mb-2"
              >
                <player-selector 
                  :index="index" 
                  :player="player"
                  v-on:update:active="updateActiveSlot"
                  v-on:update:player="updatePlayer" 
                  v-on:update:repeater="updateRepeater">
                </player-selector>
              </v-flex>
              
             
          </v-layout>
          </v-stepper-content>
          <v-stepper-content step="1">
            <v-layout wrap="" row justify-start="" align-baseline="">
              <v-flex 
                v-for="i in 5"
                :key=i
                xs12 sm6 md4 
                class="mb-2"
              >
                <v-card
                  raised=""
                  class="mx-2"
                >
                  <v-img
                    class="white--text"
                    height="150px"
                    src="/court.jpg"
                  >
                    <v-container fill-height fluid>
                      <v-layout justify-start="" align-start="">
                        <v-flex xs12>
                          <div class="display-1 text-xs-center">Court # {{ i }}</div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-img>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">Available now</div>
                      <div class="body-1">Free for next 2 hours</div>
                    </div>
                  </v-card-title>
                  <v-divider light></v-divider>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="bookingStep = 2" large="">Select</v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
            
            
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
            { memberid: undefined, repeater: undefined, errors: [], active: true},
            { memberid: undefined, repeater: undefined, errors: [], active: false}
          ],
        court: null,
        start: null
      },
      bookingStep: 0,
      title: "",
    }
  },
  methods:{
    updateActiveSlot: function( activeInfo ){
      console.log("updating active in parent")

      var index = activeInfo.index
      var newActive = activeInfo.active
      

      this.match.players[index].active = newActive

      if( this.match.players.length < 4 )
        this.match.players.push({ memberid: undefined, repeater: undefined, errors: [], active: false})
    },
    updatePlayer: function (updatePlayerInfo){

      console.log("updating player in parent")

      var index = updatePlayerInfo.index
      var newId = updatePlayerInfo.id
      

      this.match.players[index].memberid = newId
      this.match.players[index].repeater = undefined

    },
    updateRepeater: function ( repeaterInfo ){

      console.log("updating repeater in parent")

      var index = repeaterInfo.index
      var repeater = repeaterInfo.repeater

      this.match.players[index].repeater = repeater

    },
    playersAdded: function() {
      return  this.players.length > 0
    }
  },
  computed: {
    visablePlayerSlots: function(){
      return []
    }
  },
  created: function(){
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
