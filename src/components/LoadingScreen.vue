<template>
    <v-container class="fill-height fluid">
        <v-row v-if="! connected">
            <v-col class="text-center">
                <div class="my-2"><v-icon x-large>{{ disconnectIcon }}</v-icon><span class="text-body-1 text-lg-h6"> Connection Lost </span></div>
                <div class="text-caption">Waiting to reconnect...</div>
            </v-col>
        </v-row>
        <v-row v-else justify="center" align="center" class="text-body-1" dense>
            <v-col cols="12" class="text-center">
                GEO AUTH [ 
                <v-icon :color="geoInitColor">{{ checkOutlineIcon }}</v-icon>
                ]
                
            </v-col>
             <v-col cols="12" class="text-center">
                
                USER AUTH [
                <v-icon :color="userInitColor">{{ checkOutlineIcon }}</v-icon>
                ]
            </v-col>
             <v-col cols="12" class="text-center">
                SHARED DATA [
                <v-icon :color="dataLoadedColor">{{ checkOutlineIcon }}</v-icon>
                ]
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

    import { mdiLanDisconnect, mdiCheckOutline } from "@mdi/js";

    export default {
        data(){
            return {
                disconnectIcon: mdiLanDisconnect,
                checkOutlineIcon: mdiCheckOutline
            }
        },
        computed: {
            connected: function (){
                return this.$store.state.connected;
            },
            userInit: function(){
                return this.$store.state.userstore.userInitialized;
            },
            geoInit: function(){
                return this.$store.state.userstore.geoInitialized;
            },
            dataLoaded: function(){
                return this.$store.state.dataloaded;
            },
            userInitColor: function(){
                return this.userInit ? "success" : "warning"
            },
            geoInitColor: function(){
                return this.geoInit ? "success" : "warning"
            },
            dataLoadedColor: function(){
                return this.dataLoaded ? "success" : "warning"
            }
        }
    }
</script>