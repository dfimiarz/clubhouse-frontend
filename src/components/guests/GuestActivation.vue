<template>
  <v-container fluid>
    <div class="py-2">Please enter host and guest(s) to activate for today</div>
    <v-row no-gutters>
      <v-col cols="12" md="8">
        <v-autocomplete
          v-model="host"
          label="Select Host"
          :items="activeMembers"
          item-text="name"
          item-value="id"
          :error-messages="hosterrors"
        ></v-autocomplete>
      </v-col>

      <v-col cols="12" class="subtitle-2">Guests</v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" md="8" v-for="(guest,index) in selectedGuests" :key="index">
        <v-autocomplete
          v-model="guest.id"
          :label="getGuestLabel(index+1)"
          :items="inactiveguests"
          item-text="name"
          item-value="id"
          :error-messages="guest.errors"
        ></v-autocomplete>
      </v-col>
     
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-btn outlined @click="resetForm" color="warning" >Clear</v-btn>
        <v-spacer></v-spacer>
        <v-btn>Activate</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dbservice from './../../services/db';

export default {
  name: "GuestActivation",
  data: function () {
    return {
      selectedGuests: [
        { id: null, errors: [] },
        { id: null, errors: [] },
        { id: null, errors: [] },
        { id: null, errors: [] }
      ],
      guests: [],
      loading: false,
      host: null,
      hosterrors: [],
      inactiveguests: []
    };
  },
  methods: {
    reset() {
      this.selected.splice(0);
    },
    getInactiveGuests(){
      this.inactiveguests.splice(0);

      dbservice.getInactiveGuests().then((result) => {
        this.inactiveguests = result.data;
      })
      .catch((err) => {
        console.log(err)
      }).finally(() => {

      })
    },
    getGuestLabel: (index) => `Guest #${index}`,
    resetForm(){
      this.selectedGuests.forEach(element => {
        element.id = null;
        element.errors.splice(0)
      });

      this.host = null;
      this.hosterrors.splice(0)
    }
    
  },
  computed: {
    guestcount: function () {
      return this.guests.length;
    },
    clubmembers: function () {
      return this.$store.getters["memberstore/clubMembers"];
    },
    activeMembers: function() {
      return this.$store.getters["memberstore/getActiveMembers"];
    }
  },
  created: function(){
    this.getInactiveGuests();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
