<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-start="">
    <v-flex xs12 md10 lg8 xl6>
      <v-stepper v-model="bookingStep" v-show="! loading">
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
                <v-btn large depressed="" @click="validatePlayers()">
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
                v-for="c in courts"
                :key=c.id
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
                          <div class="display-1 text-xs-center">Court {{ c.label }}</div>
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
                      <v-card-title>
                          <div class="display-1 text-xs-center">Booking Details</div>
                      </v-card-title>
                      <v-card-text>
                        <v-layout fill-height="" row wrap justify-center="" align-start="">
                          <v-flex xs12 sm6 >
                              <v-layout fill-height="" align-center="" align-start="" row wrap>
                                <v-flex xs12 class='py-3'>
                                  <div class="headline">Players:</div>
                                </v-flex>
                                <v-flex xs12>
                                  <v-flex xs12 v-for="p in playerDetails" :key="p.number" class="py-1">
                                    <div class="title">{{p.name}}</div>
                                    <span class="body-1">{{ p.repeater }}</span>
                                  </v-flex>
                                </v-flex>
                              </v-layout>
                          </v-flex>
                          <v-flex xs12 sm6 >
                            <v-layout fill-height="" align-center="" align-start="" row wrap>
                              <v-flex xs12 class="py-3" >
                                  <div class="headline">Session:</div>
                                </v-flex>
                              <v-flex xs12 class="py-1">
                                <div class="caption">Court</div>
                                <span class="title">#1</span>
                              </v-flex>
                              <v-flex xs12 class="py-1">
                                <div class="caption">Bumpable</div>
                                <span class="title">No</span>
                              </v-flex>
                              <v-flex xs12>
                                <v-select
                                  :items = sessionDurations
                                  item-text="label"
                                  item-value="value"
                                  label="Desired duration"
                                ></v-select>
                              </v-flex>
                              <v-flex xs12>
                                <v-select
                                  :items = sessionStarts
                                  label="Start"
                                ></v-select>
                              </v-flex>
                            </v-layout>
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
  <v-dialog
    v-model="loading"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      dark
    >
      <v-card-text>
        Please stand by
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
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
      court: undefined,
      sessionLenght: 10
    }
  },
  methods:{
    checkForDuplicatePlayers: function(){

      //Find all player duplicates in playerSlots
      this.playerSlots.forEach( (slot,index, array) =>  {
          let playerid = slot.player.memberid;
          if( array.some( (slot,slotindex) => slot.player.memberid == playerid && slotindex != index && slot.player.memberid !== undefined) ){
            this.playerSlots[index].errors.push({ field: "player", msg : "Duplicate players" })
          }
      })
      
      /*
      //This version finds the first duplicate only

      return this.playerSlots.some( (slot , index, array) =>  {
          let playerid = slot.player.memberid;

          return array.some( (slot, slotindex) => {
            if( slot.player.memberid == playerid && slotindex != index && slot.player.memberid !== undefined) 
            {
              this.playerSlots[slotindex].errors.push({ field: "player", msg : "Player already added" })
              return true
            }
            return false
          })
      })
      */
      
    },
    checkForUndefinedPlayers: function(){

      this.playerSlots.forEach((slot) => {
        if( slot.player.memberid === undefined ){
          slot.errors.push({ field: "player", msg : "Please select a player" })
        }

        if( slot.player.repeater === undefined ){
          slot.errors.push({ field: "repeater", msg : "Please select a repeater type" })
        }
      })


    },
    validatePlayers: function(){

      this.clearAllSlotErrors()

      this.checkForDuplicatePlayers()  
      
      this.checkForUndefinedPlayers()

      if( ! this.hasErrors ){
        this.bookingStep = 3
      }

    },
    clearSlotErrors( index ){
      //Clear error from a specific player slot
      if( this.playerSlots[index] != null ){
        let count = this.playerSlots[index].errors.length
        this.playerSlots[index].errors.splice(0,count)
      }
    },
    clearAllSlotErrors: function(){
      //Clear all errors from all player slots
      this.playerSlots.forEach(slot => {
        let count = slot.errors.length
        slot.errors.splice(0,count)        
      });

    },
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
          const {memberid,repeater} = slot.player

          const member = this.$store.getters['memberstore/getMemberById'](memberid)
          const repeaterDetails = this.$store.getters['getRepeaterType'](repeater)

          if( ! (member && repeaterDetails) ){
            
            return { name: "NA", id : null , repeater: "NA", number: index+1 }
          }

          return { name: member.name, id: member.id , repeater: repeaterDetails.label, number: index + 1 }
          
          
        })
       
    },
    sessionDurations: function(){
      return [{"value":60,"label":"60 min"},
              {"value":50,"label":"50 min"},
              {"value":40,"label":"40 min"},
              {"value":30,"label":"30 min"},
              {"value":20,"label":"20 min"},
              {"value":10,"label":"10 min"}]
    },
    sessionStarts: function(){
      return ['Now', 'In 5 min']
    },
    courts: function(){
      return this.$store.getters['courtstore/getCourts']
    },
    loading: function(){
      return this.$store.getters['loading']
    },
    hasErrors: function(){
      return this.playerSlots.some( slot => slot.errors.length != 0 )
    }
    
  },
  created: function(){
    this.playerSlots.push({ player: {memberid: undefined, repeater: undefined}, errors: []})
    this.$store.dispatch('courtstore/loadCourtInfo')
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
