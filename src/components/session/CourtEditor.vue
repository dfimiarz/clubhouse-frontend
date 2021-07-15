<template>

  <v-card tile="" height="100%">
    <v-toolbar
      flat
      dense
    >
      <v-btn
        icon
        dark
        @click="close"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Change Court</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-row v-if="error" class="my-2" no-gutters>
        <v-col cols="12">
          <v-alert type="error" outlined> {{ error }} </v-alert>
        </v-col>
      </v-row>
      <v-row class="my-2" no-gutters>
        <v-col cols="12">
          <v-select
            label="Court"
            :items="courts"
            item-value="id"
            item-text="name"
            required=""
            :rules="[ rules.required ]"
            v-model="court"
          >
            
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
          color="primary"
          text
          @click="changeCourt"
          :loading="loading"
        >
          Save
        </v-btn>
    </v-card-actions>
  </v-card>

</template>

<script>

import apihandler from './../../services/db'
import { editor } from './EditorMixin'
import processAxiosError from "../../utils/AxiosErrorHandler";

export default {
    props: ['session'],
    mixins: [editor],
    data () {
        return {
          court: null,
          rules: {
            required: value => !!value || 'Required'
          },
        }
    },
    methods: {
      changeCourt: function(){
        this.error = null
        this.loading = true

        var params = {
           id: this.session.id,
           hash: this.session.etag,
           court: this.court
        }

        apihandler.changeCourt(params).then(() => {
          this.$router.push({name: 'calendar'})
        })
        .catch((e) => {
            this.error = processAxiosError(e);
        })
        .finally(()=>{
          this.loading = false
        })
      }
    },
    computed: {
      canChangeCourt: function(){
      return Object.prototype.hasOwnProperty.call(this.sessioninfo,"permissions")    ?
              (Array.isArray(this.session.permissions)      ? 
              this.session.permissions.includes('CHANGE_COURT') : false) : false
      },
      courts: function(){
        return this.$store.getters['courtstore/getCourts']
      },
    },
    mounted: function(){
      this.court = this.session.court
    }
    
}
</script>
<style scoped>

</style>