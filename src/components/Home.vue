<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" no-gutters="" class="fill-height">
      <v-col cols="12" md="10" lg="8">
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
                  :src="require(`@/assets/${card.img}`)"
                  :lazy-src="require(`@/assets/${card.img_small}`)"
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

export default {
  mixins: [AccessChecker],
  name: "Home-Page",
  data: () => {
    return {
      cards: [
        {
          title: "Club Schedule",
          text: "View full schedule",
          img: "players.jpg",
          img_small: "players_small.jpg",
          xs: 12,
          sm: 6,
          md: 6,
          dest: "calendar",
          enabled: true,
        },
        {
          title: "Booking",
          text: "Regular court booking",
          img: "tennisracquet.jpg",
          img_small: "tennisracquet_small.jpg",
          xs: 12,
          sm: 6,
          md: 6,
          dest: "MatchBooking",
          enabled: true,
        },
        {
          title: "Guests",
          text: "Club guests",
          img: "guests_btn_bg.jpg",
          img_small: "clubhouse_small.jpg",
          xs: 12,
          sm: 6,
          md: 6,
          dest: "guestregistration",
          enabled: true,
        },
        {
          title: "Administration",
          text: "System Administration",
          img: "manager.jpg",
          img_small: "manager_small.jpg",
          xs: 12,
          sm: 6,
          md: 3,
          dest: "admin",
          enabled: true,
        },
        {
          title: "The Knick",
          text: "More about the club",
          img: "curr_matches.jpg",
          img_small: "curr_matches_small.jpg",
          xs: 12,
          sm: 6,
          md: 3,
          enabled: false,
        },
      ],
    };
  },
  methods: {},
  computed: {
    tileTitleClass: function () {
      return this.$vuetify.breakpoint.mdAndDown
        ? { headline: true }
        : { "display-1": true };
    },
  },
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
