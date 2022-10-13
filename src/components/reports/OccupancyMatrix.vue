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
          :height="'calc(100vh - ' + nonGridElementsHeight + 'px)'"
          class="overflow-auto"
        >
          <div
            ref="grid_container"
            :style="{ height: '100%', 'min-width': '600px', width: '100%' }"
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
      <v-col cols="12" ref="actions_row" class="text-right">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"> Export </v-btn>
          </template>
          <v-list>
            <v-list-item @click="saveAsCsv">
              <v-list-item-title>CSV</v-list-item-title>
            </v-list-item>
            <v-list-item @click="saveAsImage">
              <v-list-item-title>Image</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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

/**
 * @param {int} end_min - end minute
 * @param {int} timeframe_len_min - length of the time frame in minutes
 *
 * @returns {int} - number of time frame cell associated with the end minute
 */
const computeLastCell = function (end_min, timeframe_len_min) {
  if (timeframe_len_min == 0) {
    return 0;
  }
  //If end min falls on a timeframe boundary, we need to subtract one timeframe
  const adj_end_min =
    !!end_min && end_min % timeframe_len_min === 0
      ? end_min - timeframe_len_min
      : end_min;
  return Math.floor(adj_end_min / timeframe_len_min);
};

import { notification } from "@/components/mixins/NotificationMixin";

export default {
  mixins: [notification],
  name: "OccupancyMatrix",
  components: { VChart, DateRangeSelector },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      activities: [],
      nonGridElementsHeight: 0,
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
        title: {
          id: "matrix_title",
          top: 20,
          left: "left",
          text: "Occupancy Matrix",
          subtext: "Dates:",
        },
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
            data: [],
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
    resizeGrid() {
      const container_height = this.$refs["grid_container"].clientHeight;

      const newheight = this.filtered_time_array.length * 20 + 120;
      this.$refs["matrix"].resize({
        height: container_height > newheight ? container_height : newheight,
      });
    },
    saveAsCsv() {
      const fields = ["", ...days];
      const data = [];

      //Number of rows
      const num_rows = this.filtered_time_array.length;

      //Number of timeframes
      const column_count = days.length;
      //Array of numbers between 0 and row_count
      const column_indices = Array.from(Array(column_count).keys());

      //Loop through each row
      this.filtered_time_array.forEach((time, index) => {
        //Get row data from occupanyData array.
        const row_data = column_indices.map((column_index) => {
          return this.occupancyData[
            //Reverse column indices to get data in correct order
            column_index * num_rows + (num_rows - 1 - index)
          ];
        });
        //Add each row to data array
        data.push([time, ...row_data]);
      });

      this.saveDataToCSV("Occupany_Matrix", { fields: fields, data: data });
    },
    saveAsImage() {
      const imagedata = this.$refs["matrix"].getDataURL({
        pixelRatio: 1,
        type: "jpg",
      });

      saveAs(
        imagedata,
        `occupancy-matrix-${this.formattedStartDate}-${this.formattedEndDate}.jpg`
      );
    },
    updateHeatMapData() {
      let heatmap_array = [];
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < this.filtered_time_array.length; j++) {
          const index = i * this.filtered_time_array.length + j;
          heatmap_array.push([
            i,
            j,
            !this.occupancyData[index] ? "-" : this.occupancyData[index],
          ]);
        }
      }

      this.$refs["matrix"].setOption({
        title: {
          id: "matrix_title",
          subtext: `Dates: ${this.formattedStartDate} to ${this.formattedEndDate}`,
        },
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
    loadDefaultDates() {
      /**
       * Load dates for past seven days
       */
      this.dates.push(
        this.$dayjs().tz().subtract(1, "month").format("YYYY-MM-DD")
      );
      this.dates.push(this.$dayjs().tz().format("YYYY-MM-DD"));
    },
    setNonGridElementsHeight() {
      this.nonGridElementsHeight =
        this.$refs.options_row.clientHeight +
        this.$refs.settings_row.clientHeight +
        this.$refs.actions_row.clientHeight +
        this.$vuetify.application.top +
        this.$vuetify.application.footer +
        24;
    },
    saveDataToCSV: function (filename, data) {
      let csv = papaparse.unparse(data);
      let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(
        blob,
        `${filename}-${this.formattedStartDate}-${this.formattedEndDate}.csv`,
        {
          autoBom: true,
        }
      );
    },
    onResize: function () {
      this.$nextTick(() => {
        this.setNonGridElementsHeight();
      });
    },
    loadActivities() {
      this.$store.dispatch("setLoading", true);

      apihandler
        .getActivitiesForDates(this.startdate, this.enddate)
        .then((data) => {
          this.activities = data;
          this.updateHeatMapData();
        })
        .catch((error) => {
          this.showNotification(error.message, "error");
        })
        .finally(() => {
          this.$store.dispatch("setLoading", false);
        });
    },
  },
  computed: {
    filteredActivities() {
      return this.activities.filter((activity) => {
        return this.selectedTypes.includes(activity.group_type_id);
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
    formattedStartDate() {
      return this.$dayjs(this.startdate).tz().format("MM-DD-YY");
    },
    formattedEndDate() {
      return this.$dayjs(this.enddate).tz().format("MM-DD-YY");
    },
    occupancyData() {
      const timeframe_len_min = step_factors[this.timeStepFactorIndex] * 15;
      if (timeframe_len_min == 0) {
        return [];
      }

      const occupancy_counts = Array.from(
        { length: 7 * this.filtered_time_array.length },
        () => 0
      );

      //Compute the first calendar cell that is visible
      const cal_start_cell = Math.floor(
        (this.starthour * 60) / timeframe_len_min
      );

      //Comptue the last calendar cell that is visible
      const cal_end_min = this.endhour * 60;
      const cal_end_cell = computeLastCell(cal_end_min, timeframe_len_min);

      this.filteredActivities.forEach((element) => {
        const activity_start_cell = Math.floor(
          element.start_min / timeframe_len_min
        );

        const activity_end_cell = computeLastCell(
          element.end_min,
          timeframe_len_min
        );

        for (let i = activity_start_cell; i <= activity_end_cell; i++) {
          if (i >= cal_start_cell && i <= cal_end_cell) {
            //local index. Flip each column of the array to get the correct order
            const l_index =
              (element.day_of_week - 1) * this.filtered_time_array.length +
              (this.filtered_time_array.length - 1 - (i - cal_start_cell));
            occupancy_counts[l_index] += 1;
          }
        }
      });

      return occupancy_counts;
    },
  },
  watch: {
    dates: function () {
      this.loadActivities();
    },
    timeStepFactorIndex: function () {
      this.updateHeatMapData();
      this.$nextTick(() => {
        this.resizeGrid();
      });
    },
    selectedTypes: function () {
      this.updateHeatMapData();
    },
  },
  mounted() {
    /**
     * Load data
     */
    this.$nextTick(() => {
      //Compute the height of the chart container
      this.setNonGridElementsHeight();

      this.$refs["matrix"].setOption({
        yAxis: {
          data: this.filtered_time_array.slice(0).reverse(),
        },
      });
      this.resizeGrid();
    });
  },
  created() {
    this.loadDefaultDates();
  },
  beforeDestroy() {
    //console.log("destroyed");
    this.$refs["matrix"].dispose();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
