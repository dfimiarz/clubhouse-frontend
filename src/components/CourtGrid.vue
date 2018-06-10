<template>
  <div class="courtgrid">
    {{ message }}
  </div>
</template>

<script>
export default {
  name: 'CourtGrid',
  data() {
    return {
      message: "This is grid view"
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
