<template>
    <v-card>
        <v-card-title>
            <div class="display-1 text-xs-center">Booking Details</div>
        </v-card-title>
        <v-card-text>
        <v-layout fill-height="" row wrap justify-center="" align-start="">
            <v-flex xs12 sm6 >
                <v-layout fill-height="" align-center="" align-start="" row wrap>
                    <v-flex xs12 class='py-3'>
                        <div class="headline">Players:</div>
                    </v-flex>
                    <v-flex xs12>
                        <v-flex xs12 v-for="p in playerdetails" :key="p.number" class="py-1">
                            <div class="title">{{p.name}}</div>
                            <span class="body-1">{{ p.repeater }}</span>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm6 >
                <v-layout fill-height="" align-center="" align-start="" row wrap>
                    <v-flex xs12 class="py-3" >
                        <div class="headline">Session:</div>
                    </v-flex>
                    <v-flex xs12 class="py-1" v-if="courtid">
                        <div class="caption">Court</div>
                        <span class="title">{{ courtid }}</span>
                    </v-flex>
                    <v-flex xs12 class="py-1">
                    <div class="caption">Bumpable</div>
                    <span class="title">No</span>
                    </v-flex>
                    <v-flex xs12>
                    <v-select
                        :items = sessionDurations
                        item-text="label"
                        item-value="value"
                        label="Desired duration"
                    ></v-select>
                    </v-flex>
                    <v-flex xs12>
                    <v-select
                        :items = sessionStarts
                        label="Start"
                    ></v-select>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        </v-card-text>
        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green">Book</v-btn>
        </v-card-actions>
    </v-card>    
</template>

<script>
export default {
  name: "SesssionBooker",
  props: {
      playerdetails:{
          type: Array,
          required: true
      },
      courtid:{
          type: Number,
          default: null
      }
        
    },
  data: function() {
    return {
        
    }
  },
  watch: {
     
  },
  methods: {
      
  },
  computed: {
    sessionDurations: function(){
      return [{"value":60,"label":"60 min"},
              {"value":50,"label":"50 min"},
              {"value":40,"label":"40 min"},
              {"value":30,"label":"30 min"},
              {"value":20,"label":"20 min"},
              {"value":10,"label":"10 min"}]
    },
    sessionStarts: function(){
      return ['Now', 'In 5 min']
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
