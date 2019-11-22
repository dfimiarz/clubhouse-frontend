<template>
  <div class="timeindicator" :style="{'top':  + vpos + 'px', 'border-top-width': + thickness + 'px'  }"> 
  </div>
</template>

<script>
export default {
  props: {
    currtime: {
      required: true,
      type: Date
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
    /**
     * Compute vertical position taking into account the start and end time
     */
    vpos: function(){
      
      var adj_currmin = this.currmin <= this.openMin ? this.openMin : this.currmin >= this.closeMin ? (this.closeMin - this.thickness) : this.currmin
      
      return this.thickness * (adj_currmin - this.openMin)
      
    },
    openMin: function(){
      return this.$store.getters['openMin'];
    },
    closeMin: function(){
      return this.$store.getters['closeMin'];
    },    
    currmin: function(){
      return this.currtime.getHours() * 60 + this.currtime.getMinutes()
      
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
