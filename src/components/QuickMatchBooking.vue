<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-start="">
    <v-flex xs12 md10 lg8 xl6>
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
              <v-flex xs12 class="py-2">
                <v-btn large depressed="" @click="bookingStep = 1">
                  <v-icon>arrow_back</v-icon>
                </v-btn>
                <v-btn large depressed="" @click="bookingStep = 3">
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
             <v-layout row wrap align-center="" justify-center="" fill-height="">
              <v-flex xs12 sm10 class="py-2">
                <v-btn large depressed="" @click="bookingStep = 2">
                  <v-icon>arrow_back</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-layout justify-center=""  fill-height="" row wrap="">
                  <v-flex xs12 sm10  class="pa-2" >
                    <v-card>
                      <v-img
                        class="white--text"
                        height="150px"
                        src="/court.jpg"
                        
                      >
                        <v-layout justify-center="" fill-height="">
                          <v-card-title>
                            <div class="display-1"> Court #1 </div>
                          </v-card-title>      
                        </v-layout>
                      </v-img>
                      <v-card-title>
                        <div>
                          <div class="title">Booking summary:</div>
                          <span class="grey--text">Review booking details</span>
                        </div>
                      </v-card-title>
                      <v-card-text>
                        <v-layout fill-height="" row wrap justify-center="" align-start="">
                          <v-flex xs12 sm6 >
                              <v-layout fill-height="" align-center="" align-start="" row wrap>
                                <v-flex xs12 >
                                  <div class="headline">Players:</div>
                                </v-flex>
                                <v-flex xs12 v-for="p in playerDetails" :key="p.number" class="py-1">
                                  <div class="subheading">{{p.name}}</div>
                                  <span class="body-1">Non-repeater{{ p.repeater }}</span>
                                </v-flex>
                              </v-layout>
                          </v-flex>
                          <v-flex xs12 sm6 >
                            <v-layout fill-height="" align-center="" align-start="" row wrap>
                              <v-flex xs12 class="py-1">
                                <div class="body-1">Bumpable</div>
                                <span class="subheading">No</span>
                              </v-flex>
                              <v-flex xs12 class="py-1">
                                <div class="body-1">Maximum duration</div>
                                <span class="subheading">60 minutes</span>
                              </v-flex>
                              <v-flex xs12 class="py-1">
                                <v-slider
                                  v-model="value"
                                  step="10"
                                  thumb-label="always"
                                  min="10"
                                  max="60"
                                ></v-slider>
                              </v-flex>
                              <v-flex xs12 class="py-1">
                                <v-radio-group v-model="radios" :mandatory="false" row="" >
                                  <v-radio label="Start now" value="radio-1"></v-radio>
                                  <v-radio label="Start in 5 min" value="radio-2"></v-radio>
                                </v-radio-group>
                              </v-flex>
                            </v-layout>
                            <!--
                            <v-list>
                              <v-subheader>Session properties</v-subheader>
                              <v-list-tile>
                                <v-list-tile-content>
                                  <v-list-tile-title>Bumpable:</v-list-tile-title>
                                  <v-list-tile-sub-title>No</v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                              
                              <v-list-tile>
                                <v-list-tile-content>
                                  <v-list-tile-title>Maximum  duration:</v-list-tile-title>
                                  <v-list-tile-sub-title>60</v-list-tile-sub-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </v-list>--> 
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green">Book</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-layout>
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
  name: "QuickMatchBooking",
  components:{
    PlayerSelector
  },
  data: function() {
    return {
      playerSlots : [],
      bookingStep: 0,
      sessionLenght: 10
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
    },
    playerDetails: function(){
      return this.playerSlots.map( (slot,index) => {
          var {memberid,repeater} = slot.player
          var member = this.$store.getters['memberstore/getMemberById'](memberid)

          if( member === undefined){
            return {}
          }
          member.repeater = repeater
          member.number = index + 1
          return member
        })
    }
    
  },
  created: function(){
    this.playerSlots.push({ player: {memberid: undefined, repeater: undefined}, errors: []})
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
