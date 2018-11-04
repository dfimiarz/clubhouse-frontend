<template>
<v-container fluid fill-height>
  <v-layout justify-start="" align-center="">
    <v-flex xs12 lg8>
      <v-layout justify-center="" align-baseline="" v-if="canAddPlayer()" class="my-4">
        <v-autocomplete
        
        :items="members"
        item-text="name"
        item-value="id"
        v-model="player"
        label="Find a member"
        :disabled="! canAddPlayer()"
        return-object
        >
        </v-autocomplete>
        <v-btn color="pink" fab shrink small @click="addPlayer()">
          Add
        </v-btn>
      </v-layout>
        

      <div v-if="! playersAdded()" class="title my-3 red--text">0 players selected</div>
      <v-layout wrap="" row justify-space-between="" align-center="">
        <v-flex 
          v-for="(p, index) in players"
          :key=p.id
          xs12
          class="mb-2"
        >
        <v-card 
          raised=""
        
        >
          <v-card-title primary-title>
            <v-layout wrap="" row justify-start="" align-baseline="">
              <v-flex xs12>
                <div class="title">Player # {{ index + 1}}: {{ p.name }}</div>
              </v-flex>
              <v-flex xs12>
                <v-radio-group v-model="row" row>
                  <v-radio label="New" value="0"></v-radio>
                  <v-radio label="R1" value="1"></v-radio>
                  <v-radio label="R2" value="2"></v-radio>
                </v-radio-group>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions>

            <v-spacer></v-spacer>
            <v-btn @click="removePlayer(p)" small>
              Remove
            </v-btn>
          </v-card-actions>
        </v-card>
        </v-flex>
      </v-layout>
      
        
      <v-select
        :items="courts"
        label="Court"
      ></v-select>
        <v-select
        v-model="startTime"
        :items="startOptions"
        label="Start Time:"
      ></v-select>

      <v-text-field
          label="Player #1 PIN"
          type="password"
          class="shrink"
        ></v-text-field>
      <div class="my-2" v-if="playersAdded()">
        <div class="headline">Maximum time: {{maxGameTime}} min. Bumpable</div>
      </div>
      <v-btn :disabled="! playersAdded()">
          Start Match
      </v-btn>
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
        {name: 'Todd Snyder', id: 1, role: 'member'},
        {name: 'Laurent Mars', id: 2, role: 'member'},
        {name: 'Jun Tsuchiya', id: 3, role: 'member'},
        {name: 'Ardis Burfield', id: 4, role: 'member'},
        {name: 'Boris Alter', id: 5, role: 'member'}
      ],
      courts: ['# 1','# 2','# 3','# 4','# 5'],
      rstatus: ['No','R1','R2'],
      startOptions: ["Now","5 min"],
      startTime: "Now",
      player: null,
      players: []
    }
  },
  methods:{
    addPlayer: function (){
      if( this.players.length < 4 && this.player != null ){
        this.players.push(this.player)
        this.player = null
      }
    },
    removePlayer: function (player){
      this.players.splice(this.players.indexOf(player), 1)
    },
    isPlayerChosen: function (){
      return this.player != null
    },
    playersAdded: function() {
      return this.players.length > 0
    },
    canAddPlayer: function(){
      return this.players.length < 4
    }
  },
  computed: {
    maxGameTime: function(){
      return this.players.length * 30
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.player_container{
  /*font-size: calc(10px + 1vw);*/
  border: 1px dashed;
}
</style>
