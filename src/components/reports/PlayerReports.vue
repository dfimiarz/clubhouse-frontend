<template>
  <v-container v-resize="onResize">
    <v-row justify="start" align="start">
      <v-col cols="12">Player Reports </v-col>
      <v-col cols="12" sm="6" lg="4">
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="dates"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Report date range"
              :prepend-icon="calendarIcon"
              readonly
              v-bind="attrs"
              v-on="on"
              :append-outer-icon="arrowIcon"
            ></v-text-field>
          </template>
          <v-date-picker v-model="dates" scrollable range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(dates)">
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
      <v-col cols="12">
        <v-card height="300px" raised>
          <v-chart :option="playersChartOptions" ref="playerchart"></v-chart>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Hosts and Guests
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
              item-key="session_id"
              sort-by="guestname"
              group-by="hostname"
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
            <v-btn text> Email Report </v-btn>
            <v-spacer></v-spacer>
            <v-btn text> Reload </v-btn>
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
              :items="players"
              item-key="row_id"
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
            <v-btn text> Email Report </v-btn>
            <v-spacer></v-spacer>
            <v-btn text> Reload </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { BarChart, LineChart } from "echarts/charts";
import {
  TitleComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

import { mdiArrowRightThick, mdiCalendar } from "@mdi/js";

use([
  SVGRenderer,
  BarChart,
  TitleComponent,
  GridComponent,
  LineChart,
  LegendComponent,
  TooltipComponent,
]);

export default {
  name: "PlayerReports",
  components: { VChart },
  provide: {
    [THEME_KEY]: "dark",
  },
  data: () => {
    return {
      arrowIcon: mdiArrowRightThick,
      calendarIcon: mdiCalendar,
      modal: false,
      dates: [],
      hostmembersearch: "",
      matchsearch: "",
      guest_players_headers: [
        {
          text: "Host",
          align: "start",
          value: "hostname",
          width: 150,
        },
        {
          text: "Guest",
          align: "start",
          value: "guestname",
          width: 150,
        },
        {
          text: "Date Active",
          align: "start",
          value: "dateplayed",
          width: 150,
        },
      ],
      guest_players_data: [
        {
          session_id: 1,
          hostid: 100,
          hostname: "Laurent Mars",
          guestname: "Daniel Fimiarz",
          dateplayed: "2022-05-01",
        },
        {
          session_id: 2,
          hostid: 100,
          hostname: "Laurent Mars",
          guestname: "John Smith",
          dateplayed: "2022-05-01",
        },
        {
          session_id: 3,
          hostid: 101,
          hostname: "Myron Levine",
          guestname: "John Smith",
          dateplayed: "2022-05-03",
        },
        {
          session_id: 4,
          hostid: 100,
          hostname: "Laurent Mars",
          guestname: "Daniel Fimiarz",
          dateplayed: "2022-06-01",
        },
        {
          session_id: 5,
          hostid: 100,
          hostname: "Laurent Mars",
          guestname: "Daniel Fimiarz",
          dateplayed: "2022-07-01",
        },
        {
          session_id: 6,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Elon Musk",
          dateplayed: "2022-06-15",
        },
        {
          session_id: 7,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Jack Dorsey",
          dateplayed: "2022-06-15",
        },
        {
          session_id: 8,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Bill Gates",
          dateplayed: "2022-06-15",
        },
        {
          session_id: 9,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Donald Trump",
          dateplayed: "2022-06-15",
        },
        {
          session_id: 10,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Donald Trump",
          dateplayed: "2022-07-15",
        },
        {
          session_id: 11,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Donald Trump",
          dateplayed: "2022-08-15",
        },
        {
          session_id: 12,
          hostid: 102,
          hostname: "Ray Habib",
          guestname: "Donald Trump",
          dateplayed: "2022-05-15",
        },
      ],
      players_headers: [
        {
          text: "Match ID",
          align: "start",
          value: "match_id",
        },
        {
          text: "name",
          align: "start",
          value: "name",
          width: 150,
        },
        {
          text: "date",
          align: "start",
          value: "date",
          width: 150,
        },
        {
          text: "time",
          align: "start",
          value: "time",
          groupable: false,
          sortable: false,
        },
        {
          text: "duration",
          align: "start",
          value: "duration",
          groupable: false,
          sortable: false,
        },
        {
          text: "type",
          align: "start",
          value: "playertype",
          width: 150,
        },
      ],
      players: [
        {
          row_id: "100_1",
          match_id: 1,
          name: "Laurent Mars",
          date: "2022-06-01",
          time: "13:00",
          duration: 60,
          playertype: "Non-Repeater",
        },
        {
          row_id: "100_2",
          match_id: 2,
          name: "Laurent Mars",
          date: "2022-06-01",
          time: "15:00",
          duration: 30,
          playertype: "First-Repeater",
        },
        {
          row_id: "100_3",
          match_id: 3,
          name: "Laurent Mars",
          date: "2022-06-01",
          time: "15:45",
          duration: 30,
          playertype: "Second-Repeater",
        },
        {
          row_id: "101_1",
          match_id: 1,
          name: "Ray Habib",
          date: "2022-06-01",
          time: "13:00",
          duration: 60,
          playertype: "Non-Repeater",
        },
        {
          row_id: "101_2",
          match_id: 2,
          name: "Ray Habib",
          date: "2022-06-01",
          time: "15:00",
          duration: 30,
          playertype: "First-Repeater",
        },
        {
          row_id: "101_3",
          match_id: 3,
          name: "Ray Habib",
          date: "2022-06-01",
          time: "15:45",
          duration: 30,
          playertype: "Second-Repeater",
        },
        {
          row_id: "101_4",
          match_id: 4,
          name: "Ray Habib",
          date: "2022-06-02",
          time: "13:00",
          duration: 60,
          playertype: "Non-Repeater",
        },
        {
          row_id: "101_5",
          match_id: 5,
          name: "Ray Habib",
          date: "2022-06-02",
          time: "15:00",
          duration: 30,
          playertype: "First-Repeater",
        },
        {
          row_id: "101_6",
          match_id: 6,
          name: "Ray Habib",
          date: "2022-06-02",
          time: "15:45",
          duration: 30,
          playertype: "Second-Repeater",
        },
        {
          row_id: "102_4",
          match_id: 4,
          name: "Todd Snyder",
          date: "2022-06-02",
          time: "13:00",
          duration: 60,
          playertype: "Non-Repeater",
        },
        {
          row_id: "102_5",
          match_id: 5,
          name: "Todd Snyder",
          date: "2022-06-02",
          time: "15:00",
          duration: 30,
          playertype: "First-Repeater",
        },
        {
          row_id: "102_6",
          match_id: 6,
          name: "Todd Snyder",
          date: "2022-06-02",
          time: "15:45",
          duration: 30,
          playertype: "Second-Repeater",
        },
      ],
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
              "08/12",
              "08/13",
              "08/14",
              "08/15",
              "08/16",
              "08/17",
              "08/18",
              "08/19",
              "08/20",
              "08/21",
              "08/22",
              "08/23",
              "08/24",
              "08/25",
              "08/26",
              "08/27",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "Min Played",
            min: 0,
            max: 200,
            position: "right",
            axisLabel: {
              formatter: "{value} min",
            },
          },
          {
            type: "value",
            name: "Player Count",
            min: 0,
            max: 25,
            position: "left",
            axisLabel: {
              formatter: "{value}",
            },
          },
        ],
        series: [
          {
            data: [
              50, 60, 100, 120, 30, 40, 120, 0, 50, 60, 100, 120, 30, 40, 120,
              0,
            ],
            type: "line",
            yAxisIndex: 0,
            name: "Minutes Played",
          },
          {
            data: [3, 7, 7, 6, 5, 2, 5, 0, 3, 7, 7, 6, 5, 2, 5, 0],
            type: "bar",
            yAxisIndex: 1,
            name: "Player Count",
          },
        ],
        renderer: "svg",
      },
    };
  },
  methods: {
    onResize: function () {
      this.$refs["playerchart"].resize();
      // this.$refs["bar2"].resize();
      // this.$refs["bar3"].resize();
    },
  },
  computed: {
    dateRangeText() {
      return !!this.dates ? this.dates.join(" ~ ") : null;
    },
  },
  mounted() {
    /**
     * Load dates for past seven days
     */
    this.dates.push(this.$dayjs().tz().subtract(7, "day").format("YYYY-MM-DD"));
    this.dates.push(this.$dayjs().tz().format("YYYY-MM-DD"));
  },
  destroyed() {
    this.$refs["playerchart"].dispose();
    // this.$refs["bar2"].dispose();
    // this.$refs["bar3"].dispose();
  },
  watch: {
    dates: function (newval, oldval) {
      console.log(newval, oldval);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
