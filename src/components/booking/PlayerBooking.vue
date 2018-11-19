<template>
    <v-card 
    raised=""
    class="mx-2"
    >
        <v-card-text primary-title>
        <v-layout wrap="" row justify-start="" align-baseline="">
            <v-flex xs12>
                <div class="subheading">{{ player.id }}</div>
            </v-flex>
            <v-flex xs12>
                <div class="subheading">{{ player.name }}</div>
            </v-flex>
            <v-flex xs12>
                <div class="caption">Repeater: {{ player.repeater }}</div>
            </v-flex>
        </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn-toggle v-model="player.repeater" >
                <v-btn large="" color='green' value="R1">
                    R-1
                </v-btn>
                <v-btn large color='green' value="R2">
                    R-2
                </v-btn>
            </v-btn-toggle> 
            <v-spacer></v-spacer>
            <v-btn @click="removePlayer()" fab small color="pink">
                <v-icon> remove </v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
    
</template>

<script>
export default {
  name: "PlayerBooking",
  props: ['player'],
  data: function() {
    return {
    
    }
  },
  methods: {
    removePlayer: function (){
       console.log( "Calling to remove player" + this.player.id)
       this.$emit('remove-player', this.player.id)
    },
      

  },
  computed: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>