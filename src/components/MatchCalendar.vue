
<template>
<v-container fluid fill-height="">
  <v-layout justify-start="" align-content-start="" row wrap>
    <v-flex xs12 >
      Top
    </v-flex>
    <v-flex xs12 >
       <div class="hidden-sm-and-down" >Large version</div>
       <div class="hidden-md-and-up" >Small version</div>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: 'MatchCalendar',
  data() {
    return {
      message: "This is grid view"
    }
  },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
