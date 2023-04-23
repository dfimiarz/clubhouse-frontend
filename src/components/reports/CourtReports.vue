<template>
  <v-container fluid class="fill-height" v-resize="onResize">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="10">
        <v-container fluid>
          <v-row justify="start" align="center">
            <v-col cols="12" sm="6" lg="4">
              <v-row dense>
                <v-col cols="12"> Utilization Highlights </v-col>
                <v-col cols="6">
                  <v-card raised rounded="" height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1"
                      >Club Utilization</v-card-title
                    >
                    <v-card-text
                      class="text-h6 text-md-h5 text-lg-h4 text-center"
                    >
                      60%
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1"
                      >Most Utilized</v-card-title
                    >
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      #1
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1"
                      >Least Utilized</v-card-title
                    >
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      #5
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      Most Upkeep</v-card-title
                    >
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      #5
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12"> Utilization/Court (%) </v-col>
                <v-col cols="12">
                  <!-- 
                    Should go to settings along with courts
                    <v-select
                    :items="timeranges"
                    label="Time Ranges"
                    multiple
                  ></v-select> -->
                  <v-card height="300px" class="pa-2" raised rounded="">
                    <v-chart :option="utilizationOption" ref="bar1"></v-chart>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-row dense>
                <v-col cols="12">
                  <div class="px-2">Time/Activity Type</div>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      Player
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      335 min
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      Avg. Player
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      65 min
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      Club
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      30 min
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      Support
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      30 min
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <div class="px-2">Activity times (min)</div>
                </v-col>
                <v-col cols="12">
                  <v-card height="300px" class="pa-2" raised rounded="">
                    <v-chart :option="timePlayedOption" ref="bar2"></v-chart>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-row dense>
                <v-col cols="12">
                  <div class="px-2">Booking counts</div>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      # Singles
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      5
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      # Doubles
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      3
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      # Modified
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      35
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card raised height="150px">
                    <v-card-title class="text-body-1 text-sm-subtitle-1">
                      # Early Bookings
                    </v-card-title>
                    <v-card-text class="text-h6 text-lg-h4 text-center">
                      3
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <div class="px-2">Wait times</div>
                </v-col>
                <v-col cols="12">
                  <v-card height="300px" class="pa-2" raised rounded="">
                    <v-chart :option="waitTimeOption" ref="bar3"></v-chart>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-card :to="{ name: 'OccupancyMatrix' }" raised>
                <v-img
                  :src="require(`@/assets/occupancy.jpg`)"
                  :lazy-src="require(`@/assets/occupancy_small.jpg`)"
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
                        Sessions/Time Frame Analysis
                      </div>
                    </v-col>
                  </v-row>
                </v-img>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" lg="4">
              <v-card :to="{ name: 'OccupancyMatrix' }" raised>
                <v-img
                  :src="require(`@/assets/occupancy.jpg`)"
                  :lazy-src="require(`@/assets/occupancy_small.jpg`)"
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
                        Court Occupancy/Time Frame
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
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TitleComponent, GridComponent } from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([SVGRenderer, BarChart, TitleComponent, GridComponent]);

export default {
  name: "CourtReports",
  components: { VChart },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      timeranges: ["All", "Morning", "Afternoon", "Evening"],
      utilizationOption: {
        title: {
          text: "Court Utilization (%)",
        },
        xAxis: {
          type: "category",
          data: ["#1", "#2", "#3", "#4", "#5"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: [40, 50, 60, 30, 50],
          },
        ],
        renderer: "svg",
      },
      timePlayedOption: {
        title: {
          text: "Time/Court/Type",
        },
        xAxis: {
          type: "category",
          data: ["#1", "#2", "#3", "#4", "#5"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: "bar",
            stack: "x",
          },
          {
            data: [0, 1, 3, 10, 11],
            type: "bar",
            stack: "x",
          },
        ],
        renderer: "svg",
      },
      waitTimeOption: {
        title: {
          text: "Booking to Start (min)",
        },
        xAxis: {
          type: "category",
          data: ["#1", "#2", "#3", "#4", "#5"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [2, 4, 6, 8, 1],
            type: "bar",
          },
        ],
        renderer: "svg",
      },
    };
  },
  methods: {
    onResize: function () {
      this.$refs["bar1"].resize();
      this.$refs["bar2"].resize();
      this.$refs["bar3"].resize();
    },
  },
  computed: {},
  destroyed() {
    this.$refs["bar1"].dispose();
    this.$refs["bar2"].dispose();
    this.$refs["bar3"].dispose();
  },
};
</script>

<style scoped>
.tile-text-container {
  background-color: rgba(76, 76, 76, 0.8);
  padding: 5px;
}

/* .tile-title  {
  text-shadow: 3px 3px #000000;  
} */
</style>
