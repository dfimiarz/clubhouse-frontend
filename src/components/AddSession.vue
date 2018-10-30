
<template>
  <v-container fluid fill-height="" >
    <v-layout justify-space-around="" align-start wrap="">
      <v-flex  sm12 md10 lg6>
        <v-tabs
          
        >
          <v-tab
            v-for="tab in tabs"
            :key="tab.key"
            @click="currentTab = tab.component"
          >
            <div class="header"> {{ tab.name }}</div>
    
          </v-tab>
          <v-tab-item
            transition="fade-transition"
            reverse-transition="fade-transition"
            v-for="tab in tabs"
            :key="tab.key"
          >
            <component v-bind:is="currentTabComponent"></component>
          </v-tab-item>
        </v-tabs>
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
