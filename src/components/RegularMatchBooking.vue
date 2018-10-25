<template>
<v-container fluid fill-height>
  <v-layout justify-start="" align-center>
    <v-flex xs12 xl10>
      <v-form>
       
       <v-layout>
          <v-checkbox class="shrink mr-2"
            label="Guest of:"
            v-model="isGuest"
          ></v-checkbox>
          <v-autocomplete
          
          :items="members"
          persistent-hint
          placeholder="Select a player"
          single-line
          clearable
          v-model="player"
          
        >
        </v-autocomplete>
      </v-layout>
        
      <v-btn @click="addPlayer" :disabled="! isPlayerChosen()" small>
          Add Player
      </v-btn>

      <v-container fluid fill-height grid-list-md>
      <v-layout wrap="" row justify-start="" align-center="">
        <v-flex 
           v-for="(p, index) in players"
          :key=p
          xs12 sm6
        >
        <v-card 
          raised=""
         
          >
            <v-card-title primary-title>
              
                <v-layout wrap="" row justify-center="" align-baseline="">
                  <v-flex xs12>
                    <div class="title">Player # {{ index + 1}}: {{ p }}</div>
                  </v-flex>
                  <v-flex xs12>
                    <div class="body-2">Repeater status: R0</div>
                  </v-flex>
                </v-layout>
            
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="removePlayer(p)" small>Remove</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
      </v-layout>
      </v-container>
        
      <v-text-field
          label="Player #1 PIN"
          type="password"
          single-line
        ></v-text-field>
      <v-select
        :items="courts"
        label="Court"
      ></v-select>
        <v-select
        v-model="startTime"
        :items="startOptions"
        label="Start Time:"
      ></v-select>
      <v-btn>
          Start Match
      </v-btn>
    </v-form>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: "RegularMatchBooking",
  data: function() {
    return {
      members: [
        'Laurent Mars','Daniel Fimiarz','John Smith','Jun Tsuchiya'
      ],
      courts: ['# 1','# 2','# 3','# 4','# 5'],
      startOptions: ["Now","5 min"],
      startTime: "Now",
      isGuest: false,
      player: null,
      players: []
    }
  },
  methods:{
    addPlayer: function (){
      if( this.players.length < 4 ){
        this.players.push(this.player)
        this.player = null
        this.isGuest = false
      }
    },
    removePlayer: function (player){
      console.log("Removing" + player)
    },
    isPlayerChosen: function (){
      return this.player != null
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
