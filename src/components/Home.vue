<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" no-gutters="" class="fill-height">
      <v-col cols="12" md="10" xl="8">
        <v-container fluid>
          <v-row justify="start" align="start" no-gutters="">
            <v-col
              v-for="card in cards"
              :key="card.title"
              v-bind="{ cols: card.xs, sm: card.sm, lg: card.lg }"
              class="pa-2"
            >
              <v-card
                :to="{ name: card.dest }"
                raised
                v-bind="{ disabled: !card.enabled }"
                :disabled="!canAccess(card.dest)"
              >
                <v-img
                  :src="getImageSrcByName(card.image)"
                  :lazy-src="require(`@/assets/lazyloader.jpg`)"
                  min-height="100"
                  max-height="325"
                  aspect-ratio="1.5"
                  :transition="false"
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,0.0) 30%, rgba(0,0,0,.7) 100%"
                >
                  <v-row no-gutters>
                    <v-col cols="10">
                      <v-card-title class="text-lg-h4 text-md-h5">
                        {{ card.title }}
                      </v-card-title>
                      <v-card-subtitle class="text-subtitle-2">
                        {{ card.text }}
                      </v-card-subtitle>
                    </v-col>
                    <v-col cols="2" class="d-flex align-end justify-end pa-2">
                      <v-icon v-if="!canAccess(card.dest)">
                        {{ lockIcon }}
                      </v-icon>
                    </v-col>
                  </v-row>
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AccessChecker } from "./mixins/AccessCheckerMixin";
import { ImageProvider } from "./mixins/ImageProviderMixin";
import { mdiLock } from "@mdi/js";

export default {
  name: "HomePage",
  mixins: [AccessChecker, ImageProvider],
  data: () => {
    return {
      lockIcon: mdiLock,
      cards: [
        {
          image: "SCHEDULE_COVER",
          title: "SCHEDULE",
          text: "View full schedule",
          xs: 12,
          sm: 6,
          lg: 6,
          dest: "calendar",
          enabled: true,
        },
        {
          image: "BOOKING_COVER",
          title: "BOOKING",
          text: "Book a court",
          xs: 12,
          sm: 6,
          lg: 6,
          dest: "MatchBooking",
          enabled: true,
        },
        {
          image: "GUESTS_COVER",
          title: "GUESTS",
          text: "Guest Management",
          xs: 12,
          sm: 6,
          lg: 3,
          dest: "guestregistration",
          enabled: true,
        },
        {
          image: "EVENTS_COVER",
          title: "EVENTS",
          text: "Event booking",
          xs: 12,
          sm: 6,
          lg: 3,
          dest: "EventBooking",
          enabled: true,
        },
        {
          image: "MANAGEMENT_COVER",
          title: "MANAGE",
          text: "Club Administration",
          xs: 12,
          sm: 6,
          lg: 3,
          dest: "admin",
          enabled: true,
        },
        {
          image: "CLUB_COVER",
          title: "CLUB",
          text: "About The Knick",
          xs: 12,
          sm: 6,
          lg: 3,
          enabled: false,
        },
      ],
    };
  },
  computed: {
    tileTitleClass: function () {
      return this.$vuetify.breakpoint.mdAndDown
        ? { headline: true }
        : { "display-1": true };
    },
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile-text-container {
  background-color: rgba(76, 76, 76, 0.9);
  padding: 5px;
}

/* .tile-title  {
  text-shadow: 3px 3px #000000;  
} */
</style>
