<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card>
          <v-img
            class="white--text"
            height="150px"
            :src="getImageSrcByName('EVENTS_COVER')"
            :lazy-src="require('@/assets/lazyloader.jpg')"
            gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
            position="top center"
          >
            <v-container class="fill-height" fluid>
              <v-row no-gutters class="fill-height">
                <v-col cols="12" align-self="end">
                  <span class="text-h5">Club Event Booking</span>
                </v-col>
              </v-row>
            </v-container>
            <v-progress-linear
              v-show="loading"
              indeterminate
              absolute
              bottom
            ></v-progress-linear>
          </v-img>
          <v-card-text>
            <v-form ref="eventbookingform" lazy>
              <v-row dense>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="organizer"
                    :items="managers"
                    label="Authorized Person"
                    :prepend-icon="accountIcon"
                    no-data-text="No available organizers"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="bookingtype"
                    label="Booking Type"
                    :prepend-icon="formSelectIcon"
                    no-data-text="No type found"
                    :rules="[rules.required]"
                    :items="bookingtypes"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="8">
                  <v-select
                    v-model="court"
                    label="Court"
                    :items="courts"
                    item-value="id"
                    item-text="name"
                    required
                    :rules="[rules.required]"
                    no-data-text="No courts found"
                    :prepend-icon="formSelectIcon"
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
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="formattedDate"
                        label="Booking date"
                        :prepend-icon="clockStartIcon"
                        readonly
                        v-bind="attrs"
                        :rules="[rules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text @click="datedialog = false">Cancel</v-btn>
                      <v-btn text @click="$refs.ddialog.save(date)">OK</v-btn>
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
                    <template #activator="{ on }">
                      <v-text-field
                        v-model="s_time"
                        label="Start time"
                        :prepend-icon="clockStartIcon"
                        required
                        :rules="[rules.required]"
                        v-on="on"
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
                      <v-btn text @click="stimedialog = false">Cancel</v-btn>
                      <v-btn text @click="$refs.stdialog.save(s_time)">
                        OK
                      </v-btn>
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
                    <template #activator="{ on }">
                      <v-text-field
                        v-model="e_time"
                        label="End time"
                        :prepend-icon="clockEndIcon"
                        required
                        :rules="[rules.required, rules.endAfterStart]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="e_time"
                      class="mt-3"
                      :allowed-minutes="allowedminutes"
                      :min="opentime"
                      :max="closetime"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text @click="etimedialog = false">Cancel</v-btn>
                      <v-btn text @click="$refs.etdialog.save(e_time)">
                        OK
                      </v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="note"
                    label="Note"
                    counter
                    maxlength="200"
                    :rules="[rules.notelimit]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="$refs.eventbookingform.reset()">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn large :loading="loading" @click="submitBooking">Book</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import apihandler from "./../services/db";
import utils from "./../services/utils";
import processAxiosError from "../utils/AxiosErrorHandler";
import { notification } from "@/components/mixins/NotificationMixin";
import { ImageProvider } from "./mixins/ImageProviderMixin";

import {
  mdiAccount,
  mdiFormSelect,
  mdiCalendar,
  mdiClockStart,
  mdiClockEnd,
} from "@mdi/js";

const HOST_TYPE_ID = 4000;

export default {
  name: "EventBooking",
  components: {},
  mixins: [ImageProvider,notification],
  data: function () {
    return {
      accountIcon: mdiAccount,
      formSelectIcon: mdiFormSelect,
      calendarIcon: mdiCalendar,
      clockStartIcon: mdiClockStart,
      clockEndIcon: mdiClockEnd,
      court: null,
      organizer: null,
      bookingtype: null,
      managers: [],
      bookingtypes: [],
      datedialog: false,
      stimedialog: false,
      etimedialog: false,
      date: null,
      s_time: null,
      e_time: null,
      note: null,
      rules: {
        required: (value) => !!value || "Required.",
        endAfterStart: (value) => {
          if (!this.s_time) {
            return true;
          }

          if (
            utils.timeToMinutes(value) - utils.timeToMinutes(this.s_time) <=
            0
          ) {
            return "End must be after start";
          }

          return true;
        },
        notelimit: (v) =>
          typeof v === "object" ||
          (typeof v === "string" && v.length <= 200) ||
          "Max 256 characters",
      },
      loading: false,
      error: null,
    };
  },
  computed: {
    clubtz: function () {
      return this.$store.state.clubtz;
    },
    courts: function () {
      return this.$store.getters["courtstore/getCourts"];
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
    formattedDate: {
      get() {
        return this.formatDate(this.date);
      },
      set(val) {
        this.date = val;
      },
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
  mounted: function () {},
  beforeDestroy() {},
  created: function () {
    this.date = this.$dayjs().tz().format("YYYY-MM-DD");

    this.loadData();
  },
  methods: {
    allowedminutes: (m) => m % 5 === 0,
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    validate: function () {
      return true;
    },
    validateFields() {
      if (!this.$refs.eventbookingform.validate()) {
        return false;
      }

      return true;
    },
    sendData(match) {
      this.loading = true;
      this.error = null;

      apihandler
        .newMatch(match)
        .then(() => {
          //console.log(response)
          this.loading = false;
          this.$router.push({ name: "calendar" });
        })
        .catch((e) => {
          this.showNotification(processAxiosError(e), "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submitBooking: function () {
      if (!this.validateFields()) return false;

      const booking = {
        court: this.court,
        bumpable: 0,
        date: this.date,
        start: this.s_time,
        end: this.e_time,
        note: this.note,
        players: [{ id: this.organizer, type: HOST_TYPE_ID }],
        type: this.bookingtype,
      };

      //console.log("Will send ", match)
      this.sendData(booking);
    },
    loadData: function () {
      this.loading = true;

      Promise.all([apihandler.getEventHosts(), apihandler.getBookingTypes()])
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
          this.showNotification(processAxiosError(err), "error");
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
