<template>
  <div>
    <v-container v-bind:fluid="$vuetify.breakpoint.lgAndDown" class="py-0">
      <v-row align="start" no-gutters="" justify="center">
        <v-col cols="12">
          <v-row
            align="center"
            justify="space-between"
            no-gutters=""
            class="py-1"
          >
            <v-col cols="auto">
              <v-row align="center" no-gutters="">
                <v-btn
                  color="primary"
                  small
                  outlined
                  @click="resetDate()"
                  class="mr-2"
                  >Today</v-btn
                >

                <v-btn icon @click="changeDay(-1)">
                  <v-icon> mdi-arrow-left-bold </v-icon>
                </v-btn>
                <span class="title mx-1">{{ this.getTimeString() }}</span>
                <v-btn icon @click="changeDay(1)">
                  <v-icon> mdi-arrow-right-bold </v-icon></v-btn
                >
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12">
          <div class="main-schedule-container" ref="scheduleContainer">
            <div
              class="court-grid-container"
              v-bind:style="{
                'grid-template-columns':
                  '40px repeat(' + this.displayableCourts.length + ',1fr)',
              }"
            >
              <div
                class="pa-1 court-grid-item"
                v-for="(court, index) in displayableCourts"
                :key="court.id"
                v-bind:style="{ 'grid-column': index + 2, 'grid-row': 1 }"
              >
                <v-btn
                  v-if="index == 0"
                  :disabled="firstCourt == 0"
                  small=""
                  @click="changeDisplayedCourts(-1)"
                  style="grid-row: 1; grid-column: 1 / span 1"
                  ><v-icon> mdi-arrow-left </v-icon>
                </v-btn>
                <span
                  class="headline"
                  style="grid-row: 1; grid-column: 2 / span 1"
                  >{{ court.name }}</span
                >
                <v-btn
                  v-if="index == displayableCourts.length - 1"
                  :disabled="firstCourt + index == courts.length - 1"
                  small=""
                  @click="changeDisplayedCourts(1)"
                  style="grid-row: 1; grid-column: 3 / span 1"
                  ><v-icon> mdi-arrow-right </v-icon>
                </v-btn>
              </div>
            </div>

            <div class="time-grid-container" v-bind:style="{ overflow: simplifiedDisplay ? 'hidden' : 'auto'}" ref="tcontainer">
              <div
                v-for="n in totalCellCount * 4"
                :key="n"
                :class="(n - 1) % 4 == 0 ? 'hourly-cell' : 'cell'"
                v-bind:style="{ height: cellHeight1H / 4 + 'px' }"
              >
                <span v-if="(n - 1) % 4 == 0">{{
                  getCellLabel(parseInt((n - 1) / 4))
                }}</span>
              </div>

              <div
                class="session-grid-container"
                v-bind:style="{
                  'grid-template-columns':
                    '40px repeat(' + this.displayableCourts.length + ',1fr)',
                }"
              >
                <div
                  v-for="(court, index) in displayableCourts"
                  :key="court.id"
                  class="court-sessions-container"
                  v-bind:style="{
                    'grid-column': index + 2,
                    'grid-row': 1,
                    height: totalCellCount * cellHeight1H + 'px',
                  }"
                >
                  <transition-group name="fade" mode="out-in">
                    <session
                      v-for="match in getBookingsForCourt(court.id)"
                      :key="match.id"
                      :session="match"
                    >
                    </session>
                  </transition-group>
                </div>
              </div>
              <timeindicator
                :currtime="currtime"
                v-if="timeIndicatorVisible"
              ></timeindicator>
            </div>
          </div>
          <v-btn
            fixed=""
            fab
            bottom
            right
            color="primary"
            :to="{ name: 'MatchBooking' }"
            v-show="!simplifiedDisplay"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-overlay :value="overlay_visible">
      <v-progress-circular indeterminate size="64" v-if="loading"></v-progress-circular>
      
      <div class="d-flex flex-column justify-center text-h6" v-else-if="! connected">
          <div class="text-center">Connection Lost</div>
          <div class="text-center">waiting to reconnect ...</div>
      </div>
      <div class="d-flex flex-column justify-center text-h6" v-else-if="connectionError">
          <div class="text-center pb-2">Connection Error</div>
          <v-btn @click="reloadBookings">Reload</v-btn>
      </div>
      
    </v-overlay>
  </div>
</template>

<script>
import Session from "./Session";
import TimeIndicator from "./TimeIndicator";
import dbservice from "../services/db";
import processAxiosError from "../utils/AxiosErrorHandler";
import Pusher from 'pusher-js'


var pusher = null;
var channel = null;
const channelname = "bookings";
//Timer tick durations
const TIMER_DUR = 10000;

export default {
  components: {
    session: Session,
    timeindicator: TimeIndicator,
  },
  name: "MatchCalendar",
  data: function () {
    return {
      message: "This is grid view",
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
      dialog: false,
      date: null,
      courtSlots: null,
      maxDisplayableCourts: 5,
      firstCourt: 0,
      resizeTimeout: null,
      currtime: null,
      menu2: false,
      timerHandle: null,
      showTimeIndicator: true,
      bookings: [],
      loading: false,
      timeIndicatorVisible: false,
      autoscroll: false,
      connectionError: false

    };
  },
  methods: {

    timerTickHanlder: function(){

      this.currtime = this.$dayjs().valueOf();

      //Check if date has changed while running timer
      const curr_date = this.$dayjs().startOf('day').valueOf();
      const curr_cal_date = this.$dayjs(this.date).startOf('day').valueOf();

      //Reset date and timer when calendar date is not the same a current date
      if( curr_date !== curr_cal_date){
        clearInterval(this.timerHandle);
        this.timerHandle = null;
        this.resetDate();
      }

      if( this.connectionError ){
        //console.log("Trying to reconnect")
        this.loadDataAndSubscribe();
      }
    },

    /**
     * scrollCalendar moves the scrollbar to the position corresponding to current time
     */
    scrollCalendar: function () {
      //Get total lenght of the day
      var day_len = this.endMin - this.startMin;

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
        this.$dayjs(this.currtime).hour() * 60 +
        this.$dayjs(this.currtime).minute();

      //Adjust current minuate for start and end
      var adj_curr_min =
        curr_min <= this.startMin
          ? this.startMin
          : curr_min >= this.endMin
          ? this.endMin
          : curr_min;

      //Calculate scroll distance
      var initScrollDistance = Math.ceil(
        ((adj_curr_min - this.startMin) / day_len) *
          this.$refs.tcontainer.scrollHeight
      );


      /**
       * initScrollDistance will align top of the container with current time.
       * We drop that value by clientHeigh / 2 to put current time right in the middle
       * of the screen
       */
      var scrollAdjHeight = Math.ceil(this.$refs.tcontainer.clientHeight / 2);
      
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
        ? this.$dayjs(this.date).format("ddd, MMM Do")
        : "N/A";
    },
    changeDay(day_diff) {

      this.date = this.$dayjs(this.date).add(day_diff, "day").format();
      this.loadBookings(this.$dayjs(this.date).format("YYYY-MM-DD"));
    },
    resetDate() {
      this.date = this.$dayjs().startOf('day').format();
      this.reloadBookings();
      
    },
    reloadBookings(){
      this.loadBookings(this.$dayjs(this.date).format("YYYY-MM-DD"));
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
      if( ! this.connected ){
        return;
      }

      this.loading = true;
      

      this.loadAsync(date).then((data) => {
        this.bookings = data;
        this.connectionError = false;
      })
      .catch((err) => {
        this.bookings.splice(0);
        const error = processAxiosError(err);
        if( error === "Connection Error."){
         
          if( this.simplifiedDisplay ){
            this.connectionError = true;
          } else {
            this.$emit("show:message", "Error: " + error, "error");
          }

        }
      })
      .finally(() => {
        this.loading = false;
      
      });
    },
    subscribe(){

      pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, { cluster: process.env.VUE_APP_PUSHER_CLUSTER })

      // pusher.connection.bind('state_change',(states) => {
      //   console.log("Pusher: ",states.current)
      // })

      channel = pusher.subscribe(channelname)


      channel.bind('booking_change', (data) => {
      
        //console.log("Got data")

        const dateChanged = data.date;
        const selectedDate = this.$dayjs(this.date).format("YYYY-MM-DD");

        if( dateChanged === selectedDate && !this.loading){
          
          this.reloadBookings();
          
        }
        
      })
    },
    unsubsribe: function(){

      console.log("Unsub");

      //Disconnet pusher connections
      if( channel ){
        channel.unbind();
        channel = null;
      }

      if( pusher ){
        // pusher.connection.unbind('state_change');
        pusher.disconnect();
        pusher = null;
      }
    },
    loadDataAndSubscribe(){

      if( ! this.connected ){
        return;
      }

      this.loading = true;
      
      this.loadAsync(this.$dayjs(this.date).format("YYYY-MM-DD")).then((data) => {
        //console.log("Got results");
        this.bookings = data;
        this.connectionError = false;
        this.subscribe();
      }).catch((err) => {
        const error = processAxiosError(err);
        if( error === "Connection Error."){
         
          if( this.simplifiedDisplay ){
            this.connectionError = true;
          } else {
            this.$emit("show:message", "Error: " + error, "error");
          }
        }
      }).finally(() => {
        this.loading = false;
      });
    },

    async loadAsync(date){
      const res = await dbservice.getBookings(date)
      return res.data

    }
  },
  computed: {
    simplifiedDisplay: function(){
      return this.displaymode === "TV"
    },
    displaymode: function(){
      return this.$store.getters['getSetting']('displaymode');
    },
    connected: function(){
      return this.$store.state.connected;
    },
    overlay_visible: function(){
      return this.loading || ! this.connected || this.connectionError
    },
    clubtz: function () {
      return this.$store.state.clubtz;
    },
    startMin: function () {
      return this.$store.getters["openMin"];
    },
    endMin: function () {
      return this.$store.getters["closeMin"];
    },
    startHour: function () {
      return Math.floor(this.startMin / 60);
    },
    endHour: function () {
      return Math.ceil(this.endMin / 60);
    },
    courts: function () {
      return this.$store.getters["courtstore/getCourts"];
    },
    hourLabels: function () {
      return this.civTimeLabels.slice(this.startHour, this.endHour);
    },
    totalCellCount: function () {
      return this.endHour - this.startHour;
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

    visiableCourtSlots: function () {
      return null;
    },
    displayableCourts: function () {
      const lastIndex = this.firstCourt + this.maxCourtCount;
      /* 
        From docs
        If end [here lastIndex] is greater than the length of the sequence, slice extracts through to the end of the sequence (arr.length).
      */
      return this.courts.slice(this.firstCourt, lastIndex);
    }
  },
  created: function () {

    this.$dayjs.tz.setDefault(this.clubtz);

    this.currtime = this.$dayjs().valueOf();
    this.date = this.$dayjs().startOf('day').format();
    this.loadDataAndSubscribe()
  },
  beforeDestroy: function () {

    this.unsubsribe();

    this.bookings.splice(0);

    //clear the time if still active
    if ( this.timerHandle ) {
      clearInterval(this.timerHandle);
    } 
    
  },
  updated: function(){
    if( this.simplifiedDisplay ){
          this.scrollCalendar();
      }
  },
  watch: {
    connectionError: function(val){
      if( val ){
        this.unsubsribe()
      }
    },
    //Watch connected status in store. Load Bookings if connected becomes true
    connected: function(val){
      if( val ){
        this.loadDataAndSubscribe();
      } else {
        this.unsubsribe();
      }
    },
    maxCourtCount: function (val) {
      let newFirstCourt = this.firstCourt - val + 1;

      if (newFirstCourt < 0) newFirstCourt = 0;

      this.firstCourt = newFirstCourt;
    },
    date: function (val) {

      //Webworker https://www.youtube.com/watch?v=nwQN55oPAfc

      const curr_date = this.$dayjs().startOf('day').valueOf();
      const new_cal_date = this.$dayjs(val).startOf('day').valueOf();

      if( curr_date === new_cal_date ){

        //Show time indicator bar when new_date = current_date
        this.timeIndicatorVisible = true;

        //Set up timer to tick every TIMER_DUR seconds;s
        this.timerHandle = setInterval(this.timerTickHanlder, TIMER_DUR);

      }
      else{

        //Hide time indicator bar when new_date = current_date
        this.timeIndicatorVisible = false;

        //Stop the timer
        if ( this.timerHandle ) {
          clearInterval(this.timerHandle);
          this.timerHandle = null;
        } 
      }

      //If time inidicator is visible, scroll calendar to focus on it.
      if (this.timeIndicatorVisible) {
        this.scrollCalendar();
      }
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
  height: calc(100vh - 212px);
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
