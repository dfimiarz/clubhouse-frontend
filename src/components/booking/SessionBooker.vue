<template>
    <v-card>
        <v-card-title>
            <div class="display-1 text-xs-center">Booking Details</div>
        </v-card-title>
        <v-card-text>
        <v-layout fill-height="" row wrap justify-center="" align-start="">
            <v-flex xs12 sm6 >
                <v-layout fill-height="" align-center="" align-start="" row wrap>
                    <v-flex xs12 class='py-2'>
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
                    <v-flex xs12 class="py-2" >
                        <div class="headline">Session:</div>
                    </v-flex>
                    <v-flex xs12 class="py-1">
                        <v-layout fill-height="" justify-start="">
                            <v-flex xs6>
                                <div class="caption">Court</div>
                                <span class="title">{{ courtdetails.label }}</span>
                            </v-flex>
                            <v-flex xs6>
                                <div class="caption">Available time:</div>
                                <span class="title">{{ courtdetails.freefor / 60000 }} min</span>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 class="py-1">
                        <v-layout fill-height="" justify-start="">
                            <v-flex xs6>
                                <div class="caption">Bumpable</div>
                                <span class="title">{{ bumpable ? 'Yes' : 'No' }}</span>
                            </v-flex>
                            <v-flex xs6>
                                <div class="caption">Max allowed time:</div>
                                <span class="title">{{ maxallowedtime / 60000 }} min</span>
                            </v-flex>
                        </v-layout>
                    </v-flex>

                    <v-flex xs12 class="mt-3">
                        <v-select
                            :items = durations
                            item-text="label"
                            item-value="value"
                            label="Desired duration"
                            outline
                        ></v-select>
                    </v-flex>
                        <v-flex xs12>
                        <v-select
                            :items = sessionStarts
                            label="Start"
                            outline
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
        maxallowedtime: 35 * 60 * 1000,
        bumpable: false
    }
  },
  watch: {
    
  },
  methods: {
      getCourtDetails(){
          console.log("Updating info for court" + this.courtid)
          this.courtdetails = this.$store.getters['courtstore/getCourtInfo'](this.courtid)
      }
      
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
    },
    courtdetails: function(){

        if( this.courtid != null ){
            return this.$store.getters['courtstore/getCourtInfo'](this.courtid)
        } else{
            return { label: 'NA', freefor : 0, freein: 0 }
        }
    },
    maxplaytime: function(){
        return Math.min(this.courtdetails.freefor,this.maxallowedtime)
    },
    durations: function(){

        //initialize empty array
        const choices = []

        //get the max time
        const maxt = this.maxplaytime;

        //set value to min start duration
        let val = 600000;

        //increment val until it is > maxt
        while(val <  maxt){
            const min = val/60000
            choices.push({"value": min,"label":min + " min"})
            val += 600000;
        }

        choices.push({"value": maxt,"label":maxt/60000 + " min"})

        //Returned revsersed array
        return choices.reverse()
    }
    

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
