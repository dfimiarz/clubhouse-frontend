<template>
  <calendar-item
    :id="booking.id"
    v-slot="{ height }"
    :start="booking.start_min"
    :end="booking.end_min"
    :calendar-start="calendarStart"
    show-details
  >
    <v-row no-gutters class="fill-height green darken-2 white--text">
      <v-col cols="12">
        <template v-if="height > item_text_container_height">
          <div
            class="text-body-1 text-lg-subtitle-1 px-1 d-flex align-content-center"
          >
            <div>MATCH</div>
            <v-icon v-if="isBumpable" color="white">
              {{ bBoxOutlineIcon }}
            </v-icon>
          </div>
          <div class="d-flex flex-wrap">
            <div
              v-for="(player, index) in players"
              :key="index"
              class="text-caption mx-1 d-flex align-center"
            >
              <span style="white-space: nowrap">
                {{ index + 1 }}.{{ formatName(player) }}
              </span>
              <v-icon v-if="player.person_role_type_id === 100" small color="white">
                {{ gBoxOutlineIcon }}
              </v-icon>
              <v-icon v-if="player.type_id === 2000" small color="white">
                {{ circleHalfFullIcon }}
              </v-icon>
              <v-icon v-if="player.type_id === 3000" small color="white">
                {{ circleIcon }}
              </v-icon>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="caption px-1 d-flex align-content-center flex-wrap">
            <div>MATCH</div>
            <v-icon v-if="isBumpable" color="white" small>
              {{ bBoxOutlineIcon }}
            </v-icon>
            <div class="mx-1">- {{ player_count }} player(s)</div>
          </div>
        </template>
      </v-col>
    </v-row>
  </calendar-item>
</template>

<script>
const PLAYER_CHIP_SIZE = 24;

import {
  mdiAlphaBBoxOutline,
  mdiCircle,
  mdiAlphaGBoxOutline,
  mdiCircleHalfFull,
} from "@mdi/js";
import CalendarItem from "./CalendarItem.vue";
import { itemmixin } from "./ItemMixin";

export default {
  components: { CalendarItem },
  mixins: [itemmixin],
  props: {
    booking: {
      type: Object,
      required: true,
    },
    calendarStart: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      bBoxOutlineIcon: mdiAlphaBBoxOutline,
      circleIcon: mdiCircle,
      gBoxOutlineIcon: mdiAlphaGBoxOutline,
      circleHalfFullIcon: mdiCircleHalfFull,
    };
  },
  computed: {
    matchcolor: function () {
      return this.booking.bumpable ? "#7273b5" : "#a9cce8";
    },
    isBumpable: function () {
      return (
        Object.prototype.hasOwnProperty.call(this.booking, "bumpable") &&
        this.booking.bumpable
      );
    },
    players: function () {
      return this.booking.players === null ? [] : this.booking.players;
    },
    player_count: function () {
      return this.players.length;
    },
  },
  methods: {
    getChipSize(height) {
      return height <= PLAYER_CHIP_SIZE + 8
        ? { "x-small": true }
        : { small: true };
    },
    isShortSession(height) {
      return height <= PLAYER_CHIP_SIZE + 8 ? true : false;
    },
  },
};
</script>

<style></style>
