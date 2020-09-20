<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="start" class="fill-height" no-gutters>
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-img
            class="white--text"
            height="150px"
            :src="require('@/assets/specialevent.jpg')"
            :lazy-src="require('@/assets/specialevent_small.jpg')"
            gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
          >
            <v-container class="fill-height pa=0" fluid>
              <v-row no-gutters class="fill-height">
                <v-col cols="12" align-self="end">
                  <span class="text-h5">Special Booking</span>
                </v-col>
              </v-row>
            </v-container>
            <v-progress-linear indeterminate v-show="loading" absolute bottom></v-progress-linear>
          </v-img>
          <v-card-text>
            <v-form ref="eventbookingform" lazy>
              <v-row dense>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="manager"
                    :items="managers"
                    label="Organizer"
                    prepend-icon="mdi-account"
                    no-data-text="No available organizers"
                    :rules="[ rules.required ]"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="bookingtype"
                    label="Booking Type"
                    prepend-icon="mdi-form-select"
                    no-data-text="No type found"
                    :rules="[ rules.required ]"
                    :items="bookingtypes"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select
                    label="Court"
                    :items="courts"
                    item-value="id"
                    item-text="name"
                    required
                    :rules="[ rules.required ]"
                    v-model="court"
                    no-data-text="No courts found"
                    prepend-icon="mdi-form-select"
                  ></v-select>
                </v-col>

                <v-col cols="12" md="8">
                  <v-dialog
                    ref="ddialog"
                    v-model="datedialog"
                    :return-value.sync="date"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="formattedDate"
                        label="Booking date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[ rules.required ]"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="datedialog = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.ddialog.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" md="8">
                  <v-dialog
                    ref="stdialog"
                    v-model="stimedialog"
                    :return-value.sync="s_time"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="s_time"
                        label="Start time"
                        prepend-icon="mdi-clock-start"
                        v-on="on"
                        required
                        :rules="[ rules.required ]"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="s_time"
                      class="mt-3"
                      :allowed-minutes="allowedminutes"
                      :min="opentime"
                      :max="maxstarttime"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="stimedialog = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.stdialog.save(s_time)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>
                <v-col cols="12" md="8">
                  <v-dialog
                    ref="etdialog"
                    v-model="etimedialog"
                    :return-value.sync="e_time"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="e_time"
                        label="End time"
                        prepend-icon="mdi-clock-end"
                        v-on="on"
                        required
                        :rules="[ rules.required ]"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="e_time"
                      class="mt-3"
                      :allowed-minutes="allowedminutes"
                      :min="opentime"
                      :max="maxstarttime"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="etimedialog = false">Cancel</v-btn>
                      <v-btn text color="primary" @click="$refs.etdialog.save(e_time)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>

                <v-col cols="12">
                  <v-text-field v-model="note" label="Note"></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined @click="$refs.eventbookingform.reset()">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submitBooking">Book</v-btn>
          </v-card-actions>
          <v-snackbar v-model="snackbar.open" top>
            {{ snackbar.text }}
            <template v-slot:action="{ attrs }">
              <v-btn
                :color="snackbar.color"
                text
                v-bind="attrs"
                @click="snackbar.open = false"
              >Close</v-btn>
            </template>
          </v-snackbar>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apihandler from "./../services/db";
import utils from "./../services/utils";
import moment from "moment-timezone";
import processAxiosError from "../utils/AxiosErrorHandler";

export default {
  components: {},
  name: "EventBooking",
  data: function () {
    return {
      court: null,
      manager: null,
      bookingtype: null,
      managers: [],
      bookingtypes: [],
      snackbar: {
        text: null,
        open: false,
        color: null,
      },
      selplayers: [
        { id: null, repeater: null, playerErrs: [], repeaterErrs: [] },
        { id: null, repeater: null, playerErrs: [], repeaterErrs: [] },
        { id: null, repeater: null, playerErrs: [], repeaterErrs: [] },
        { id: null, repeater: null, playerErrs: [], repeaterErrs: [] },
      ],
      playerErrors: null,
      step: 1,
      datedialog: false,
      stimedialog: false,
      etimedialog: false,
      durDialog: false,
      date: null,
      s_time: null,
      e_time: null,
      sel_duration: 0,
      note: "",
      bumpable: false,
      rules: {
        required: (value) => !!value || "Required.",
        minduration: (value) => value >= 5 || "Min 5 min",
        maxduration: (value) => {
          const max =
            utils.timeToMinutes(value > this.closetime) -
            utils.timeToMinutes(this.s_time);
          return value < max || `Max dur min`;
        },
        notelimit: (v) => v.length <= 256 || "Max 256 characters",
        explainRuleChange: () => {
          return this.duration > this.reqMaxDuration ||
            (this.reqBumpable == 1 && this.bumpable == 0)
            ? "Explain rules overwrite"
            : true;
        },
      },
      loading: false,
      error: null,
    };
  },
  methods: {
    allowedminutes: (m) => m % 5 === 0,
    getPlayerLabel: (index) => "Player " + (index + 1),
    changeBookingParams: function () {
      this.error = null;
      this.step = 2;
    },
    clearPlayers() {
      this.selplayers.forEach((player) => {
        player.id = player.repeater = null;
      });

      this.clearPlayerErrors();
    },
    clearPlayerErrors() {
      this.selplayers.forEach((playerslot) => {
        playerslot.playerErrs.splice(0);
        playerslot.repeaterErrs.splice(0);
      });
      this.playerErrors = null;
    },
    validatePlayerInput() {
      this.clearPlayerErrors();

      let playerCheck = this.selplayers.reduce(
        (accumulator, player, index) => {
          if (player.id !== null) {
            accumulator["players"].indexOf(player.id) != -1
              ? accumulator["errors"].push({
                  index: index,
                  field: "player",
                  message: "Duplicate player",
                })
              : accumulator["players"].push(player.id);

            if (player.repeater === null)
              accumulator["errors"].push({
                index: index,
                field: "repeater",
                message: "Repeater empty",
              });
          }

          return accumulator;
        },
        { players: [], errors: [] }
      );

      //console.log(playerCheck)

      if (playerCheck.players.length == 0) {
        this.playerErrors = "Please select a player";
        return;
      }

      if (playerCheck.errors.length != 0) {
        let that = this;

        playerCheck.errors.forEach((error) => {
          let index = error.index;
          let field = error.field + "Errs";
          let msg = error.message;

          that.selplayers[index][field].push(msg);
        });

        return;
      }

      var time = moment().tz(this.clubtz).format("HH:mm");
      var current_minutes = utils.timeToMinutes(time);

      var minutes = current_minutes % 60;
      var hours = (current_minutes - minutes) / 60;

      var minutes_limit = 5;
      var minutes_rounded = Math.floor(minutes / minutes_limit) * minutes_limit;

      var final_start_minutes = hours * 60 + minutes_rounded + minutes_limit;

      //console.log(current_minutes,hours,minutes,minutes_rounded, final_start_minutes)

      var open_minutes = utils.timeToMinutes(this.opentime);
      var close_minutes = utils.timeToMinutes(this.closetime);

      if (
        final_start_minutes >= open_minutes &&
        final_start_minutes <= close_minutes
      ) {
        this.s_time = utils.minToTime(final_start_minutes);
      }

      if (this.reqMaxDuration) {
        const dur =
          final_start_minutes < close_minutes
            ? final_start_minutes + this.reqMaxDuration < close_minutes
              ? this.reqMaxDuration
              : close_minutes - final_start_minutes
            : 0;
        this.sel_duration = dur;
      }

      this.step = 2;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    validate: function () {
      return true;
    },
    sendData(match) {
      this.loading = true;
      this.error = null;

      let that = this;

      apihandler
        .newMatch(match)
        .then(function () {
          //console.log(response)
          that.loading = false;
          that.$router.push({ name: "calendar" });
        })
        .catch(function (error) {
          // TODO: handle send errors better

          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            that.error = error.response.data;
            //console.log(error.response.status);
            //console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            //console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            //console.log('Error', error.message);
          }
          //console.log(error.config);
        })
        .finally(() => {
          that.loading = false;
        });
    },
    submitBooking: function () {
      if (!this.$refs.eventbookingform.validate()) return false;

      const booking = {
        court: this.court,
        date: this.date,
        start: this.s_time,
        end: this.e_time,
        note: this.note,
        organizer: this.organizer,
        type: this.bookingtype
      };

      //console.log("Will send ", match)
      this.sendData(booking);
    },
    loadData: function () {
      this.loading = true;

      Promise.all([apihandler.getManagers(), apihandler.getBookingTypes()])
        .then((results) => {
          this.managers = results[0].data.map((manager) => {
            return {
              value: manager.id,
              text: `${manager.firstname} ${manager.lastname}`,
            };
          });

          this.bookingtypes = results[1].data
            .filter((type) => type.restricted === 1)
            .map((type) => {
              return {
                value: type.id,
                text: type.lbl,
              };
            });
        })
        .catch((err) => {
          this.showSnackBar(processAxiosError(err), "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    showSnackBar(text, color) {
      this.snackbar.open = true;
      this.snackbar.text = text;
      this.snackbar.color = color;
    },
  },
  watch: {
    reqBumpable: function (newval) {
      this.bumpable = newval;
    },
  },
  computed: {
    clubtz: function () {
      return this.$store.state.clubtz;
    },
    matchConfig: function () {
      return this.selplayers.reduce((cur_val, player) => {
        let val = 0;

        switch (player.repeater) {
          case 1000:
            val = 100;
            break;
          case 2000:
            val = 10;
            break;
          case 3000:
            val = 1;
            break;
          default:
            val = 0;
            break;
        }

        return val + cur_val;
      }, 0);
    },
    bookingRules: function () {
      let rule = this.$store.getters["getBookingRule"](this.matchConfig);
      return rule !== undefined ? rule : {};
    },
    reqMaxDuration: function () {
      return Object.prototype.hasOwnProperty.call(
        this.bookingRules,
        "maxduration"
      )
        ? this.bookingRules.maxduration / 60000
        : null;
    },
    reqBumpable: function () {
      return Object.prototype.hasOwnProperty.call(this.bookingRules, "bumpable")
        ? this.bookingRules.bumpable
        : null;
    },
    courts: function () {
      return this.$store.getters["courtstore/getCourts"];
    },
    eligiblepersons: function () {
      return this.$store.getters["memberstore/getEligiblePersons"];
    },
    repeaterTypes: function () {
      return this.$store.getters["repeaterTypes"];
    },
    startHours: function () {
      return Array(12)
        .fill()
        .map((_, idx) => 1 + idx);
    },
    startMinutes: function () {
      return Array(4)
        .fill()
        .map((_, idx) => 0 + idx * 15);
    },
    playerDetails: function () {
      return this.selplayers.reduce((accumulator, player) => {
        const person = this.$store.getters["memberstore/getEligiblePersonById"](
          player.id
        );
        const repeaterDetails = this.$store.getters["getRepeaterType"](
          player.repeater
        );

        if (person && repeaterDetails) {
          accumulator.push({
            id: player.id,
            firstname: person.firstname,
            lastname: person.lastname,
            repeater: player.repeater,
            repeater_lbl: repeaterDetails.label,
          });
        }

        return accumulator;
      }, []);
    },
    playerInfo: function () {
      return this.selplayers.reduce((accumulator, player) => {
        if (player.id && player.repeater) {
          accumulator.push({ id: player.id, repeater: player.repeater });
        }

        return accumulator;
      }, []);
    },
    formattedDate: {
      get() {
        return this.formatDate(this.date);
      },
      set(val){
        this.date = val
      }
    },
    opentime() {
      return this.$store.state.opentime;
    },
    closetime() {
      return this.$store.state.closetime;
    },
    startmin: function () {
      return utils.timeToMinutes(this.s_time);
    },
    endmin: function () {
      return utils.timeToMinutes(this.e_time);
    },
    duration: function () {
      let dur = this.endmin - this.startmin;
      return dur >= 0 ? dur : 0;
    },
    maxstarttime: function () {
      return utils.minToTime(utils.timeToMinutes(this.closetime) - 5);
    },
  },
  created: function () {
    this.date = moment().tz(this.clubtz).format("Y-MM-DD");

    this.loadData();
  },
  mounted: function () {},
  beforeDestroy() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>