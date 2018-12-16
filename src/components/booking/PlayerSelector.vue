<template>
    <v-card
    raised=""
    class="mx-2" 
    height="300"
    >
        <v-layout fill-height="" align-center="" row wrap>
            <v-flex xs12>
                <v-card-text>
                    <v-layout justify-start="" align-baseline="" row wrap >
                        <v-flex xs12 >
                            <div class="headline">Player #: {{ index + 1 }}</div>
                        </v-flex>
                        <v-flex xs12 class="pt-2">
                            <v-autocomplete
                            :items="clubMembers"
                            item-text="name"
                            item-value="id"
                            v-model="memberid"
                            label="Player name:"
                            clearable
                            :error-messages="this.errors"
                            solo
                            >
                            </v-autocomplete>
                        </v-flex>
                        <v-flex xs12>
                            <v-select
                            v-model="repeater"
                            :items="items"
                            label="Repeater status:"
                            item-text="label"
                            item-value="value"
                            solo
                            ></v-select>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-flex>
            <v-flex xs12>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn fab small @click="removeSlot()">
                        <v-icon>remove</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
export default {
  name: "PlayerSelector",
  props: {
        index: {
          type:Number,
          required: true
        },
        player: {
          type: Object,
          default: function(){
              return { memberid: undefined, repeater: undefined }
          }
        },
        errors: {
            type: Array,
            default: function(){
                return []
            }
        }
    },
  data: function() {
    return {
        items: [
            {value: 0, label: 'Non-repeater'},
            {value: 1, label: 'First repeater'},
            {value: 2, label: 'Second repeater'}
        ]
    }
  },
  watch: {
     
  },
  methods: {
      removeSlot: function(){
          
          this.$emit('update:remove', this.index )
      }
  },
  computed: {
    clubMembers: function(){
       return this.$store.getters['memberstore/clubMembers'] 
    },
    memberid: {
        get: function(){
            return this.player.memberid
        },
        set: function(newPlayerId){
           var updatedPlayer = { index: this.index, id: newPlayerId }
           this.$emit('update:player', updatedPlayer )
        }
    },
    repeater: {
        get: function(){
            return this.player.repeater
        },
        set: function(newRepeaterValue){
           var repeaterInfo = { index: this.index, repeater: newRepeaterValue }
           this.$emit('update:repeater', repeaterInfo )
        }
    } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
