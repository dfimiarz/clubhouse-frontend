<template>
  <v-container v-resize="onResize">
    <v-row justify="start" align="start" dense>
      <v-col cols="12" ref="settings_row">
        <v-row align="center" justify="space-between" no-gutters>
          <v-col cols="10" sm="6" lg="3">
            <date-range-selector
              v-bind:dates.sync="dates"
              :show.sync="dateseldialog"
            ></date-range-selector>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-dialog v-model="optionsDialog" width="400" persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind:icon="$vuetify.breakpoint.mobile"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>{{ cogIcon }}</v-icon>
                  <span v-if="!$vuetify.breakpoint.mobile">Settings</span>
                </v-btn>
              </template>

              <v-card>
                <v-card-title> Options </v-card-title>

                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="timeStepFactorIndex"
                        :items="timeStepFactors"
                        label="Time resolution"
                        hide-details
                      ></v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="selectedTypes"
                        :items="activityTypes"
                        label="Activity types"
                        hide-details
                        multiple
                        chips
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="optionsDialog = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" ref="options_row">
        <v-chip-group>
          <v-chip small label>
            Time resolution: {{ selTimeResolution }}
          </v-chip>
          <v-chip
            v-for="(type, index) in selectedActivityTypes"
            small
            label
            :key="index"
          >
            {{ type }} Activity
          </v-chip>
        </v-chip-group>
      </v-col>
      <v-col cols="12">
        <v-responsive
          :height="'calc(100vh - ' + gridContainerHeight + 'px)'"
          class="overflow-auto"
        >
          <div
            :style="{
              'min-height': chartContainerHeight + 'px',
              'min-width': '600px',
              width: '100%',
              height: '100%',
            }"
          >
            <v-chart
              autoresize
              :option="option"
              ref="matrix"
              :init-options="initoptions"
            ></v-chart>
          </div>
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apihandler from "../../services/db";
import DateRangeSelector from "./DateRangeSelector";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { HeatmapChart } from "echarts/charts";

import {
  TitleComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

import papaparse from "papaparse";
import { saveAs } from "file-saver";

import { mdiCog } from "@mdi/js";

use([
  CanvasRenderer,
  TitleComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
]);

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const step_factors = [1, 2, 4, 8];

const hours = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "1:00 AM",
  "1:15 AM",
  "1:30 AM",
  "1:45 AM",
  "2:00 AM",
  "2:15 AM",
  "2:30 AM",
  "2:45 AM",
  "3:00 AM",
  "3:15 AM",
  "3:30 AM",
  "3:45 AM",
  "4:00 AM",
  "4:15 AM",
  "4:30 AM",
  "4:45 AM",
  "5:00 AM",
  "5:15 AM",
  "5:30 AM",
  "5:45 AM",
  "6:00 AM",
  "6:15 AM",
  "6:30 AM",
  "6:45 AM",
  "7:00 AM",
  "7:15 AM",
  "7:30 AM",
  "7:45 AM",
  "8:00 AM",
  "8:15 AM",
  "8:30 AM",
  "8:45 AM",
  "9:00 AM",
  "9:15 AM",
  "9:30 AM",
  "9:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
  "1:00 PM",
  "1:15 PM",
  "1:30 PM",
  "1:45 PM",
  "2:00 PM",
  "2:15 PM",
  "2:30 PM",
  "2:45 PM",
  "3:00 PM",
  "3:15 PM",
  "3:30 PM",
  "3:45 PM",
  "4:00 PM",
  "4:15 PM",
  "4:30 PM",
  "4:45 PM",
  "5:00 PM",
  "5:15 PM",
  "5:30 PM",
  "5:45 PM",
  "6:00 PM",
  "6:15 PM",
  "6:30 PM",
  "6:45 PM",
  "7:00 PM",
  "7:15 PM",
  "7:30 PM",
  "7:45 PM",
  "8:00 PM",
  "8:15 PM",
  "8:30 PM",
  "8:45 PM",
  "9:00 PM",
  "9:15 PM",
  "9:30 PM",
  "9:45 PM",
  "10:00 PM",
  "10:15 PM",
  "10:30 PM",
  "10:45 PM",
  "11:00 PM",
  "11:15 PM",
  "11:30 PM",
  "11:45 PM",
];

export default {
  name: "OccupancyMatrix",
  components: { VChart, DateRangeSelector },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      activities: [
        {
          id: 1,
          type_id: 1,
          date: "2022-01-01",
          start_min: 0,
          end_min: 60,
          group_id: 1,
          day_of_week: 1,
        },
        {
          id: 2,
          type_id: 1,
          date: "2022-02-01",
          start_min: 60,
          end_min: 120,
          group_id: 1,
          day_of_week: 1,
        },
        {
          id: 3,
          type_id: 1,
          date: "2022-03-01",
          start_min: 120,
          end_min: 180,
          group_id: 1,
          day_of_week: 1,
        },
        {
          id: 4,
          type_id: 1,
          date: "2022-04-01",
          start_min: 120,
          end_min: 180,
          group_id: 2,
          day_of_week: 1,
        },
        {
          id: 5,
          type_id: 1,
          date: "2022-05-01",
          start_min: 120,
          end_min: 180,
          group_id: 3,
          day_of_week: 1,
        },
      ],
      gridContainerHeight: 0,
      cogIcon: mdiCog,
      dateseldialog: false,
      optionsDialog: false,
      starthour: 6,
      endhour: 20,
      timeStepFactorIndex: 1,
      timeStepFactors: [
        { text: "15 min", value: 0 },
        { text: "30 min", value: 1 },
        { text: "1 hour", value: 2 },
        { text: "2 hours", value: 3 },
      ],
      //Activity Types that are displayed in the matrix
      selectedTypes: [1, 2],
      //All available activity types
      activityTypes: [
        { text: "Member", value: 1 },
        { text: "Club", value: 2 },
        { text: "Support", value: 3 },
      ],
      dates: [],
      initoptions: {
        renderer: "canvas",
      },
      option: {
        // title: {
        //   text: "Occupancy Matrix",
        //   left: "left",
        // },
        tooltip: {
          position: "top",
        },
        grid: {
          top: "100",
          bottom: "20",
        },
        xAxis: {
          type: "category",
          data: days,
          position: "top",
          splitArea: {
            show: true,
          },
        },
        yAxis: {
          type: "category",
          data: [],
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          calculable: true,
          orient: "horizontal",
          left: "center",
          top: "10",
        },
        series: [
          {
            name: "Occupancy",
            type: "heatmap",
            data: [
              [0, 0, 34],
              [0, 1, 30],
              [0, 2, 5],
              [0, 3, 15],
              [0, 4, 56],
              [0, 5, 24],
              [0, 6, 10],
            ],
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    setGridContainerHeight() {
      this.gridContainerHeight =
        this.$refs.options_row.clientHeight +
        this.$refs.settings_row.clientHeight +
        this.$vuetify.application.top +
        this.$vuetify.application.footer +
        24;
    },
    saveData: function (op_type) {
      //A list of available save functions
      const SUPPORTED_OPS = {
        guest_players: {
          filename: "guest_players",
          data: this.guest_players_data,
        },
        member_activities: {
          filename: "member_activities",
          data: this.memberactivities,
        },
        player_stats: {
          filename: "player_stats",
          data: this.playerStats,
        },
      };

      //Check if type is set and it is a valid save function
      if (
        op_type &&
        SUPPORTED_OPS.hasOwnProperty(op_type) &&
        SUPPORTED_OPS[op_type].data.length > 0
      ) {
        //If so, use that save function
        this.saveDataToCSV(
          SUPPORTED_OPS[op_type].filename,
          SUPPORTED_OPS[op_type].data
        );
      }
    },
    saveDataToCSV: function (filename, data) {
      let csv = papaparse.unparse(data);
      let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${filename}-${this.startdate}-${this.enddate}.csv`, {
        autoBom: true,
      });
    },
    onResize: function () {
      this.$nextTick(() => {
        this.setGridContainerHeight();
        this.$refs["matrix"].resize();
      });
    },
    loadData() {
      //this.$store.dispatch("setLoading", true);
      // Promise.all([
      //   apihandler.runReport("playerstats", this.startdate, this.enddate),
      //   apihandler.runReport("memberactivities", this.startdate, this.enddate),
      //   apihandler.runReport("guestinfo", this.startdate, this.enddate),
      // ])
      //   .then((responses) => {
      //     this.playerStats = responses[0].data.result;
      //     this.memberactivities = responses[1].data.result;
      //     this.guest_players_data = responses[2].data.result;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     this.$store.dispatch("setLoading", false);
      //   });
    },
  },
  computed: {
    filteredActivities() {
      return this.activities.filter((activity) => {
        return this.selectedTypes.includes(activity.group_id);
      });
    },
    selTimeResolution() {
      return this.timeStepFactors[this.timeStepFactorIndex]
        ? this.timeStepFactors[this.timeStepFactorIndex].text
        : "N/A";
    },
    selectedActivityTypes() {
      if (this.selectedTypes.length > 0) {
        return this.activityTypes
          .filter((x) => this.selectedTypes.includes(x.value))
          .map((x) => x.text);
      } else {
        return ["All"];
      }
    },
    chartContainerHeight() {
      const array_len = this.filtered_time_array.length;

      return array_len * 30;
    },
    /**
     * Returns the time array based on the start and end hour
     * @returns {Array<string>} Array of time strings
     */
    time_array() {
      return hours.slice(this.starthour * 4, this.endhour * 4);
    },
    filtered_time_array: function () {
      //Pick every nth element from the timearray
      return this.time_array.filter(
        (item, index) => index % step_factors[this.timeStepFactorIndex] === 0
      );
    },
    startdate() {
      //if this.date is not an array, return null
      if (!Array.isArray(this.dates)) {
        return null;
      }

      //if this.dates has one element, return it
      if (this.dates.length == 1) {
        return this.dates[0];
      }
      //if this.dates has two elements, compare them and return the earliest
      if (this.dates.length == 2) {
        let d1 = new Date(this.dates[0] + "T00:00:00Z");
        let d2 = new Date(this.dates[1] + "T00:00:00Z");
        if (d1 < d2) {
          return this.dates[0];
        } else {
          return this.dates[1];
        }
      }

      //otherwise return null
      return null;
    },
    enddate() {
      //if this.date is not an array, return null
      if (!Array.isArray(this.dates)) {
        return null;
      }

      //if this.dates has one element, return it
      if (this.dates.length == 1) {
        return this.dates[0];
      }
      //if this.dates has two elements, compare them and return the earliest
      if (this.dates.length == 2) {
        let d1 = new Date(this.dates[0] + "T00:00:00Z");
        let d2 = new Date(this.dates[1] + "T00:00:00Z");
        if (d1 > d2) {
          return this.dates[0];
        } else {
          return this.dates[1];
        }
      }

      //otherwise return null
      return null;
    },
  },
  watch: {
    dates: function () {
      this.loadData();
    },
    timeStepFactorIndex: function () {
      //Create new array with size len(time_array)*7, filled with random values
      const data_array = Array.from(
        { length: this.filtered_time_array.length * 7 },
        () => Math.floor(Math.random() * 100)
      );

      //create heatmap_array with the same size as the data_array
      let heatmap_array = [];

      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < this.filtered_time_array.length; j++) {
          heatmap_array.push([i, j, data_array[i * 7 + j]]);
        }
      }

      console.log(data_array);

      this.$refs["matrix"].setOption({
        yAxis: {
          data: this.filtered_time_array.slice(0).reverse(),
        },
        series: [
          {
            name: "Occupancy",
            data: heatmap_array,
          },
        ],
      });
    },
    // playerStats: function (newval) {
    //   //return if newval is not array
    //   if (!Array.isArray(newval)) {
    //     return;
    //   }

    //   this.playersChartOptions.xAxis[0].data = newval.map((d) => d.date);
    //   this.playersChartOptions.series[0].data = newval.map(
    //     (d) => d.time_played
    //   );
    //   this.playersChartOptions.series[1].data = newval.map(
    //     (d) => d.player_count
    //   );
    // },
  },
  mounted() {
    /**
     * Load dates for past seven days
     */
    this.dates.push(
      this.$dayjs().tz().subtract(1, "month").format("YYYY-MM-DD")
    );
    this.dates.push(this.$dayjs().tz().format("YYYY-MM-DD"));

    /**
     * Load data
     */
    this.$nextTick(() => {
      //Compute the height of the chart container
      this.setGridContainerHeight();

      this.$refs["matrix"].setOption({
        yAxis: {
          data: this.filtered_time_array.slice(0).reverse(),
        },
      });
      this.loadData();
    });
  },
  beforeDestroy() {
    //console.log("destroyed");
    this.$refs["matrix"].dispose();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
