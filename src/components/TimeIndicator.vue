<template>
  <div class="timeindicator" :style="{'top':  + vpos + 'px', 'border-top-width': + thickness + 'px'  }"> 
  </div>
</template>

<script>

import moment from 'moment-timezone'

export default {
  props: {
    currtime: {
      required: true,
      type: String
    }
  },
  name: "timeindicator",
  data: function() {
    return {
      thickness: 2
    }
  },
  methods:{
    
  },
  computed:{
    clubtz: function(){
       return this.$store.state.clubtz
    },
    /**
     * Compute vertical position taking into account the start and end time
     */
    vpos: function(){
      
      var adj_currmin = this.currmin <= this.startMin ? this.startMin : this.currmin >= this.endMin ? (this.endMin - this.thickness) : this.currmin
      
      return this.thickness * (adj_currmin - this.startMin)
      
    },
    openMin: function(){
      return this.$store.getters['openMin'];
    },
    closeMin: function(){
      return this.$store.getters['closeMin'];
    },    
    currmin: function(){
      
      return moment(this.currtime).tz(this.clubtz).hour() * 60 + moment(this.currtime).tz(this.clubtz).minute()
      
    },
    startMin: function(){
      return Math.floor(this.openMin/60)*60;
    },
    endMin: function(){
      return Math.ceil(this.closeMin/60)*60;
    }
    

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.timeindicator {
  position: absolute;
  width: 100%;
  border-top-color: yellowgreen;
  border-top-style: dashed;
  height: 0px;

}



</style>
