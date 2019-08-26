<template>
  <v-layout fill-height >
    <v-layout v-if="loading" fill-height justify-center align-center>
      <v-progress-circular
      :size="70"
      :width="7"
      indeterminate
    ></v-progress-circular>
    </v-layout>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="sessioninfo" class="content">
      {{ sessioninfo.start }}
    </div>
  </v-layout>
</template>

<script>

import apihandler from './../services/db'

export default {
  props: ['id'],
  name: "sessiondetails",
  data: function() {
    return {
      loading: false,
      error: null,
      sessioninfo: null
    }
  },
  methods:{
    fetchData: function(){
      this.error = this.sessioninfo = null
      this.loading = true

      apihandler.getSessionDetails().then((val) =>{
        this.sessioninfo = val
      }).
      finally(()=>{
        this.loading = false
      })
    }
  },
  computed:{
    

  },
  watch:{
    //needed to get new data when route changes
    '$route': 'fetchData'
  },
  created () {
    //fetch data here
    this.fetchData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



</style>
