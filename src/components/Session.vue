<template>
  <div class="sessioncell" :style="{top:  + vpos + 'px', height: height + 'px'}" @click="sessionClicked"> 
      <v-row :class="sessionStyle()" align="start" style="height: 100%;" no-gutters="">
        <v-col cols="12">
              <span>Players:</span>
              <span v-for="(player,index) in players" :key="index" :class="['ma-1',getPlayerClass(player)]">
                {{ formatPlayerName(player) }}
              </span>
        </v-col>
      </v-row> 
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

      if( player.repeater == 2000) 
        bgcolor = "yellow lighten-3"
      
      if( player.repeater == 3000) 
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
    },
    sessionClicked: function(){
      this.$router.push({ name: 'SessionDetails', params: { id: this.session.id } })
    },
    sessionStyle: function(){
      let styles = []
      styles.push('session_container')
      styles.push(this.height >= (this.cellHeight1H / 4) ? 'body-2' : 'small_container')
      styles.push(this.session.bumpable == 1 ? 'bump_session' : 'nbump_session')
      return styles

    }
  },
  computed:{
    height: function(){
      const _height = this.cellHeight1H / 60 * this.duration
      return _height <= 20 ? 20 : _height 
    },
    vpos: function(){
      return this.cellHeight1H / 60 * (this.startMin - this.openMin)
    },
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
      
      let s_dt = new Date(this.session.date.concat('T',this.session.start))
      return s_dt.getHours() * 60 + s_dt.getMinutes()
      
    },
    endMin: function(){
      let e_dt = new Date(this.session.date.concat('T',this.session.end))
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

.session_container{
  overflow: hidden;
  border-radius: 3px;
  box-shadow: 2px 2px black;
  color: black;
}

.small_container{
  font-size: x-small;
}

.nbump_session {
  background-color: rgba(139,195,74,0.8);
}

.bump_session {
  background-color: rgba( 215,109,82, 0.8);
}


</style>
