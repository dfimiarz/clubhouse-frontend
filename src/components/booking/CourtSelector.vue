<template>
    <v-card
        raised=""
        class="mx-2"
    >
        <v-img
        class="white--text"
        height="150px"
        src="../court.jpg"
        >
            <v-container fill-height fluid>
                <v-layout justify-start="" align-start="">
                <v-flex xs12>
                    <div class="display-1 text-xs-center">Court {{ label }}</div>
                </v-flex>
                </v-layout>
            </v-container>
        </v-img>
        <v-card-title primary-title>
            <div>
                <div class="headline">Available now</div>
                <div class="body-1">Free for next 2 hours</div>
            </div>
        </v-card-title>
        <v-divider light></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="selectCourt()" large="">Select</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
  name: "CourtSelector",
  props: {
        id:{
          type: Number,
          required: true
        },
        label: {
          type:String,
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
          
          this.$emit('update:court', this.id )
      }
  },
  computed: {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
