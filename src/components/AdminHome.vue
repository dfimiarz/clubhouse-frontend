<template>
  <v-container fluid>
    <v-row justify="center" align="center" no-gutters="">
      <v-col cols="12" sm="10" lg="8">
        <v-container fluid>
          <template v-for="(section, index) in sections">
            <v-row justify="center" align="center" :key="`header-${index}`">
              <v-col cols="12" class="text-h6"> {{ section.name }} </v-col>
            </v-row>
            <v-row
              justify="start"
              align="center"
              no-gutters=""
              :key="`body-${index}`"
            >
              <v-col
                v-for="card in section.cards"
                :key="card.title"
                v-bind="{ cols: card.xs, sm: card.sm, md: card.md }"
                class="pa-2"
              >
                <v-card
                  :to="{ name: card.dest }"
                  raised
                  :disabled="!card.enabled || !canAccess(card.dest)"
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
                        <div class="tile-text-container subtitle-1 pa-1">
                          {{ card.title }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { AccessChecker } from "./mixins/AccessCheckerMixin";

export default {
  mixins: [AccessChecker],
  name: "ReportsHome",
  data: () => {
    return {
      sections: [
        {
          name: "Reports",
          cards: [
            {
              title: "Players",
              img: "players.jpg",
              img_small: "players_small.jpg",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "PlayerReports",
              enabled: true,
            },
            {
              title: "Courts",
              img: "tennisracquet.jpg",
              img_small: "tennisracquet_small.jpg",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "CourtReports",
              enabled: true,
            },
            {
              title: "Occupancy",
              img: "tennisracquet.jpg",
              img_small: "tennisracquet_small.jpg",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "OccupancyMatrix",
              enabled: true,
            },
          ],
        },
        {
          name: "Management",
          cards: [
            {
              title: "Members",
              img: "players.jpg",
              img_small: "players_small.jpg",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "PlayerReports",
              enabled: false,
            },
            {
              title: "Settings",
              img: "curr_matches.jpg",
              img_small: "curr_matches_small.jpg",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "settings",
              enabled: true,
            },
          ],
        },
      ],
    };
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tile-text-container {
  background-color: rgba(76, 76, 76, 0.8);
  padding: 5px;
}

/* .tile-title  {
  text-shadow: 3px 3px #000000;  
} */
</style>
