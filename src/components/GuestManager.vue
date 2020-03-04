<template>
    <v-container fluid="">
         <v-row no-gutters="" dense="" justify="center">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
            <v-toolbar
                flat
                dense
                
            >

                <v-toolbar-title>Guests</v-toolbar-title>

                <v-spacer></v-spacer>

                <template v-slot:extension>
                    <v-tabs
                    v-model="tab"
                    align-with-title
                    >
                    <v-tabs-slider color="yellow"></v-tabs-slider>

                    <v-tab :to="{name: 'guestregistration'}">
                        ADD GUEST
                    </v-tab>
                    <v-tab :to="{name: 'guestinfo'}">
                        GUEST INFO
                    </v-tab>
                   
                    </v-tabs>
                </template>
            
            </v-toolbar>
            </v-col>
            
         </v-row>
        <v-row no-gutters="" dense="" justify="center">
            <v-col cols="12" sm="10" md="8" lg="6" xl="4">
                <router-view></router-view>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
  name: "MemberManager",
  data: function() {
    return {
        tab: null,
        items: [
          'add guest','active guests'
        ],
    };
  },
  methods: {

  },
  computed: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
