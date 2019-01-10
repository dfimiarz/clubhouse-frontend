<template>
  <div class="sessioncell" :style="{top:  + getVpos() + 'px', height: getHeight() + 'px'}">
    <div class="session-container">
      <div class="display-1">
        <span>Doubles</span>
      </div>
      <div class="subheading"> 
        <div>
          N,R1,R1,R2
        </div>
        <div>
          Bumpable
        </div>
      </div>
    </div>
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
    return {}
  },
  methods:{
    getHeight: function(){
      return this.cellHeight1H / 60 * this.session.durMin
    },
    getVpos: function(){
      return this.cellHeight1H / 60 * this.session.startMin
    }
  },
  computed:{
    cellHeight1H: function(){
      return this.$store.getters['calCellHeight1H'];
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
  color: black;
  padding-left: 5px;
  padding-right: 5px;

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


</style>
