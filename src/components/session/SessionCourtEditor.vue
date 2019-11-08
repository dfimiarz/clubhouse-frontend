<template>

    <v-dialog
        v-model="show"
        :fullscreen="$vuetify.breakpoint.xsOnly"
        max-width="500"
      >
        <v-card tile="" height="100%">
          <v-toolbar
            flat
          >
            <v-btn
              icon
              dark
              @click="show = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Change Court</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text>
            <v-row v-if="error">
              <v-col cols="12">
                <v-alert type="error" dense=""> {{ error }} </v-alert>
              </v-col>
            </v-row>
            <v-row >
              <v-col cols="12">
                {{ session.court }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="changeCourt"
              >
                Save
              </v-btn>
          </v-card-actions>
        </v-card>
        
      </v-dialog>

</template>

<script>

//import apihandler from './../../services/db'

export default {
    props: ['session','visible'],
    data () {
        return {
          court: null,
          error: null
        }
    },
    methods: {
      allowedminutes: m => m % 5 === 0,
      changeCourt: function(){
        this.error = null
        this.loading = true

        // var params = {
        //   id: this.session.id,
        //   hash: this.session.updated,
        //   court: this.court
        // }

        

        // apihandler.changeTime(params).then(() => {
        //   this.$router.push({name: 'calendar'})
        // })
        // .catch((error) => {

        //   if (error.response) {
        //     this.error = error.response.data 
        //     console.log(error.response.status)
            
        //   } else if (error.request) {
        //     this.error = error.request
            
        //   } else {
        //     this.error = error.message
            
        //   }
          
        // })
        // .finally(()=>{
        //   this.loading = false
        // })
      }
    },
    watch: {
      show( value ){
        if( value ){
          //this.s_time = moment(this.session.date.concat('T',this.session.start)).format('HH:mm')
          this.court = this.session.court
        }
        else{
          this.error = null
          this.court = null
        }
      }
    },
    computed: {
      show: {
        get () {
          return this.visible
        },
        set (value) {
          this.$emit('update:visible', value)
        }
      },
      canChangeCourt: function(){
      return this.session.hasOwnProperty('permissions')    ?
              (Array.isArray(this.session.permissions)      ? 
              this.session.permissions.includes('CHANGE_COURT') : false) : false
      }
    },
    mounted: function(){
      
    }
    
}
</script>
<style scoped>

</style>