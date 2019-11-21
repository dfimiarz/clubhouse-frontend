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
    
    vpos: function(){
      return this.thickness * (this.currmin - this.openMin)
    },
    openMin: function(){
      return this.$store.getters['openMin'];
    },
    
    currmin: function(){
      return this.currtime.getHours() * 60 + this.currtime.getMinutes()
      
    }
    

  },
  watch: {
    vpos: {
      handler: function(val){
        this.$emit('change:pos',val)
      },
      immediate: true
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
