<template>
  <div class="sessioncell" :style="{top:  + getVpos() + 'px', height: getHeight() + 'px'}"> 
      <v-layout row wrap fill-height="" class="session_container_new" align-start="" align-content-start="">
        <!-- <v-flex xs6 >
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

        </v-flex> -->
        <v-flex xs12 >
          <v-layout row wrap fill-height="" align-content-space-between="">
            <v-flex xs12>
              <span class="body-2">Players:</span>
                <span v-for="(player,index) in players" :key="index" :class="['ma-1','body-2',getPlayerClass(player)]">
                  {{ player.firstname }}
                </span>
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
      
    }
  },
  methods:{
    getHeight: function(){
      return this.cellHeight1H / 60 * this.session.durationMin
    },
    getVpos: function(){
      return this.cellHeight1H / 60 * (this.session.startMin - this.openMin)
    },
    getPlayerClass(player){
      
      var bgcolor = "white"

      if( player.repeater == 1) 
        bgcolor = "yellow lighten-3"
      
      if( player.repeater == 2) 
        bgcolor = "red lighten-2"

      return bgcolor
      

    }
  },
  computed:{
    cellHeight1H: function(){
      return this.$store.getters['calCellHeight1H'];
    },
    openMin: function(){
      return this.$store.getters['openMin'];
    },
    players: function(){
      return this.session.players === null ? [] : this.session.players
      
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
