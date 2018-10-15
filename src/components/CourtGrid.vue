<template>
  <div class="courtgrid">
    <div>
      Show list of current sessions here
    </div>
    <div>
      <a v-bind:href="newSessionUrl">Add new session</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourtGrid',
  data() {
    return {
      message: "This is grid view",
      newSessionUrl: './sessions/new'
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
