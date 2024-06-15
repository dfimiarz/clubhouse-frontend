<template>
  <v-container v-resize="onResize">
    <v-row justify="center" align="start">
      <v-col cols="12" lg="8">
        <v-row justify="start" align="start" dense>
          <v-col cols="12">
            <v-card raised>
              <v-card-title class="text-h5"> Player Reports </v-card-title>
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12" md="6" lg="3">
                    <date-range-selector
                      :dates.sync="dates"
                      :show.sync="dateseldialog"
                    ></date-range-selector>
                  </v-col>
                  <v-col cols="12">
                    <v-responsive height="400px">
                      <v-chart
                        ref="playerchart"
                        :option="playersChartOptions"
                        @datazoom="onSliderChange"
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
              <v-card-title class="text-h5"> Player Data </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    Date Range: {{ sliderStart }} - {{ sliderEnd }}
                  </v-col>
                  <v-col cols="6">
                    <div class="d-flex justify-end align-start">
                      <v-checkbox
                        v-model="slidersync"
                        label="Slider Sync"
                        hide-details
                        desnse
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
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
  DataZoomComponent,
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
  DataZoomComponent,
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
      slidersync: true,
      sliderStart: null,
      sliderEnd: null,
      playerListDateStart: null,
      playerListDateEnd: null,
      dates: [],
      hostmembersearch: "",
      matchsearch: "",
      guest_passes_headers: [
        {
          text: "Purchased",
          align: "start",
          value: "created",
          groupable: false,
          width: 200,
        },
        {
          text: "Guest",
          align: "start",
          value: "guest",
          width: 150,
        },
        {
          text: "Host",
          align: "start",
          value: "host",
          width: 150,
        },
        {
          text: "Pass Type",
          align: "start",
          value: "pass_type_label",
          width: 150,
          groupable: false,
        },

        {
          text: "Valid From",
          align: "start",
          value: "valid_from",
          width: 200,
          sortable: false,
          groupable: false,
        },
        {
          text: "Valid To",
          align: "start",
          value: "valid_to",
          width: 200,
          sortable: false,
          groupable: false,
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          groupable: false,
        },
      ],
      /**
       * @type {Array<GuestPass>}
       */
      guest_passes_data: [],
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
      /**
       * @type {Array<MemberActivity>}
       */
      memberactivities: [],
      playersChartOptions: {
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            xAxisIndex: [0],
            zoomLock: false,
            start: 0,
            end: 100,
            filterMode: "none",
          },
        ],
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

    startdate() {
      return this.orderedDates[0];
    },

    enddate() {
      return this.orderedDates[1];
    },
    /**
     * Get the start date for the activity filter
     */
    ativityFilterStart() {
      return this.sliderStart || this.startdate;
    },
    /**
     * Get the end date for the activity filter
     */
    activityFilterEnd() {
      return this.sliderEnd || this.enddate;
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

    //TO DO: Add JSDoc type definitions
    /**
     * Populate the player chart with data
     * @param {Array<PlayerStats>} playerdata
     */
    populatePlayerChart(playerdata) {
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
    onSliderChange: function () {
      const startIndex =
        this.$refs["playerchart"].getOption().dataZoom[0].startValue;
      const endIndex =
        this.$refs["playerchart"].getOption().dataZoom[0].endValue;

      this.sliderStart = this.playersChartOptions.xAxis[0].data[startIndex];
      this.sliderEnd = this.playersChartOptions.xAxis[0].data[endIndex];
    },
    saveData: function (op_type) {
      //A list of available save functions
      const SUPPORTED_OPS = {
        guest_players: {
          filename: "guest_players",
          data: this.guest_passes_data,
        },
        member_activities: {
          filename: "member_activities",
          data: this.memberactivities,
        },
        // player_stats: {
        //   filename: "player_stats",
        //   data: this.playerStats,
        // },
      };

      //Check if type is set and it is a valid save function
      if (
        op_type &&
        Object.prototype.hasOwnProperty.call(SUPPORTED_OPS, op_type) &&
        SUPPORTED_OPS[op_type].data.length > 0
      ) {
        //If so, use that save function
        this.saveDataToCSV(
          SUPPORTED_OPS[op_type].filename,
          SUPPORTED_OPS[op_type].data,
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
        //apihandler.runReport("guestpasses", this.startdate, this.enddate),
      ])
        .then((responses) => {
          this.populatePlayerChart(responses[0].data.result);
          this.setMemberActivity(responses[1].data.result);
          //this.guest_passes_data = responses[2].data.result;
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
