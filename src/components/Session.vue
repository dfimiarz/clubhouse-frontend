<template>
  <div class="sessioncell" :style="{top:  + getVpos() + 'px', height: getHeight() + 'px'}"> 
      <v-layout row wrap fill-height="" class="session_container_new" align-start="" align-content-start="">
        <v-flex xs12 >
          <v-layout row wrap fill-height="" align-content-space-between="">
            <v-flex xs12>
              <span class="body-2">Players:</span>
                <span v-for="(player,index) in players" :key="index" :class="['ma-1','body-2',getPlayerClass(player)]">
                  {{ formatPlayerName(player) }}
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
      return this.cellHeight1H / 60 * this.duration
    },
    getVpos: function(){
      return this.cellHeight1H / 60 * (this.startMin - this.openMin)
    },
    getPlayerClass(player){
      
      var bgcolor = "white"

      if( player.repeater == 1) 
        bgcolor = "yellow lighten-3"
      
      if( player.repeater == 2) 
        bgcolor = "red lighten-2"

      return bgcolor
      

    },
    /**
     * @returns { string } Player name formated
     */
    formatPlayerName: function(player){
      const lastname = player.lastname == null ? ""   :
             player.lastname.lenght <= 1 ? player.lastname : 
             player.lastname.substr(0,1)
    
      const firstname = player.firstname == null ? "" : player.firstname

      return firstname + " " + lastname + "."
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
      
    },
    duration: function(){
      return this.endMin - this.startMin
    },
    startMin: function(){
      let s_dt = new Date(this.session.start)
      return s_dt.getHours() * 60 + s_dt.getMinutes()
      //return this.session.startmin
    },
    endMin: function(){
      let e_dt = new Date(this.session.end)
      return e_dt.getHours() * 60 + e_dt.getMinutes()
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
