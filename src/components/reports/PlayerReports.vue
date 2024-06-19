<template>
  <v-container v-resize="onResize">
    <v-row justify="center">
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="12">
            <v-card raised>
              <v-card-title>
                <v-row dense>
                  <v-col cols="12" sm="6" md="8" xl="10"> Booking Time </v-col>
                  <v-col cols="12" sm="6" md="4" xl="2">
                    <date-range-selector
                      :dates.sync="dates"
                      :show.sync="dateseldialog"
                    ></date-range-selector>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-responsive height="400px">
                      <v-chart
                        ref="playerchart"
                        :option="playersChartOptions"
                      ></v-chart>
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" @click="saveData('player_stats')">
                  Export
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <!-- <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                Guest Passes
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="hostmembersearch"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  height="400"
                  :headers="guest_passes_headers"
                  :items="guest_passes_data"
                  item-key="id"
                  sort-by="guestname"
                  class="elevation-1"
                  show-group-by
                  no-data-text="No data available"
                  :footer-props="{
                    itemsPerPageOptions: [-1],
                  }"
                  mobile-breakpoint="0"
                  hide-default-footer
                >
                  <template #[`item.actions`]>
                    <v-icon small>
                      {{ pencilIcon }}
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="primary" @click="saveData('guest_players')">
                  Export
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col> -->
          <v-col cols="12">
            <v-card>
              <v-card-title> Players </v-card-title>
              <v-card-text>
                <v-row justify="end" no-gutters>
                  <v-col cols="6" md="4">
                    <v-text-field
                      v-model="matchsearch"
                      label="Search"
                      single-line
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-data-table
                  height="400"
                  :headers="players_headers"
                  :items="memberactivities"
                  item-key="participant_id"
                  class="elevation-1"
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
                <v-btn
                  text
                  color="primary"
                  @click="saveData('member_activities')"
                >
                  Export
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * @typedef {import("@/types/guest_passes").GuestPass } GuestPass;
 * @typedef {import("@/types/memberactivity").MemberActivity } MemberActivity;
 * @typedef {import("@/types/playerstats").PlayerStats } PlayerStats;
 */

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
import { notification } from "@/components/mixins/NotificationMixin";
import { mdiPencil } from "@mdi/js";

import { object, date, array, number, string } from "yup";

//Set up schema for player stats.

const playerStatsSchema = array()
  .of(
    object({
      date: date()
        .required()
        .typeError('Invalid date format. Expected "YYYY-MM-DD'),
      time_played: number()
        .required()
        .min(0)
        .typeError("Invalid time played value"),
      player_count: number()
        .required()
        .min(0)
        .typeError("Invalid player count value"),
    }),
  )
  .min(1, "No data available");

const memberActvitySchema = array()
  .of(
    object({
      activity_id: number()
        .required()
        .positive()
        .typeError("Invalid activity ID"),
      player: string().required().typeError("Invalid player name"),
      member_role: string().required().typeError("Invalid member role"),
      date: date()
        .required()
        .typeError('Invalid date format. Expected "YYYY-MM-DD'),
      court: string().required().typeError("Invalid court name"),
      start: string().required().typeError("Invalid start time"),
      dur_min: number().required().min(0).typeError("Invalid duration"),
      player_type: string().required().typeError("Invalid player type"),
    }),
  )
  .typeError("Invalid data format");

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
  mixins: [notification],
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      pencilIcon: mdiPencil,
      dateseldialog: false,
      dates: [],
      hostmembersearch: "",
      matchsearch: "",
      // guest_passes_headers: [
      //   {
      //     text: "Purchased",
      //     align: "start",
      //     value: "created",
      //     width: 200,
      //   },
      //   {
      //     text: "Guest",
      //     align: "start",
      //     value: "guest",
      //     width: 150,
      //   },
      //   {
      //     text: "Host",
      //     align: "start",
      //     value: "host",
      //     width: 150,
      //   },
      //   {
      //     text: "Pass Type",
      //     align: "start",
      //     value: "pass_type_label",
      //     width: 150,
      //   },

      //   {
      //     text: "Valid From",
      //     align: "start",
      //     value: "valid_from",
      //     width: 200,
      //     sortable: false,
      //   },
      //   {
      //     text: "Valid To",
      //     align: "start",
      //     value: "valid_to",
      //     width: 200,
      //     sortable: false,
      //   },
      //   {
      //     text: "Actions",
      //     value: "actions",
      //     sortable: false,
      //   },
      // ],
      /**
       * @type {Array<GuestPass>}
       */
      // guest_passes_data: [],
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
          text: "Member Role",
          align: "start",
          value: "member_role",
        },
        {
          text: "Date",
          align: "start",
          value: "date",
          width: 150,
        },
        {
          text: "Court",
          align: "start",
          value: "court",
        },
        {
          text: "Start",
          align: "start",
          value: "start",
          sortable: false,
        },
        {
          text: "Duration",
          align: "start",
          value: "dur_min",
          sortable: false,
        },
        {
          text: "Player type",
          align: "start",
          value: "player_type",
          width: 150,
        },
      ],
      /**
       * @type {Array<MemberActivity>}
       */
      memberactivities: [],
      playersChartOptions: {
        // dataZoom: [
        //   {
        //     id: "dataZoomX",
        //     type: "slider",
        //     xAxisIndex: [0],
        //     zoomLock: false,
        //     start: 0,
        //     end: 100,
        //     filterMode: "none",
        //     realtime: false,
        //   },
        // ],
        // tooltip: {
        //   trigger: "axis",
        //   axisPointer: { type: "line" },
        // },
        legend: {},
        xAxis: [
          {
            type: "category",
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {},
            data: [
              // "08/12",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Minutes",
            position: "right",
            axisLabel: {
              formatter: "{value}",
            },
          },
          {
            type: "value",
            name: "Count",
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
  computed: {
    orderedDates() {
      if (Array.isArray(this.dates) && this.dates.length == 2) {
        let d1 = new Date(this.dates[0] + "T00:00:00Z");
        let d2 = new Date(this.dates[1] + "T00:00:00Z");
        if (d1 < d2) {
          return [this.dates[0], this.dates[1]];
        } else {
          return [this.dates[1], this.dates[0]];
        }
      }

      //If there is only one date, return it
      if (Array.isArray(this.dates) && this.dates.length == 1) {
        return [this.dates[0], this.dates[0]];
      }

      return [null, null];
    },

    startDate() {
      return this.orderedDates[0];
    },

    endDate() {
      return this.orderedDates[1];
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
      this.$dayjs().tz().subtract(1, "month").format("YYYY-MM-DD"),
    );
    this.dates.push(this.$dayjs().tz().format("YYYY-MM-DD"));
  },
  beforeDestroy() {
    this.$refs["playerchart"].dispose();
  },
  methods: {
    /**
     * Populate the player chart with data
     * @param {Array<PlayerStats>} playerdata
     */
    setPlayerChartData(playerdata) {
      this.validatePlayerStats(playerdata)
        .then(() => {
          this.playersChartOptions.xAxis[0].data = playerdata.map(
            (d) => d.date,
          );
          this.playersChartOptions.series[0].data = playerdata.map(
            (d) => d.time_played,
          );
          this.playersChartOptions.series[1].data = playerdata.map(
            (d) => d.player_count,
          );
        })
        .catch((error) => {
          this.showNotification(error.message, "error");
        });
    },
    /**
     * Set the member activity data
     * @param {Array<MemberActivity>} data
     */
    setMemberActivity(data) {
      this.validateMemberActivity(data)
        .then(() => {
          this.memberactivities = data;
        })
        .catch((error) => {
          this.showNotification(error.message, "error");
        });
    },
    async validateMemberActivity(data) {
      await memberActvitySchema.validate(data);
    },
    async validatePlayerStats(data) {
      await playerStatsSchema.validate(data);
    },
    async getMemberActivityData() {
      return this.memberactivities;
    },
    async getPlayerStatsData() {
      return this.playersChartOptions.xAxis[0].data.map((date, index) => {
        return {
          date: date,
          time_played: this.playersChartOptions.series[0].data[index],
          player_count: this.playersChartOptions.series[1].data[index],
        };
      });
    },
    saveData: function (op_type) {
      //A list of available save functions
      const SUPPORTED_OPS = {
        member_activities: {
          filename: "member_activities",
          datafunc: "getMemberActivityData",
        },
        player_stats: {
          filename: "player_stats",
          datafunc: "getPlayerStatsData",
        },
      };

      //Check if type is set and it is a valid save function
      if (
        op_type &&
        Object.prototype.hasOwnProperty.call(SUPPORTED_OPS, op_type)
      ) {
        //If so, use that save function
        this.saveDataToCSV(
          SUPPORTED_OPS[op_type].filename,
          SUPPORTED_OPS[op_type].datafunc,
        );
      } else {
        this.showNotification("Invalid data function config", "error");
      }
    },
    saveDataToCSV: function (filename, datafunc) {
      //Check if datafunc is a function
      if (typeof this[datafunc] !== "function") {
        this.showNotification("Invalid data function config", "error");
        return;
      }

      //Get the data
      this[datafunc]()
        .then((data) => {
          //Check if data is an array
          if (Array.isArray(data) && data.length > 0) {
            let csv = papaparse.unparse(data);
            let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `${filename}-${this.startDate}-${this.endDate}.csv`, {
              autoBom: true,
            });
          } else {
            this.showNotification("No data available", "error");
          }
        })
        .catch((error) => {
          this.showNotification(
            error.message || "Unable to load data",
            "error",
          );
        });
    },
    onResize: function () {
      this.$refs["playerchart"].resize();
    },
    loadData() {
      this.$store.dispatch("setLoading", true);
      Promise.all([
        apihandler.runReport("playerstats", this.startDate, this.endDate),
        apihandler.runReport("memberactivities", this.startDate, this.endDate),
      ])
        .then((responses) => {
          this.setPlayerChartData(responses[0].data.result);
          this.setMemberActivity(responses[1].data.result);
        })
        .catch((error) => {
          this.showNotification(
            error.message || "Unable to load data",
            "error",
          );
        })
        .finally(() => {
          this.$store.dispatch("setLoading", false);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
