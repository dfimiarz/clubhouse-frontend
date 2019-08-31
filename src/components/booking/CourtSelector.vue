<template>
    
    <v-card
        raised=""
        class="mx-2"
        height="100%"
        @click="selectCourt"
    >
        <v-layout fill-height="" row wrap>
            <v-flex xs12 class="pb-2">
                <v-img
                class="white--text"
                height="120px"
                src="@/assets/court.jpg"
                >
                    <v-container fill-height fluid>
                        <v-layout justify-center="" align-center="">
                            <v-flex xs12>
                                <div style="text-shadow: 2px 2px #000000;">
                                    <div class="display-1 text-xs-center">Court {{ court.label }}</div>
                                    <div class="title text-xs-center">{{ court.statelbl }}</div>
                                </div>
                                
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-img>
                <v-card-title primary-title>
                    <div>
                        <div class="headline">{{ court.status.label }}</div>
                        <div class="caption">{{ court.status.caption }}</div>
                    </div>
                </v-card-title>
                <v-card-text v-show="court.msg" class="caption">
                <div v-for="(msg,index) in court.msg" :key="index">
                    <div class="cation">{{ msg }} </div>
                </div>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-card>
    
</template>

<script>
export default {
  name: "CourtSelector",
  props: {
        court:{
            type: Object,
            required: true
        }
    },
  data: function() {
    return {
        
    }
  },
  watch: {
     
  },
  methods: {
      selectCourt: function(){
          if( this.court.bookable ){
              this.$emit('update:court', this.court.id )
          }
          
      }
  },
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
