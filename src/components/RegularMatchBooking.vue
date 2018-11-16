<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-center="">
    <v-flex xs12 lg10>
      <div class="title my-3"> {{ currentTitle }} </div>
          <div v-if="! playersAdded()" class="title my-3 red--text">No players added!</div>
          <v-layout wrap="" row justify-start="" align-center="">
            <v-flex 
              v-for="(p, index) in players"
              :key=p.id
              xs12 lg6 
              class="mb-2"
            >
            <v-card 
              raised=""
              class="mx-2"
            >
              <v-card-text primary-title>
                <v-layout wrap="" row justify-start="" align-baseline="">
                  <v-flex xs12>
                    <div class="body-1">Player # {{ index + 1}}</div>
                  </v-flex>
                  <v-flex xs12>
                    <div class="subheading">{{ p.name }}</div>
                  </v-flex>
                  <v-flex xs12>
                    <div class="caption">Repeater: {{ p.repeater }}</div>
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn-toggle v-model="p.repeater" >
                  <v-btn large="" color='green' value="R1">
                    R-1
                  </v-btn>
                  <v-btn large color='green' value="R2">
                    R-2
                  </v-btn>
                </v-btn-toggle> 
                <v-spacer></v-spacer>
                <v-btn @click="removePlayer(p)" fab small>
                  <v-icon> remove </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-flex>
            <v-flex xs12 md6 class="mb-2" v-if="canAddPlayer()" >
              <v-card
                raised=""
                class="mx-2"
              >
                <v-card-text>
                  <v-layout justify-start="" align-center="" row wrap >
                    <v-flex xs12 class="px-2">
                      <v-autocomplete
                      :items="members"
                      item-text="name"
                      item-value="id"
                      v-model="selectedMember"
                      return-object
                      label="Add a player"
                     
                      >
                      </v-autocomplete>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-btn small>
                      Member
                    </v-btn>
                    <v-btn small>
                      Guest
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn :disabled="! canAddPlayer()" @click="addPlayer()">
                      Add
                    </v-btn>
                  </v-card-actions>
                
              </v-card>
            </v-flex>
          </v-layout>
          <!--
          <v-layout align-center="" justify-end="" wrap row="" class="my-1" v-if="canAddPlayer()">
            <v-flex xs12 md6 >
              <v-card>
                <v-card-text>
                  <v-layout justify-start="" align-center="" row wrap >
                    <v-flex xs12 class="px-2">
                      <v-autocomplete
                      :items="members"
                      item-text="name"
                      item-value="id"
                      v-model="selectedMember"
                      return-object
                     
                      >
                      </v-autocomplete>
                    </v-flex>
                  </v-layout>
                </v-card-text>
                <v-card-actions>
                  
                    <v-spacer></v-spacer>
                    <v-btn :disabled="! canAddPlayer()" @click="addPlayer()">
                      Add Player
                    </v-btn>
                  </v-card-actions>
                
              </v-card>
            </v-flex>
          </v-layout>-->
        
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
      startOptions: ["Now","5 min"],
      startTime: "Now",
      selectedMember: null,
      players: [],
      bookingStep: 1,
      title: "",
      rstatus: null
    }
  },
  methods:{
    addPlayer: function (){
      console.log(this.rstatus)
      if( this.players.length < 4 && this.selectedMember ){
        var player =  { repeater : null } 
        console.log( Object.assign( player , this.selectedMember))
        this.players.push(player)
        this.selectedMember = null
        this.rstatus = null
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
    },
    currentTitle: function(){
      switch( this.bookingStep ){
        case 1: return 'Step 1: Select players:'
        case 2: return 'Step 2: Select a court'
        default: return 'Step 3: Confirm'
      }
    }
  },
  created: function(){
    
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
