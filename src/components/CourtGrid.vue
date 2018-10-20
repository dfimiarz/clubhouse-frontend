
<template>
<v-container fluid fill-height>
  <v-layout justify-center align-center="">
    <v-flex shrink>
       <div class="courtgrid">
        <div>
          Show list of current sessions here
        </div>
        <div>
          <a v-bind:href="newSessionUrl">Add new session</a>
        </div>
      </div>
    </v-flex>
  </v-layout>
</v-container>
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
