<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-center="">
    <v-flex xs12 lg10>
      <v-stepper v-model="bookingStep">
        <v-stepper-header>
          <v-stepper-step :complete="bookingStep > 1" step="1">Player Selection</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="bookingStep > 2" step="2">Court Selection</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Confirm Booking</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <v-layout wrap="" row justify-start="" align-baseline="">
              <v-flex 
                v-for="(player, index) in match.players"
                :key="index"
                xs12 md6 
                class="mb-2"
              >
                <player-selector :index="index" :player="player" v-on:update:player="updatePlayer" v-on:update:repeater="updateRepeater"></player-selector>
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
            { memberid: undefined, repeater: undefined, errors: []},
            { memberid: undefined, repeater: undefined, errors: []},
            { memberid: undefined, repeater: undefined, errors: []},
            { memberid: undefined, repeater: undefined, errors: []}
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
    
  },
  created: function(){
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
