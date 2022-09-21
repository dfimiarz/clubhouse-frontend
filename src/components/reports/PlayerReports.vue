<template>
  <v-container v-resize="onResize">
    <v-row justify="start" align="start">
      <v-col cols="12" sm="6" lg="4" xl="3">
        <date-range-selector
          v-bind:dates.sync="dates"
          :show.sync="dateseldialog"
        ></date-range-selector>
      </v-col>
      <v-col cols="12">
        <v-card raised>
          <v-card-text>
            <v-responsive height="300px">
              <v-chart
                :option="playersChartOptions"
                ref="playerchart"
              ></v-chart>
            </v-responsive>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="saveData('player_stats')">
              Export
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Guest Visitors
            <v-spacer></v-spacer>
            <v-text-field
              v-model="hostmembersearch"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              height="400"
              :headers="guest_players_headers"
              :items="guest_players_data"
              item-key="activataion_id"
              sort-by="guestname"
              class="elevation-1"
              show-group-by
              hide-default-footer
              disable-pagination
              mobile-breakpoint="0"
              fixed-header
              :search="hostmembersearch"
            ></v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="saveData('guest_players')">
              Export
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Player Activity
            <v-spacer></v-spacer>
            <v-text-field
              v-model="matchsearch"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-data-table
              height="400"
              :headers="players_headers"
              :items="memberactivities"
              item-key="participant_id"
              class="elevation-1"
              show-group-by
              hide-default-footer
              disable-pagination
              mobile-breakpoint="0"
              fixed-header
              sort-by="match_id"
              :search="matchsearch"
              dense
            ></v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="saveData('member_activities')">
              Export
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apihandler from "./../../services/db";
import DateRangeSelector from "./DateRangeSelector";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

import papaparse from "papaparse";
import { saveAs } from "file-saver";

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  GridComponent,
  LineChart,
  LegendComponent,
  TooltipComponent,
]);

export default {
  name: "PlayerReports",
  components: { VChart, DateRangeSelector },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      dateseldialog: false,
      dates: [],
      hostmembersearch: "",
      matchsearch: "",
      guest_players_headers: [
        {
          text: "Host",
          align: "start",
          value: "host",
          width: 150,
        },
        {
          text: "Guest",
          align: "start",
          value: "guest",
          width: 150,
        },
        {
          text: "Date Active",
          align: "start",
          value: "active_date",
          width: 150,
        },
      ],
      guest_players_data: [
        {
          // activation_id: 278,
          // active_date: "2022-09-18",
          // host: "Shelly Adasko",
          // guest: "Daniel Fimiarz",
        },
      ],
      players_headers: [
        {
          text: "Match ID",
          align: "start",
          value: "activity_id",
        },
        {
          text: "Name",
          align: "start",
          value: "player",
          width: 150,
        },
        {
          text: "Member Type",
          align: "start",
          value: "person_type",
          width: 150,
        },
        {
          text: "Date",
          align: "start",
          value: "date",
          width: 150,
        },
        {
          text: "Start",
          align: "start",
          value: "start",
          groupable: false,
          sortable: false,
        },
        {
          text: "Duration",
          align: "start",
          value: "dur_min",
          groupable: false,
          sortable: false,
        },
        {
          text: "Player type",
          align: "start",
          value: "player_type",
          width: 150,
        },
      ],
      memberactivities: [
        // {
        //   row_id: "100_1",
        //   match_id: 1,
        //   name: "Laurent Mars",
        //   person_type: "Member",
        //   date: "2022-06-01",
        //   time: "13:00",
        //   duration: 60,
        //   playertype: "Non-Repeater",
        // },
      ],
      playerStats: [],
      playersChartOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
        },
        legend: {},
        // title: {
        //  text: "Players statistics",
        //  left: "center",
        // },
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              rotate: 30,
            },
            data: [
              // "08/12",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Min Played",
            position: "right",
            axisLabel: {
              formatter: "{value} min",
            },
          },
          {
            type: "value",
            name: "Player Count",
            position: "left",
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            data: [],
            type: "line",
            yAxisIndex: 0,
            name: "Minutes Played",
          },
          {
            data: [],
            type: "bar",
            yAxisIndex: 1,
            name: "Player Count",
          },
        ],
        renderer: "canvas",
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
      this.$refs["playerchart"].resize();
    },
    loadData() {
      this.$store.dispatch("setLoading", true);
      Promise.all([
        apihandler.runReport("playerstats", this.startdate, this.enddate),
        apihandler.runReport("memberactivities", this.startdate, this.enddate),
        apihandler.runReport("guestinfo", this.startdate, this.enddate),
      ])
        .then((responses) => {
          this.playersChartOptions.xAxis[0].data = responses[0].data.result.map(
            (d) => d.date
          );
          this.playersChartOptions.series[0].data =
            responses[0].data.result.map((d) => d.time_played);
          this.playersChartOptions.series[1].data =
            responses[0].data.result.map((d) => d.player_count);

          this.playerStats = responses[0].data.result;

          this.memberactivities = responses[1].data.result;
          this.guest_players_data = responses[2].data.result;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.$store.dispatch("setLoading", false);
        });
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
    this.$refs["playerchart"].dispose();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
