<template>
    <v-card
    raised=""
    class="mx-2"
    >
        <v-card-text>
            <v-layout justify-start="" align-center="" row wrap >
                <v-flex xs12 class="px-2">
                    Player {{ index + 1 }}
                    <v-autocomplete
                    :items="clubMembers"
                    item-text="name"
                    item-value="id"
                    v-model="memberId"
                    label="Select a player"
                    clearable
                    >
                    </v-autocomplete>
                </v-flex>
            </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="repeatStatus" >
                <v-btn large="" color='green' value="1">
                    R-1
                </v-btn>
                <v-btn large color='green' value="2">
                    R-2
                </v-btn>
            </v-btn-toggle> 
            <!--
            <v-spacer></v-spacer>
            <v-btn @click="addPlayer()">
                Select
            </v-btn>
            -->
            
        </v-card-actions>
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
              return { memberid: null, repeater: null }
          }
        } 
      },
  data: function() {
    return {
        
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
        set: function(playerId){
           var updatedPlayer = { index: this.index, id: playerId }
           this.$emit('player-updated', updatedPlayer )
        }
    },
    repeatStatus: {
        get: function(){
            return this.player.repeater
        },
        set: function(value){
           var repeatStatusInfo = { index: this.index, repeater : value  }
           this.$emit('repeat-status-updated', repeatStatusInfo )
        }
    }
    
    
  },
  created: function(){
      
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
