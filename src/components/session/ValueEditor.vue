<template>

    <v-dialog
        v-model="show"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        max-width="500"
        persistent=""
      >
        <component :session="session" :is="selectedType" v-on:update:show="show = false"></component>
    </v-dialog>

</template>

<script>

import timeeditor from './TimeEditor'
import courteditor from './CourtEditor'

export default {
    props: ['session','visible','type'],
    components: {
    'timeeditor': timeeditor,
    'courteditor': courteditor
    },
    data () {
        return {
            selectedType: null
        }
    },
    watch: {
      show( value ){

        if( value )
          this.selectedType = this.type 
        else
          this.selectedType = null
      }
    },
    methods: {
      
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          this.$emit('update:visible', value)
        }
      }
    },
    mounted: function(){
      
    }
    
}
</script>
<style scoped>

</style>