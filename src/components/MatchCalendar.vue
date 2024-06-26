<template>
  <div>
    <v-container :fluid="$vuetify.breakpoint.lgAndDown" class="py-0">
      <v-row align="start" no-gutters="" justify="center">
        <v-col cols="12">
          <v-row
            align="center"
            justify="space-between"
            no-gutters=""
            class="py-1"
          >
            <v-col cols="auto">
              <v-menu
                v-if="!simplifiedDisplay"
                v-model="datemenu"
                :close-on-content-click="false"
                max-width="290"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    :value="dateISO"
                    label="Selected date"
                    readonly
                    v-bind="attrs"
                    :prepend-inner-icon="calendarIcon"
                    :disabled="loading"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateISO"
                  @change="datemenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="auto">
              <span class="hidden-sm-and-down text-md-h6 mx-1">
                Time: {{ currTimeFormatted }}
              </span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <div ref="scheduleContainer" class="main-schedule-container">
            <div
              class="court-grid-container"
              :style="{
                'grid-template-columns':
                  '40px repeat(' + displayableCourts.length + ',1fr)',
              }"
            >
              <div
                v-for="(court, index) in displayableCourts"
                :key="court.id"
                class="pa-1 court-grid-item"
                :style="{ 'grid-column': index + 2, 'grid-row': 1 }"
              >
                <v-btn
                  v-if="index == 0"
                  :disabled="firstCourt == 0"
                  small=""
                  style="grid-row: 1; grid-column: 1 / span 1"
                  @click="changeDisplayedCourts(-1)"
                >
                  <v-icon>{{ leftArrowIcon }}</v-icon>
                </v-btn>
                <span
                  class="headline"
                  style="grid-row: 1; grid-column: 2 / span 1"
                >
                  {{ court.name }}
                </span>
                <v-btn
                  v-if="index == displayableCourts.length - 1"
                  :disabled="firstCourt + index == courts.length - 1"
                  small=""
                  style="grid-row: 1; grid-column: 3 / span 1"
                  @click="changeDisplayedCourts(1)"
                >
                  <v-icon>{{ rightArrowIcon }}</v-icon>
                </v-btn>
              </div>
            </div>

            <div
              v-if="club_schedule"
              ref="tcontainer"
              class="time-grid-container"
              :style="{
                overflow: simplifiedDisplay ? 'hidden' : 'auto',
                'max-height': `calc(100vh - ${gridHeightAdjust}px`,
              }"
            >
              <div
                v-for="n in totalCellCount * 4"
                :key="n"
                :class="(n - 1) % 4 == 0 ? 'hourly-cell' : 'cell'"
                :style="{ height: cellHeight1H / 4 + 'px' }"
              >
                <span v-if="(n - 1) % 4 == 0">
                  {{ getCellLabel(parseInt((n - 1) / 4)) }}
                </span>
              </div>

              <div
                class="session-grid-container"
                :style="{
                  'grid-template-columns':
                    '40px repeat(' + displayableCourts.length + ',1fr)',
                }"
              >
                <div
                  v-for="(court, index) in displayableCourts"
                  :key="court.id"
                  class="court-sessions-container"
                  :style="{
                    'grid-column': index + 2,
                    'grid-row': 1,
                    height: totalCellCount * cellHeight1H + 'px',
                  }"
                >
                  <transition-group name="fade" mode="out-in">
                    <component
                      :is="getCalendarItemType(item.type)"
                      v-for="item in getBookingsForCourt(court.id)"
                      :key="item.id"
                      :booking="item"
                      :calendar-start="calStartHour"
                    ></component>
                  </transition-group>
                  <inactive-time-frame
                    v-for="(item, indx) in getClosedTimes(court.id)"
                    :key="indx"
                    :calendar-start="calStartHour"
                    :start="item.start"
                    :end="item.end"
                  />
                </div>
              </div>
              <timeindicator
                v-if="timeIndicatorVisible"
                :currtime="currtime"
                :open-min="calStartMin"
                :close-min="calEndMin"
              ></timeindicator>
            </div>
            <div
              v-else
              :style="{
                overflow: simplifiedDisplay ? 'hidden' : 'auto',
                height: `calc(100vh - ${gridHeightAdjust}px`,
              }"
            >
              <v-row
                no-gutters
                align="center"
                justify="center"
                class="fill-height"
              >
                <v-col cols="auto" class="text-center">
                  <v-icon x-large>{{ alertCircleIcon }}</v-icon>
                  <div class="text-caption">Schedule not found.</div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <retry-snackbar
      :color="retrySnackBarConfig.color"
      :message="retrySnackBarConfig.message"
      :show.sync="retrySnackBarConfig.visible"
      :loading="loading"
      :show-retry-button="!simplifiedDisplay"
      :counter="tickCounter"
      @retry:action="loadDataAndSubscribe"
    ></retry-snackbar>
  </div>
</template>

<script>
import {
  BOOKING_TYPE_MATCH,
  BOOKING_TYPE_LESSON,
} from "../constants/constants";

import {
  mdiCalendar,
  mdiArrowLeftBold,
  mdiArrowRightBold,
  mdiAlertCircle,
} from "@mdi/js";

import MatchItem from "./calendar/MatchItem.vue";
import TimeIndicator from "./TimeIndicator";
import dbservice from "../services/db";
import Pusher from "pusher-js";
import EventItem from "./calendar/EventItem.vue";
import LessonItem from "./calendar/LessonItem.vue";
import RetrySnackbar from "./RetrySnackBar.vue";
import InactiveTimeFrame from "./calendar/InactiveTimeFrame.vue";

var pusher = null;
var channel = null;
const channelname = "bookings";

//Number of ticks to wait before retry
const RETRY_TICK_COUNT = 10;
//Timer tick in milliseconds
const TIMER_INTERVAL_MS = 1000;

let timerHandle = null;

export default {
  name: "MatchCalendar",
  components: {
    //session: Session,
    "match-item": MatchItem,
    "event-item": EventItem,
    "lesson-item": LessonItem,
    timeindicator: TimeIndicator,
    "retry-snackbar": RetrySnackbar,
    "inactive-time-frame": InactiveTimeFrame,
  },
  data: function () {
    return {
      calendarIcon: mdiCalendar,
      leftArrowIcon: mdiArrowLeftBold,
      rightArrowIcon: mdiArrowRightBold,
      alertCircleIcon: mdiAlertCircle,
      milTimeLabels: [
        "12",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
      civTimeLabels: [
        "12 am",
        "1 am",
        "2 am",
        "3 am",
        "4 am",
        "5 am",
        "6 am",
        "7 am",
        "8 am",
        "9 am",
        "10 am",
        "11 am",
        "12 pm",
        "1 pm",
        "2 pm",
        "3 pm",
        "4 pm",
        "5 pm",
        "6 pm",
        "7 pm",
        "8 pm",
        "9 pm",
        "10 pm",
        "11 pm",
      ],
      //stores the date for which show bookings
      date: null,
      //stores the date when the variable date was set was last set
      dateSet: null,
      datemenu: false,
      courtSlots: null,
      maxDisplayableCourts: 5,
      firstCourt: 0,
      currtime: null,
      bookings: [],
      timeIndicatorVisible: false, //Controls display of current time indicator
      error: false,
      retrySnackBarConfig: {
        color: null,
        visible: false,
        message: null,
      },
      tickCounter: 0,
    };
  },
  computed: {
    /**
     * Default can day start and end use when there is no court schedules
     */
    default_cal_start_min: function () {
      return this.$store.state.default_cal_start_min;
    },
    default_cal_end_min: function () {
      return this.$store.state.default_cal_end_min;
    },
    dateISO: {
      get: function () {
        return this.$dayjs(this.date).tz().format("YYYY-MM-DD");
      },
      set: function (val) {
        this.date = this.$dayjs(val).tz().format();
      },
    },
    loading: {
      get: function () {
        return this.$store.state.loading;
      },
      set: function (val) {
        this.$store.dispatch("setLoading", val);
      },
    },
    simplifiedDisplay: function () {
      return this.displaymode === "TV";
    },
    displaymode: function () {
      return this.$store.getters["getSetting"]("displaymode");
    },
    calStartHour: function () {
      return Math.floor(this.calStartMin / 60);
    },
    calEndHour: function () {
      return Math.ceil(this.calEndMin / 60);
    },
    courts: function () {
      return this.$store.getters["courtstore/getCourts"];
    },
    hourLabels: function () {
      return this.civTimeLabels.slice(this.calStartHour, this.calEndHour);
    },
    totalCellCount: function () {
      return this.calEndHour - this.calStartHour;
    },
    cellHeight1H: function () {
      return this.$store.getters["calCellHeight1H"];
    },
    maxCourtCount: function () {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 1;
        case "sm":
          return 2;
        case "md":
          return 3;
        case "lg":
          return 5;
        case "xl":
          return 5;
        default:
          return 5;
      }
    },
    displayableCourts: function () {
      const lastIndex = this.firstCourt + this.maxCourtCount;
      /* 
        From docs
        If end [here lastIndex] is greater than the length of the sequence, slice extracts through to the end of the sequence (arr.length).
      */
      return this.courts.slice(this.firstCourt, lastIndex);
    },
    browser_active: function () {
      return this.$store.state.browser_active;
    },
    currTimeFormatted: function () {
      return this.$dayjs(this.currtime).tz().format("hh:mm:ss a");
    },
    gridHeightAdjust: function () {
      //top+footer + time_section + court_sel_section + bottom_buffer
      return (
        this.$vuetify.application.top +
        this.$vuetify.application.footer +
        (this.simplifiedDisplay ? 42 : 78) +
        42 +
        8
      );
    },
    club_schedule: function () {
      return this.$store.getters["getScheduleForDate"](
        this.$dayjs(this.date).tz().unix(),
      );
    },
    closed_time_frames: function () {
      const dayNum = this.$dayjs(this.date).tz().day();
      if (!!this.club_schedule && !!this.club_schedule["closed_time_frames"]) {
        //Find closed time frames for a given day
        const closedTimeFrames = this.club_schedule["closed_time_frames"].find(
          (item) => item.dayofweek === dayNum + 1,
        );

        return closedTimeFrames["time_frames"];
      } else {
        return [];
      }
    },
    calEndMin: function () {
      const dayNum = this.$dayjs(this.date).tz().day();
      if (!!this.club_schedule && !!this.club_schedule["calTimes"]) {
        //Find an item for a given day of week
        const item = this.club_schedule["calTimes"].find(
          (item) => item.dayofweek === dayNum + 1,
        );

        return item.calEndMin;
      } else {
        return null;
      }
    },
    calStartMin: function () {
      const dayNum = this.$dayjs(this.date).tz().day();
      if (!!this.club_schedule && !!this.club_schedule["calTimes"]) {
        //Find an item for a given day of week
        const item = this.club_schedule["calTimes"].find(
          (item) => item.dayofweek === dayNum + 1,
        );

        return item.calStartMin;
      } else {
        return null;
      }
    },
  },
  watch: {
    browser_active: function (newval) {
      if (newval) {
        this.setUp();
      } else {
        //Unsubscribe from pusher if browser is not active
        this.cleanUp();
      }
    },
    error: function (val) {
      if (val) {
        this.unsubsribe();
      } else {
        this.retrySnackBarConfig.visible = false;
      }
    },
    maxCourtCount: function (val) {
      let newFirstCourt = this.firstCourt - val + 1;

      if (newFirstCourt < 0) newFirstCourt = 0;

      this.firstCourt = newFirstCourt;
    },
    date: function (val) {
      //Webworker https://www.youtube.com/watch?v=nwQN55oPAfc

      const curr_date = this.$dayjs().tz().startOf("day").valueOf();
      this.dateSet = curr_date;
      const new_cal_date = this.$dayjs(val).tz().startOf("day").valueOf();

      if (curr_date === new_cal_date) {
        //Show time indicator bar when new_date = current_date
        this.timeIndicatorVisible = true;
      } else {
        //Hide time indicator bar when new_date is not current_date
        this.timeIndicatorVisible = false;
      }

      this.loadBookings(this.dateISO);

      if (this.timeIndicatorVisible) {
        this.$nextTick(function () {
          this.scrollCalendar();
        });
      }
    },
  },
  created: function () {
    this.currtime = this.$dayjs().tz().valueOf();
    this.date = this.$dayjs().tz().startOf("day").format();
    this.setUp();
  },
  beforeDestroy: function () {
    this.cleanUp();
  },
  updated: function () {
    this.$nextTick(function () {
      if (this.simplifiedDisplay) {
        this.scrollCalendar();
      }
    });
  },
  methods: {
    getClosedTimes(court_id) {
      return this.closed_time_frames.filter(
        (timeFrame) => timeFrame.court_id == court_id,
      );
    },
    showRetrySnackBar(message, color = "info") {
      this.retrySnackBarConfig.message = message;
      this.retrySnackBarConfig.color = color;
      this.retrySnackBarConfig.visible = true;
    },
    setUp() {
      //console.log("Setting up");

      //Start the timer
      if (!timerHandle) {
        timerHandle = setInterval(this.timerTickHandler, TIMER_INTERVAL_MS);
      }
      //Load bookings and subscribe if browser is active
      this.loadDataAndSubscribe();
    },
    cleanUp() {
      this.unsubsribe();
      this.bookings.splice(0);
      this.tickCounter = 0;

      //clear the time if still active
      if (timerHandle) {
        clearInterval(timerHandle);
        timerHandle = null;
      }
    },
    getCalendarItemType(type_id) {
      switch (type_id) {
        case BOOKING_TYPE_MATCH:
          return "match-item";
        case BOOKING_TYPE_LESSON:
          return "lesson-item";
        default:
          return "event-item";
      }
    },
    timerTickHandler: function () {
      this.currtime = this.$dayjs().tz().valueOf();
      //Increament the counter when not loading data.
      if (!this.loading) {
        this.tickCounter++;
      }

      // Check if date has changed while running timer
      const curr_date = this.$dayjs().tz().startOf("day").valueOf();

      /*
       * Reset the date variable when it was set on a different calendar date
       * This will force the system change the date when page is left running
       * for a long time.
       */
      if (this.dateSet !== curr_date) {
        this.resetDate();
      }

      // if (curr_date !== curr_cal_date) {
      //   this.resetDate();
      // }

      if (this.error && this.tickCounter % RETRY_TICK_COUNT == 0) {
        this.loadDataAndSubscribe();
      }
    },

    /**
     * scrollCalendar moves the scrollbar to the position corresponding to current time
     */
    scrollCalendar: function () {
      //Get total lenght of the day
      var day_len = (this.calEndHour - this.calStartHour) * 60;

      //Do nothing if day is not "long enough"
      if (day_len < 1) {
        //console.log("Check start and end time")
        return;
      }

      //Check if container has height
      if (
        !(
          this.$refs.tcontainer.clientHeight !== undefined &&
          this.$refs.tcontainer.clientHeight >= 0
        )
      ) {
        //console.log("Element height error")
        return;
      }

      //Check if container has scrollheight
      if (
        !(
          this.$refs.tcontainer.scrollHeight !== undefined &&
          this.$refs.tcontainer.scrollHeight >= 0
        )
      ) {
        //console.log("Scroll Height error")
        return;
      }

      //Get current minutes

      var curr_min =
        this.$dayjs(this.currtime).tz().hour() * 60 +
        this.$dayjs(this.currtime).tz().minute();

      //Make sure that curr_min fits betwen start and end
      var adj_curr_min =
        curr_min <= this.calStartMin
          ? this.calStartMin
          : curr_min >= this.calEndMin
            ? this.calEndMin
            : curr_min;

      //Calculate scroll distance. Scrolling from calStartHour NOT calStartMin
      var initScrollDistance = Math.ceil(
        ((adj_curr_min - this.calStartHour * 60) / day_len) *
          this.$refs.tcontainer.scrollHeight,
      );

      /**
       * initScrollDistance will align top of the container with current time.
       * We drop that value by clientHeigh / 3 to put current time 1/3 of way up
       * of the screen
       */
      var scrollAdjHeight = Math.ceil(this.$refs.tcontainer.clientHeight / 3);

      /**
       * set scrollTop to substracting scrollAjdHeight from initScrollDistnace
       * According to doc scrollTop will ensure that values are not out of bounds
       */
      this.$refs.tcontainer.scrollTop = initScrollDistance - scrollAdjHeight;
    },
    getCellLabel: function (cellnumber) {
      return this.hourLabels[cellnumber];
    },
    getTimeString() {
      return this.date != null
        ? this.$dayjs(this.date).tz().format("ddd, MMM Do")
        : "N/A";
    },
    resetDate() {
      this.date = this.$dayjs().tz().startOf("day").format();
      this.reloadBookings();
    },
    reloadBookings() {
      this.loadBookings(this.$dayjs(this.date).tz().format("YYYY-MM-DD"));
    },
    changeDisplayedCourts: function (step) {
      //Compute next first court to display
      let nextFirstCourt = this.firstCourt + step;

      if (nextFirstCourt < 0) {
        nextFirstCourt = 0;
      }

      let nextLimit = nextFirstCourt + this.maxCourtCount;

      if (nextLimit > this.courts.length) {
        nextFirstCourt -= nextLimit - this.courts.length;
      }

      this.firstCourt = nextFirstCourt;
    },
    getBookingsForCourt(courtid) {
      return this.bookings.filter((booking) => {
        return booking.court == courtid;
      });
    },
    loadBookings(date) {
      //console.log("Loading bookings...");
      if (this.loading) {
        return;
      }

      this.loading = true;

      this.loadAsync(date)
        .then((data) => {
          this.bookings = data;
          this.error = false;
        })
        .catch(() => {
          this.bookings.splice(0);
          this.error = true;
          this.showRetrySnackBar("Unable to load bookings.", "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    subscribe() {
      pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
        cluster: process.env.VUE_APP_PUSHER_CLUSTER,
      });

      channel = pusher.subscribe(channelname);

      channel.bind("booking_change", (data) => {
        //console.log("Got data")

        const dateChanged = data.date;
        const selectedDate = this.$dayjs(this.date).tz().format("YYYY-MM-DD");

        if (dateChanged === selectedDate) {
          this.reloadBookings();
        }
      });
    },
    unsubsribe: function () {
      //Disconnet pusher connections
      if (channel) {
        channel.unbind();
        channel = null;
      }

      if (pusher) {
        pusher.disconnect();
        pusher = null;
      }
    },
    loadDataAndSubscribe() {
      //console.log("Loading bookings with sub");
      if (this.loading) {
        return;
      }

      this.loading = true;

      this.loadAsync(this.$dayjs(this.date).tz().format("YYYY-MM-DD"))
        .then((data) => {
          //console.log("Got results");
          this.bookings = data;
          this.error = false;
          this.subscribe();
        })
        .catch(() => {
          this.error = true;
          this.showRetrySnackBar("Unable to load bookings.", "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async loadAsync(date) {
      const res = await dbservice.getBookings(date);
      return res.data;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-schedule-container {
  border: 1px solid darkgray;
  box-sizing: border-box;
  user-select: none;
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1fr auto;
  /*font-size: calc(10px + 1vw);*/
}

.court-grid-container {
  position: relative;
  display: grid;
  /* grid-template-columns: 40px repeat(5,1fr); */
  /* grid-template-rows: 50px; */
  border: 1px solid;
}

.court-grid-item {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
}

.time-grid-container {
  position: relative;
  grid-column: 1;
  grid-row: 2;
  overflow: auto;
  /* height: calc(100vh - 212px); */
  scroll-behavior: smooth;
}

.session-grid-container {
  position: absolute;
  display: grid;
  /* grid-template-columns: 40px repeat(5,1fr);*/
  grid-template-rows: 1fr;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
}

.court-sessions-container {
  border: 1px solid gray;
  position: relative;
  box-sizing: border-box;
}

.cell {
  border-top: 1px dotted gray;
  box-sizing: border-box;
  font-size: small;
}

.hourly-cell {
  border-top: 3px double gray;
  box-sizing: border-box;
  font-size: small;
}

.court-grid {
  height: 100%;
  border: 1px solid;
}

.change_court_btn {
  position: absolute;
  grid-row: 1;
  height: 100%;
  display: flex;
  align-items: center;
}

.change_court_btn_forward {
  justify-content: flex-end;
}

.change_court_btn_back {
  justify-content: flex-start;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
