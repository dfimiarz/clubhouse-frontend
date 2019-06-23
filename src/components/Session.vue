<template>
  <div class="sessioncell" :style="{top:  + getVpos() + 'px', height: getHeight() + 'px'}"> 
      <v-layout row wrap fill-height="" class="session_container_new" align-start="" align-content-start="">
        <v-flex xs6 >
          <v-layout row wrap fill-height="" align-content-space-between="">
            <v-flex xs12>
              <div class="body-2">Match</div>
            </v-flex>
            <v-flex xs12>
              <div class="caption">9:00 am - 10:30 am</div>
            </v-flex>
            <v-flex xs12>
              <div class="caption">Bumpable at: 10:15</div>
            </v-flex>
          </v-layout>

        </v-flex>
        <v-flex xs6 >
          <v-layout row wrap fill-height="" align-content-space-between="">
            <v-flex xs12>
              <div class="body-2">Players:</div>
              <div>
                <span v-for="player in players" :key="player.id" class="caption">
                  {{ player.name }} - {{ player.repeater }},
                </span>
              </div>
            </v-flex>
            
          </v-layout>
        </v-flex>
        
      </v-layout> 
    
  </div>
</template>

<script>
export default {
  props: {
    session: {
      type: Object,
      required: true
    }
  },
  name: "session",
  data: function() {
    return {
      players: [
        { name: "L.M.", repeater:"R1", id:1},
        { name: "J.T", repeater:"R1", id:2},
        { name: "T.S", repeater:"R1", id:3},
        { name: "J.D", repeater:"R1", id:4},
      ]
    }
  },
  methods:{
    getHeight: function(){
      return this.cellHeight1H / 60 * this.session.durMin
    },
    getVpos: function(){
      return this.cellHeight1H / 60 * (this.session.startMin - this.startMin)
    }
  },
  computed:{
    cellHeight1H: function(){
      return this.$store.getters['calCellHeight1H'];
    },
    startMin: function(){
      return this.$store.getters['startHour'] * 60;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sessioncell {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  padding: 2px 5px;

}

.session-container{
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content:space-evenly;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: rgba(139,195,74,0.8);
  border: 2 px solid;
  border-radius: 3px;
  box-shadow: 2px 3px black;
  padding: 5px;

}

.session_container_new{
  overflow: hidden;
  background-color: rgba(139,195,74,0.8);
  border: 2 px solid;
  border-radius: 3px;
  box-shadow: 2px 2px black;
  color: black;
}


</style>
