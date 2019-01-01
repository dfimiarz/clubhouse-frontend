<template>
    <v-card>
        <v-card-title>
            <div class="display-1 text-xs-center">Booking Details</div>
        </v-card-title>
        <v-card-text>
        <v-layout fill-height="" row wrap justify-center="" align-start="">
            <v-flex xs12 sm6 >
                <v-layout fill-height="" align-center="" align-start="" row wrap>
                    <v-flex xs12 class='py-1'>
                        <div class="headline">Players:</div>
                    </v-flex>
                    <v-flex xs12 v-for="p in playerDetails" :key="p.number" class="py-1">
                        <div class="title">#{{p.number}}: {{p.name}}</div>
                        <span class="body-1">{{ p.repeater }}</span>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 sm6 >
                <v-layout fill-height="" align-center="" align-start="" row wrap>
                    <v-flex xs12 class="py-1" >
                        <div class="headline">Court: {{courtdetails.label }}</div>
                    </v-flex>
                    <v-flex xs12 class="py-1">
                        <v-layout fill-height="" justify-start="">
                            <v-flex xs6>
                                <div class="caption">Available at:</div>
                                <span class="title">{{ courtdetails.startat | relativetime }}</span>
                            </v-flex>
                            <v-flex xs6>
                                <div class="caption">Free untill:</div>
                                <span class="title">{{ courtdetails.endat | ustime }}</span>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 class="py-1" >
                        <div class="headline">Session:</div>
                    </v-flex>
                    <v-flex xs12 class="py-1">
                        <v-layout fill-height="" justify-start="">
                            <v-flex xs6>
                                <div class="caption">Bumpable</div>
                                <span class="title">{{ sessionrules.bumpable ? 'Yes' : 'No' }}</span>
                            </v-flex>
                            <v-flex xs6>
                                <div class="caption">Maximum duration:</div>
                                <span class="title">{{ sessionrules.maxduration / 60000 }} min</span>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12 class="mt-2">
                        <v-select
                            v-model="startdelay"
                            :items="sessionStarts"
                            item-text="text"
                            item-value="value"
                            label="Start"
                            outline
                        ></v-select>
                        <div>
                            Est. Start Time: {{ sessionStartTime | ustime }}
                        </div>
                        <div>
                            Est. End Time: {{ sessionEndTime | ustime }}
                        </div>
                        
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        </v-card-text>
        <v-card-actions>
            <v-btn small>Start Over</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="green" large>Book</v-btn>
        </v-card-actions>
    </v-card>    
</template>

<script>
export default {
  name: "SesssionBooker",
  props: {
      players:{
          type: Array,
          required: true
      },
      courtid:{
          type: Number,
          default: null
      }
        
    },
  filters: {
        ustime: function(time_ms){
            const date = new Date(time_ms)
            return date.toLocaleTimeString('en-US');
        },
        relativetime: function(time_ms){
            const now_ms = new Date()
            const date = new Date(time_ms)

            if( time_ms <= now_ms  ){
                return "Now"
            }
            else{
                return date.toLocaleTimeString('en-US')
            }
        }
  },
  data: function() {
    return {
        startdelay: 0
    }
  },
  watch: {
    
  },
  methods: {
  },
  computed: {
    playerDetails: function(){

      return this.players.map( (player) => {
          

          const member = this.$store.getters['memberstore/getMemberById'](player.id)
          const repeaterDetails = this.$store.getters['getRepeaterType'](player.repeater)

          if( ! (member && repeaterDetails) ){
            
            return { name: null, repeater: null, number: null }
          }

          return { name: member.name, repeater: repeaterDetails.label, number: player.number }
          
          
        })
       
    },
    sessionStarts: function(){
      return [ 
                {text: 'Now', value:0},
                {text: 'In 5 min', value: 5 * 60000}
            ]
    },
    courtdetails: function(){

        if( this.courtid != null ){
            return this.$store.getters['courtstore/getCourtInfo'](this.courtid)
        } else{
            return { label: 'NA', startat: 0, endat: 0 }
        }
    },
    configCode: function(){
        return this.players.reduce( (cur_val,player) => {
            
            let val = 0

            switch (player.repeater) {
                case 0:
                    val = 100
                    break;
                case 1:
                    val = 10
                    break;
                case 2:
                    val = 1
                    break;
                default:
                    val = 0
                    break;
            }

            return val + cur_val
        },0)
    },
    sessionrules: function(){
        const rule = this.$store.getters['getBookingRule'](this.configCode)

        if( rule == null ){
           return { bumpable: 'NA', maxduration : 0 } 
        }
        else
        {
            return { bumpable: rule.bumpable, maxduration : rule.maxduration }
        }
    },
    sessionEndTime: function(){

        const endtime =  this.sessionStartTime + this.sessionrules.maxduration + this.startdelay
        const timelimit = this.courtdetails.endat
        return endtime > timelimit ? timelimit : endtime  
    },
    sessionStartTime: function(){
        const now = new Date();
        const nowms = now.getTime()
        const startTime =  nowms + this.startdelay
        const availabletime = this.courtdetails.startat
        return startTime < availabletime ? availabletime : startTime  
    },

    

    

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
