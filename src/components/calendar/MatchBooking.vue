<template>
  <booking-item :date="booking.date" :start="booking.start" :end="booking.end" :bgColor="matchcolor" v-slot="{height}">
    <v-row no-gutters>
      <v-col cols="12">
        <v-chip
          v-for="(player, index) in players"
          :key="index"
          v-bind="getChipSize(height)"
          label
          :class="isShortSession(height) === true ? { 'mx-1': true } : { 'ma-1': true } "
          >

          <v-icon v-if="player.person_type === 2" small left>mdi-alpha-g-circle</v-icon>
          {{ formatPlayerName(player) }}
          <v-icon v-if="player.type === 2000" small right color="#B58872" left>mdi-circle-half-full</v-icon>
          <v-icon v-if="player.type === 3000" small right color="#B58872" left>mdi-circle</v-icon>
          
          
        </v-chip>
      </v-col>
    </v-row>
  </booking-item>
</template>

<script>

const PLAYER_CHIP_SIZE = 24;

import BookingItem from './BookingItem.vue'

export default {

  components: { BookingItem },
  props :{
      booking: {
        type: Object,
        required: true,
    },
  },
  computed: {
      matchcolor: function(){
          return this.booking.bumpable ? "#7273b5" :  "#a9cce8"
      },
      players: function () {
        return this.booking.players === null ? [] : this.booking.players;
      },
  },
  methods: {
      getChipSize(height){

        return height <= PLAYER_CHIP_SIZE + 8
            ? { "x-small": true }
            : { small: true };
      },
      isShortSession(height){
        return height <= PLAYER_CHIP_SIZE + 8 ? true : false;
      },
      formatPlayerName: function (player) {
      const lastname =
        player.lastname == null || typeof player.lastname !== "string"
          ? "N/A"
          : player.lastname.length <= 1
          ? player.lastname
          : player.lastname.substr(0, 1) + ".";

      const firstname =
        player.firstname == null || typeof player.firstname !== "string"
          ? "N/A"
          : player.firstname.length > 7
          ? player.firstname.substr(0, 5) + ".."
          : player.firstname;

      return firstname + " " + lastname;
     },
  }
}

</script>

<style>

</style>