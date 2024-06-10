<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" no-gutters="" class="fill-height">
      <v-col cols="12" md="10" lg="8" xl="6">
        <v-container fluid>
          <v-row justify="start" align="start" no-gutters="">
            <v-col
              v-for="card in cards"
              :key="card.title"
              v-bind="{ cols: card.xs, sm: card.sm, md: card.md }"
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
                >
                  <v-row
                    justify="center"
                    align="end"
                    no-gutters
                    class="fill-height"
                  >
                    <v-col
                      v-if="!canAccess(card.dest)"
                      cols="12"
                      class="text-center"
                    >
                      <v-icon x-large>{{ lockIcon }}</v-icon>
                    </v-col>
                    <v-col cols="12">
                      <div class="tile-text-container">
                        <h3 class="text-h6 text-xl-h4">
                          {{ card.title }}
                        </h3>
                        <div class="caption">
                          {{ card.text }}
                        </div>
                      </div>
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
          title: "Club Schedule",
          text: "View full schedule",
          xs: 12,
          sm: 6,
          md: 6,
          dest: "calendar",
          enabled: true,
        },
        {
          image: "BOOKING_COVER",
          title: "Booking",
          text: "Member bookings",
          xs: 12,
          sm: 6,
          md: 6,
          dest: "MatchBooking",
          enabled: true,
        },
        {
          image: "GUESTS_COVER",
          title: "Guests",
          text: "Club guests",
          xs: 12,
          sm: 6,
          md: 3,
          dest: "guestregistration",
          enabled: true,
        },
        {
          image: "EVENTS_COVER",
          title: "Events",
          text: "Event booking",
          xs: 12,
          sm: 6,
          md: 3,
          dest: "EventBooking",
          enabled: true,
        },
        {
          image: "MANAGEMENT_COVER",
          title: "Management",
          text: "System Administration",
          xs: 12,
          sm: 6,
          md: 3,
          dest: "admin",
          enabled: true,
        },
        {
          image: "CLUB_COVER",
          title: "The Knick",
          text: "More about the club",
          xs: 12,
          sm: 6,
          md: 3,
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
