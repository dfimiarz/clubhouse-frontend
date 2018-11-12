<template>
<v-container fluid fill-height>
  <v-layout justify-center="" align-center="">
    <v-flex xs12 lg10>
      <div class="title my-3"> {{ currentTitle }} </div>
      <v-window v-model="bookingStep">
        <v-window-item :value='1'>
          <v-slide-y-transition>
           <v-layout align-baseline="" justify-center="" wrap row="" class="my-2">
            <v-flex xs12>
              <v-card>
                <v-card-text>
                  <v-layout justify-space-around="" align-baseline="" row wrap class="my-3">
                    <v-flex xs12 md8 class="px-2">
                      <v-autocomplete
                      :items="members"
                      item-text="name"
                      item-value="id"
                      v-model="selectedMember"
                      return-object
                      >
                      </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 md4  class="px-2">
                      <v-btn-toggle v-model="repeater" >
                        <v-btn large="" color='green'>
                          R-1
                        </v-btn>
                        <v-btn large color='green'>
                          R-2
                        </v-btn>
                      </v-btn-toggle> 
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
          </v-layout>
          </v-slide-y-transition>
          <div v-if="! playersAdded()" class="title my-3 red--text">No players added!</div>
          <v-layout wrap="" row justify-space-between="" align-center="">
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
                    <div class="title">Player # {{ index + 1}}: {{ p.name }} - {{ p.repeater }}</div>
                  </v-flex>
                </v-layout>
              </v-card-text>
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
        </v-window-item>

        <v-window-item :value='2'>
          <v-select
            :items="courts"
            label="Court"
          >
          </v-select>
          <v-select
          v-model="startTime"
          :items="startOptions"
          label="Start Time:"
          ></v-select>
        </v-window-item>

        <v-window-item :value='3'>
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
        </v-window-item>

      </v-window>
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
      selectedMember: null,
      players: [],
      bookingStep: 1,
      title: "",
      repeater: 0
    }
  },
  methods:{
    addPlayer: function (){
      if( this.players.length < 4 ){
        var player = { repeater : this.repeater }
        this.players.push(Object.assign(player,this.selectedMember))
        this.selectedMember = null
        this.repeater = null
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
