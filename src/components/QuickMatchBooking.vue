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
            <v-layout wrap="" row fill-height="">
              <v-flex 
                v-for="c in courts"
                :key=c.id
                xs12 sm6 md4 
                class="mb-2"
              >
                <court-selector 
                  :court=c

                  v-on:update:court="selectCourt"  
                >
                
                </court-selector>
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
                    <session-booker :players="players" :courtid="selectedCourt"></session-booker>
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
import CourtSelector from './booking/CourtSelector'
import SessionBooker from './booking/SessionBooker'

export default {
  name: "QuickMatchBooking",
  components:{
    PlayerSelector,
    CourtSelector,
    SessionBooker
  },
  data: function() {
    return {
      playerSlots : [],
      bookingStep: 0,
      selectedCourt: null,
      timerhandle: null
    }
  },
  watch: {
    bookingStep: function(newval,oldval){
      if( newval === 1 || oldval === 0){
        this.$store.dispatch('courtstore/loadCourtInfo')
      }
    }
  },
  methods:{
    startPolling: function()
    {
      this.timerhandle = setInterval( () => {
        this.$store.dispatch('courtstore/updateCourtInfo')
      },10000)
    },
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
    },
    selectCourt: function(courtid){
      this.selectedCourt = courtid
      this.bookingStep = 2
    }
  },
  computed: {
    canAddSlots: function(){
      return this.playerSlots.length < 4
    },
    players: function(){
       return this.playerSlots.map( (slot,index) => {
          const {memberid,repeater} = slot.player

          return { id: memberid , repeater: repeater, number: index + 1 }          
       })
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
    //this.startPolling()
  },
  beforeDestroy(){
    clearInterval(this.timerhandle)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
