<template>
  <div class="matchcell" :style="{top:  + vpos + 'px', height: height + 'px'}">
    Mars
  </div>
</template>

<script>
export default {
  props: ['vpos', 'height'],
  name: "Match",
  data: function() {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.matchcell {
  position: absolute;
  border: 2 px solid;
  background-color: rgba(139,195,74,0.8);
  width: 100%;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 2px 3px black;
  color: black;
  padding: 5px;
}
</style>
