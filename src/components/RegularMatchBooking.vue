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
            <v-layout justify-start="" align-start="" fill-height="" wrap="" row >
              <v-flex xs12>
                <v-btn depressed="" @click="bookingStep = 1">
                    <v-icon>arrow_back</v-icon>
                  </v-btn>
                  <v-btn depressed="" @click="bookingStep = 3">
                    <v-icon>arrow_forward</v-icon>
                  </v-btn>
              </v-flex>
              <v-flex 
                v-for="(slot, index) in playerSlots"
                :key="index"
                xs12 sm6
                class="mb-2"
              >
                <player-selector 
                  :index="index" 
                  v-bind="slot"
                  
                  v-on:update:remove="removeSlot"
                  v-on:update:player="updatePlayer" 
                  v-on:update:repeater="updateRepeater">
                </player-selector>
              </v-flex>
              <v-flex xs12 sm6 v-if="canAddSlots">
                <v-card
                height="300"
                class="mx-2"
                >
                  <v-layout fill-height="" align-center="" justify-center="" >
                    <v-btn fab large @click="addSlot()">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-layout>
                </v-card>
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
             <v-layout wrap="" row justify-start="" align-start="">
              <v-flex xs12>
                <v-btn depressed="" @click="bookingStep = 2">
                  <v-icon>arrow_back</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12>
                Court:
                Players:
              </v-flex>
             </v-layout>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>

import PlayerSelector from './booking/PlayerSelector'

export default {
  name: "RegularMatchBooking",
  components:{
    PlayerSelector
  },
  data: function() {
    return {
      playerSlots : [
        { player: {memberid: undefined, repeater: undefined}, errors: []}
      ],
      bookingStep: 0
    }
  },
  methods:{
    removeSlot: function(index){

      let len = this.playerSlots.length

      if( len > 1 ){
        this.playerSlots.splice(index,1)
      } 
    },
    updatePlayer: function (updatePlayerInfo){

      var index = updatePlayerInfo.index
      var newId = updatePlayerInfo.id
      

      this.playerSlots[index].player.memberid = newId
      this.playerSlots[index].player.repeater = undefined

    },
    updateRepeater: function ( repeaterInfo ){

      var index = repeaterInfo.index
      var repeater = repeaterInfo.repeater

      this.playerSlots[index].player.repeater = repeater

    },
    addSlot: function(){
      this.playerSlots.push({ player: {memberid: undefined, repeater: undefined}, errors: []})
    }
  },
  computed: {
    canAddSlots: function(){
      return this.playerSlots.length < 4
    }
    
  },
  created: function(){
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
