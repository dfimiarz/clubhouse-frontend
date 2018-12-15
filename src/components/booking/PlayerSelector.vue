<template>
    <v-card
    raised=""
    class="mx-2"
    height="320"
    >
        <v-card-text v-if="active">
            <v-layout justify-start="" align-baseline="" row wrap >
                <v-flex xs12 >
                    <div class="d-flex" style="align-items: center">
                        <div class="headline">Player #: {{ index + 1 }}</div>
                        <div class="text-xs-right">
                            <v-btn fab small>
                                <v-icon>remove</v-icon>
                            </v-btn>
                        </div>
                    </div>
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
                                <v-radio-group v-model="repeater" column="" label="Repeater:">
                                    <v-radio label="Non-Repeater" value="0"></v-radio>
                                    <v-radio label="R-1" value="1"></v-radio>
                                    <v-radio label="R-2" value="2"></v-radio>
                                </v-radio-group>
                             </transition>
                         </v-flex>
                     </v-layout>
                     
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-layout v-else justify-center="" align-center="" row fill-height="" @click="active = true">
            <div class="text-xs-center display-3">
                +
            </div>
        </v-layout>
               
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
              return { memberid: undefined, repeater: undefined, errors: [], active: true }
          }
      }
    },
  data: function() {
    return {
       
    }
  },
  watch: {
     
  },
  methods: {
    
  },
  computed: {
    clubMembers: function(){
       return this.$store.getters['memberstore/clubMembers'] 
    },
    active: {
        get: function() {
            return this.player.active
        },
        set: function(newActiveVal){
           var activeInfo = { index: this.index, active: newActiveVal }
           this.$emit('update:active', activeInfo )
        }
    },
    memberid: {
        get: function(){
            return this.player.memberid
        },
        set: function(newPlayerId){
           var updatedPlayer = { index: this.index, id: newPlayerId }
           this.$emit('update:player', updatedPlayer )
        }
    },
    repeater: {
        get: function(){
            return this.player.repeater
        },
        set: function(newRepeaterValue){
           var repeaterInfo = { index: this.index, repeater: newRepeaterValue }
           this.$emit('update:repeater', repeaterInfo )
        }
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
