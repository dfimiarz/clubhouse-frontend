
<template>
  <v-container fluid fill-height="" >
    <v-layout justify-space-around="" align-start wrap="">
      <v-flex  sm12 lg10 xl8>
        <regular-match-booking></regular-match-booking>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import RegularMatchBooking from './RegularMatchBooking'
import SpecialEventBooking from './SpecialEventBooking'


export default {
  components:{
    RegularMatchBooking,
    SpecialEventBooking
  },
  name: 'Booking',
  data: function () {
      return {
        tabs: [
          { name: "Regular Match", key: "RM", text: "Regular Match", component: "RegularMatchBooking"},
          { name: "Special Event", key: "SE", text: "Special Event", component: "SpecialEventBooking"},

        ],
        currentTab: "RegularMatchBooking"
        
      }
  },
  methods: {
    

  },
  computed: {
    currentTabComponent: function() {
      return this.currentTab
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
