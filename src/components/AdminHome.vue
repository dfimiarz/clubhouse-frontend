<template>
  <v-container fluid>
    <v-row justify="center" align="center" no-gutters="">
      <v-col cols="12" sm="10" lg="6">
        <v-container fluid>
          <template v-for="(section, index) in sections">
            <v-row :key="`header-${index}`" justify="center" align="center">
              <v-col cols="12" class="text-h4"> {{ section.name }} </v-col>
            </v-row>
            <v-row
              :key="`body-${index}`"
              justify="start"
              align="center"
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
                      <v-col cols="8">
                        <v-card-title class="text-h5">
                          {{ card.title }}
                        </v-card-title>
                        <v-card-subtitle class="text-subtitle-2">
                          {{ card.text }}
                        </v-card-subtitle>
                      </v-col>
                      <v-col cols="4" class="d-flex align-end justify-end pa-2">
                        <v-icon v-if="!canAccess(card.dest)">
                          {{ lockIcon }}
                        </v-icon>
                      </v-col>
                    </v-row>
                  </v-img>
                  <!-- <v-img
                    src="http://34.120.210.49/players.jpg"
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
                      <v-col cols="12">
                        <div class="tile-text-container subtitle-1 pa-1">
                          {{ card.title }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-img> -->
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
import { ImageProvider } from "./mixins/ImageProviderMixin";

export default {
  name: "ReportsHome",
  mixins: [AccessChecker, ImageProvider],
  data: () => {
    return {
      sections: [
        {
          name: "Reports",
          cards: [
            {
              title: "Players",
              image: "BOOKING_COVER",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "PlayerReports",
              enabled: true,
            },
            {
              title: "Courts",
              image: "BOOKING_COVER",
              xs: 12,
              sm: 6,
              md: 4,
              dest: "CourtReports",
              enabled: true,
            },
            {
              title: "Occupancy",
              image: "BOOKING_COVER",
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
