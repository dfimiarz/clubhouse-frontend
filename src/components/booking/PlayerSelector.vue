<template>
    <v-card
    raised=""
    class="mx-2"
    >
        <v-card-text>
            <v-layout justify-start="" align-baseline="" row wrap >
                <v-flex xs12 >
                     <div class="headline">Player #: {{ index + 1 }}</div>
                </v-flex>
                <v-flex xs12 class="pt-2">
                    <v-autocomplete
                    :items="clubMembers"
                    item-text="name"
                    item-value="id"
                    v-model="memberid"
                    label="Select a player"
                    clearable
                    :error-messages="player.errors"
                    single-line
                    >
                    </v-autocomplete>
                </v-flex>
                <v-flex xs12>
                     <v-layout justify-end="" align-end="" align-content-end="" >
                         <v-flex xs12 class="text-xs-right">
                             <transition name="slide-fade">
                                <v-radio-group v-model="picked" column="" v-show="memberid != undefined">
                                    <v-radio label="New" value="0"></v-radio>
                                    <v-radio label="R-1" value="1"></v-radio>
                                    <v-radio label="R-2" value="2"></v-radio>
                                </v-radio-group>
                             </transition>
                         </v-flex>
                     </v-layout>
                </v-flex>
            </v-layout>
        </v-card-text>
        <!--
        <v-card-actions>
            
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="repeater">
                <v-btn large="" color='green' value="1">
                    R-1
                </v-btn>
                <v-btn large color='green' value="2">
                    R-2
                </v-btn>
            </v-btn-toggle> 
            
            <v-spacer></v-spacer>
            <v-btn @click="addPlayer()">
                Select
            </v-btn>
            
            
        </v-card-actions>
        -->
    </v-card>
</template>

<script>
export default {
  name: "PlayerSelector",
  props: {
        index: {
          type:Number,
          required: true
        },
        player: {
          type: Object,
          required: true,
          default: function(){
              return { memberid: undefined, repeater: undefined, errors: [] }
          }
      }
    },
  data: function() {
    return {
        memberid: this.player.memberid, 
        repeater: this.player.repeater,
        picked: "0"
    }
  },
  watch: {
      player: {
          deep: true,
          handler: function(){
              console.log("Player prop updated")
          }
      },
      repeater: function(nVal,oVal){
              console.log("Repeate updated " + JSON.stringify(nVal) + JSON.stringify(oVal))
              
      },
      memberid: function(nVal,oVal){
              console.log("Member updated " + JSON.stringify(nVal) + JSON.stringify(oVal))
      }
  },
  methods: {
    
  },
  computed: {
    clubMembers: function(){
       return this.$store.getters['memberstore/clubMembers'] 
    },
    memberId: {
        get: function(){
            return this.player.memberid
        },
        set: function(newPlayerId){
           var updatedPlayer = { index: this.index, id: newPlayerId, repeater: this.repeatStatus }
           this.$emit('update:player', updatedPlayer )
        }
    },
    repeatStatus: {
        get: function(){
            return this.player.repeater
        },
        set: function(newRepeaterValue){
           var updatedPlayer = { index: this.index, id: this.memberId, repeater: newRepeaterValue }
           this.$emit('update:player', updatedPlayer )
        }
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
