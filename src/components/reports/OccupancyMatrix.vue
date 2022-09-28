<template>
  <v-container v-resize="onResize">
    <v-row justify="start" align="start" dense>
      <v-col cols="8" sm="6" lg="4" xl="3">
        <date-range-selector
          v-bind:dates.sync="dates"
          :show.sync="dateseldialog"
        ></date-range-selector>
      </v-col>
      <v-col cols="12">
        <!-- <v-card
          raised
          :min-height="
            'calc(100vh - ' +
            ($vuetify.application.top + $vuetify.application.footer) +
            'px)'
          "
        >
          <v-card-text> -->
        <v-responsive
          :height="
            'calc(100vh - ' +
            ($vuetify.application.top + $vuetify.application.footer + 78 + 24) +
            'px)'
          "
          class="overflow-auto"
        >
          <div
            style="
              min-height: 500px;
              min-width: 600px;
              width: 100%;
              height: 100%;
            "
          >
            <v-chart
              :option="option"
              ref="matrix"
              :init-options="initoptions"
            ></v-chart>
          </div>
        </v-responsive>
        <!-- </v-card-text>
          <v-card-actions>
            <v-btn text color="primary"> Export </v-btn>
          </v-card-actions>
        </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apihandler from "../../services/db";
import DateRangeSelector from "./DateRangeSelector";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
//import { HeatmapChart } from "echarts/charts";
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

use([
  CanvasRenderer,
  TitleComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
]);

const hours = [
  "12a",
  "1a",
  "2a",
  "3a",
  "4a",
  "5a",
  "6a",
  "7a",
  "8a",
  "9a",
  "10a",
  "11a",
  "12p",
  "1p",
  "2p",
  "3p",
  "4p",
  "5p",
  "6p",
  "7p",
  "8p",
  "9p",
  "10p",
  "11p",
];

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default {
  name: "OccupancyMatrix",
  components: { VChart, DateRangeSelector },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      dateseldialog: false,
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
          top: "20",
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
          data: hours,
          splitArea: {
            show: true,
          },
        },
        // visualMap: {
        //   min: 0,
        //   max: 10,
        //   calculable: true,
        //   orient: "horizontal",
        //   left: "center",
        //   top: "15%",
        // },
        series: [
          {
            name: "Punch Card",
            type: "heatmap",
            data: [],
            // label: {
            //   show: true,
            // },
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
      this.$refs["matrix"].resize();
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
    this.$nextTick(() => {
      this.loadData();
    });
  },
  beforeDestroy() {
    this.$refs["matrix"].dispose();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
