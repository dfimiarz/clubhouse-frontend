<template>

    <v-dialog
        v-model="show"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        max-width="500"
      >
        <component :session="session" :is="type"></component>
    </v-dialog>

</template>

<script>

import timeeditor from './SessionTimeEditor'
import courteditor from './SessionCourtEditor'

export default {
    props: ['session','visible','type'],
    components: {
    'timeeditor': timeeditor,
    'courteditor': courteditor
    },
    data () {
        return {
          
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