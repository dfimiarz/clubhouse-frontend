<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height" no-gutters>
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">Players</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">Court and time</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Confirm</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="2">
              <v-container fluid>
                <v-form ref="sessionform" lazy-validation>
                  <v-row dense>
                    <v-col cols="12" md="6">

                      <v-text-field 
                        readonly 
                        :value="playerInfo.length"
                        label="Player Count"
                        prepend-icon="mdi-account-multiple" 
                        
                      >

                      </v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-text-field
                            :value="computedDateFormatted"
                            label="Date"
                            prepend-icon="mdi-calendar"
                            readonly
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-row dense>
                        <v-col cols="12" md="6">
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
                                readonly
                                v-on="on"
                                required
                                :rules="[rules.required]"
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
                              <v-btn
                                text
                                color="primary"
                                @click="stimedialog = false"
                                >Cancel</v-btn
                              >
                              <v-btn
                                text
                                color="primary"
                                @click="$refs.stdialog.save(s_time)"
                                >OK</v-btn
                              >
                            </v-time-picker>
                          </v-dialog>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                       <v-row dense align="center" no-gutters>
                          <v-col cols="12" md="6">
                            <duration-picker v-model="sel_duration" :start-time="s_time" :pref="prefDuration" :max="maxDuration"></duration-picker>
                            <div class="warning--text" v-show="duration > prefDuration">
                              <v-icon color="warning"> mdi-alert </v-icon>
                              <span class="pl-2 text-body-2">Club rules: Max duration <b>{{ prefDuration }}</b> min!</span>
                            </div>
                          </v-col>
                       </v-row>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-row dense>
                        <v-col xs6>
                          <v-select
                            label="Court"
                            :items="courts"
                            item-value="id"
                            item-text="name"
                            required
                            :rules="[rules.courtset]"
                            v-model="court"
                            :disabled="duration == 0"
                            prepend-icon="mdi-tennis"
                            return-object
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" v-show="reqBumpable">
                      <v-row no-gutters>
                        <v-col cols="12" md="6">
                        <v-switch
                          dense
                          flat
                          v-model="bumpable"
                          label="Bumpable"
                        ></v-switch>
                        </v-col>
                        <v-col cols="12">
                        <div class="warning--text" v-show="reqBumpable !== bumpable">
                          <v-icon color="warning"> mdi-alert </v-icon>
                          <span class="pl-2 text-body-2">Club Rules: Bumpable <b>ENABLED</b>!</span>
                        </div>
                        </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        counter
                        v-model="note"
                        label="Note"
                        :rules="[rules.notelimit, rules.explainRuleChange]"
                        clearable
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
                <v-row dense>
                  <v-btn
                    color="warning"
                    text
                    outlined
                    class="ma-1"
                    @click="goToBookingStep(1)"
                    >Go back</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn @click="validateSessionInput">Continue</v-btn>
                </v-row>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="1">
              <v-container fluid>
                <v-form ref="playerform">
                  <v-row>
                    <v-col cols="12">
                      <v-alert type="error" dense v-if="playerErrors">{{
                        this.playerErrors
                      }}</v-alert>
                    </v-col>
                    <v-col
                      cols="12"
                      v-for="(player, index) in selplayers"
                      :key="index"
                    >
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <v-autocomplete
                            v-model="selplayers[index].id"
                            :label="getPlayerLabel(index)"
                            :items="eligiblepersons"
                            item-text="name"
                            item-value="id"
                            :error-messages="selplayers[index].playerErrs"
                          ></v-autocomplete>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-select
                            v-model="selplayers[index].repeater"
                            :items="repeaterTypes"
                            label="Repeater status:"
                            item-text="label"
                            item-value="id"
                            :error-messages="selplayers[index].repeaterErrs"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-form>
                <v-row dense>
                  <v-btn
                    color="warning"
                    text
                    outlined
                    class="ma-1"
                    @click="clearPlayers"
                    >Clear</v-btn
                  >
                  <div class="flex-grow-1"></div>
                  <v-btn @click="goToBookingStep(2)" class="ma-1"
                    >Continue</v-btn
                  >
                </v-row>
              </v-container>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-container fluid>
                <v-row>
                  <v-col cols="12" v-if="error">
                    <v-alert type="error">{{ error }}</v-alert>
                  </v-col>
                </v-row>
                <v-row dense class="pb-5">
                  <v-col cols="12">
                    <div class="text-h6 text-md-h4">Booking Summary</div>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <div class="text-caption">Booking type:</div>
                    <div class="text-h6">{{ bookingType }}</div>
                    <div class="text-caption red--text" v-if="errors.date" v-text="errors.type"></div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="text-caption">Court:</div>
                    <div class="text-h6">{{ court.name }}</div>
                    <div class="text-caption red--text" v-if="errors.date" v-text="errors.court"></div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" >
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" md="6" >
                    
                    <div class="text-caption">Date:</div>
                    <div class="text-h6">{{ date }}</div>
                    <div class="text-caption red--text" v-if="errors.date" v-text="errors.date"></div>
                  </v-col>
                  <v-col cols="12" md="6">
                    
                    <div class="text-caption">Time:</div>
                    <div class="text-h6">
                      {{ s_time }} - {{ e_time }}
                    </div>
                    <div class="text-caption red--text" v-if="!!this.errors.start || !!this.errors.end"> Start or End Time Error</div>
                  </v-col>
                  <v-col cols="12" md="6">
                    
                    <div class="text-caption">Duration:</div>
                    <div class="text-h6">
                      {{ duration }} minutes
                    </div>
                    
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" >
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12" class="my-2">
                    <div class="text-subtitle">Players:</div>
                    <div class="text-caption red--text" v-if="errors.players" v-text="errors.players"></div>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                    v-for="(player, index) in playerDetails"
                    :key="index"
                  >
                    <div class="text-h6">
                      {{ player.firstname }} {{ player.lastname }}
                    </div>
                    <div class="text-caption">
                      {{ player.repeater_lbl }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" >
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
                <v-row dense>
                 
                  <v-col cols="12">
                    <div class="text-caption">Bumpable</div>
                    <div class="text-h6">{{ bumpable ? "Yes" : "No" }}</div>
                    <div class="text-caption" v-if="errors.bumpable"> {{ errors.bumpable }}</div>
                  </v-col>
                 
                  <v-col cols="12">
                    <div class="text-caption">Notes</div>
                    <div class="text-body-1">
                      {{ !!(note) ? note : "N/A" }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-btn
                    color="warning"
                    text
                    outlined
                    class="ma-1"
                    @click="changeBookingParams"
                    >Go back</v-btn
                  >
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="loading"
                    :disabled="loading"
                    color="primary"
                    x-large
                    @click="submitMatch()"
                    >Book</v-btn
                  >
                </v-row>
              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import apihandler from "./../services/db";
import utils from "./../services/utils";
//import moment from "moment-timezone";
import DurationPicker from './booking/DurationPicker.vue';
import processAxiosError from "./../utils/AxiosErrorHandler";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"
import advancedFormat from "dayjs/plugin/advancedFormat"

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);


const MATCH_TYPE_ID = 1000;

export default {
  components: {
    DurationPicker,
  },
  name: "MatchBooking",
  data: function () {
    return {
      court: { id: null, name: null},
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
      // durDialog: false,
      date: null,
      s_time: null,
      sel_duration: 0,
      note: null,
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
        notelimit: (v) => !v || (typeof v === 'string' && v.length <= 256) || "Max 256 characters",
        explainRuleChange: (value) => {
          return this.duration > this.prefDuration ||
            (this.reqBumpable == 1 && this.bumpable == 0)
            ? (!!( typeof value === 'string' ? value.trim() : value )|| "Explain rules overwrite")
            : true;
        },
        courtset: (v) => {
          return (!!v.id && !!v.name) || "Select a court" 
        }
      },
      loading: false,
      error: null,
      errors: {
        note: null,
        date: null,
        start: null,
        end: null,
        type: null,
        players: null
      }
    };
  },
  filters: {
    formatTime: function (timestring) {
      if (!timestring) return "N/A";
      return dayjs(timestring).format("h:mm a");
    },
    formatDate: function (timestring) {
      if (!timestring) return "N/A";
      return dayjs(timestring).format("MMM Do, YYYY");
    },
  },
  methods: {
    allowedminutes: (m) => m % 5 === 0,
    getPlayerLabel: (index) => "Player " + (index + 1),
    changeBookingParams: function () {
      this.error = null;
      this.step = 2;
    },
    goToBookingStep(newstep){
      
      if( this.step == 1 && newstep == 2){
          if( ! this.validatePlayerInput() ){
            return
          }
          this.setMatchParams();
      }

      if( this.step == 2 && newstep == 1){
        this.$refs.sessionform.resetValidation();
      }

      this.step = newstep;
    },
    setMatchParams(){
      this.date = dayjs().tz(this.clubtz).format("YYYY-MM-DD");

      var time = dayjs().tz(this.clubtz).format("HH:mm");
      var current_minutes = utils.timeToMinutes(time);

      var minutes = current_minutes % 60;
      var hours = (current_minutes - minutes) / 60;

      var minutes_limit = 5;
      var minutes_rounded = Math.floor(minutes / minutes_limit) * minutes_limit;

      var final_start_minutes = hours * 60 + minutes_rounded + minutes_limit;

      var open_minutes = utils.timeToMinutes(this.opentime);
      var close_minutes = utils.timeToMinutes(this.closetime);

      
      if( final_start_minutes < open_minutes ){
        //if start time is less than open, set it to open
        this.s_time = this.opentime;
      }
      else{
        if( final_start_minutes <= close_minutes ){
          //if stat time is between open and close, keep it
          this.s_time = utils.minToTime(final_start_minutes);
        }
      }

      if (this.prefDuration && this.s_time) {
        const dur =
          final_start_minutes < close_minutes
            ? final_start_minutes + this.prefDuration < close_minutes
              ? this.prefDuration
              : close_minutes - final_start_minutes
            : 0;
        this.sel_duration = dur;
      }
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
    validateSessionInput() {
      if (!this.$refs.sessionform.validate()) return;

      if (!this.s_time) {
        return;
      }

      this.step = 3;
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

      if (playerCheck.players.length == 0) {

        this.selplayers[0]['playerErrs'].push("Select a player")
        this.$emit("show:message","Please select a player","errors")
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

        return false;
      }
      else{
        return true;
      }
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

      apihandler
        .newMatch(match)
        .then(() => {
          this.$router.push({ name: "calendar" });
        })
        .catch((err) => {
          const error = processAxiosError(err);

          if (error.fielderrors) {
            this.error = "Incorrect data format."
          } else {
            this.error = error;
          }

          this.$vuetify.goTo(0,{durraion: 300, offset: 0, easing: 'easeInOutCubic'});

        })
        .finally(() => {
          this.loading = false;
        });
    },
    submitMatch: function () {
      if (!this.validate()) return false;

      const booking = {
        court: this.court.id,
        bumpable: this.bumpable == true ? 1 : 0,
        date: this.date,
        start: this.s_time,
        end: this.e_time,
        note: this.note,
        players: this.playerInfo,
        type: MATCH_TYPE_ID,
      };
      
      this.sendData(booking);
    },
    handleFieldErrors(errors) {
      
      //Loop through each error and add it to array of error for specific field
      if (Array.isArray(errors)) {

        errors.forEach((element) => {
          
          if ( Object.prototype.hasOwnProperty.call(this.errors, element.param)) {
            this.errors[element.param] = element.msg;
          }
        });

      }
    }
  },
  watch: {
    reqBumpable: function (newval) {
      this.bumpable = newval;
    },
  },
  computed: {
    e_time: function () {
      return utils.minToTime(
        this.sel_duration + utils.timeToMinutes(this.s_time)
      );
    },
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
    prefDuration: function () {
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
    bookingType: function(){
      const p_num = this.playerInfo.length;

      return p_num > 2 ? "Doubles" : p_num > 1 ? "Singles" : "Individual";

    },
    playerInfo: function () {
      return this.selplayers.reduce((accumulator, player) => {
        if (player.id && player.repeater) {
          //Player type defined in player_type table
          accumulator.push({ id: player.id, type: player.repeater });
        }

        return accumulator;
      }, []);
    },
    computedDateFormatted() {
      return this.formatDate(this.date);
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
    maxDuration: function() {
      return utils.timeToMinutes(this.closetime) - utils.timeToMinutes(this.s_time);
    }
  },
  created: function () {
    //this.date = dayjs().tz(this.clubtz).format("Y-MM-DD");
  },
  mounted: function () {},
  beforeDestroy() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>