<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="4" xl="3" class="fill-height">
        <v-row
          v-if="loading"
          class="fill-height"
          justify="center"
          align="center"
          no-gutters
        >
          <v-progress-circular
            :size="70"
            :width="7"
            indeterminate
          ></v-progress-circular>
        </v-row>

        <v-row v-if="error" justify="center" no-gutters>
          <v-alert type="error" outlined>
            {{ error }}
          </v-alert>
        </v-row>

        <v-row v-if="sessioninfo" no-gutters justify="center" align="center">
          <v-col xs12>
            <v-card>
              <v-img
                class="white--text"
                height="150px"
                :src="require('@/assets/match.jpg')"
                :lazy-src="require('@/assets/match_small.jpg')"
                gradient="to top right, rgba(128,128,128,.33), rgba(0,0,0,.7)"
              >
                <v-container class="fill-height" fluid>
                  <v-row no-gutters class="fill-height">
                    <v-col cols="12" align-self="start">
                      <v-container fluid>
                        <v-row class="mx-1">
                          <div class="flex-grow-1 text-start">
                            <v-btn icon @click="$router.go(-1)">
                              <v-icon>{{ chevronLeftIcon }}</v-icon>
                            </v-btn>
                          </div>
                          <div style="flex-grow: 2"></div>
                          <div class="flex-grow-1 text-end"></div>
                        </v-row>
                      </v-container>
                    </v-col>

                    <v-col cols="12" align-self="end">
                      <span class="text-h4 pa-1">Booking Details</span>
                    </v-col>
                  </v-row>
                </v-container>
              </v-img>
              <v-card-text>
                <v-list two-line>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ informationIcon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ sessioninfo.booking_type_desc }}
                      </v-list-item-title>
                      <v-list-item-subtitle>Boooking Type</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ calendarRangeIcon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        formatDate(sessioninfo.date)
                      }}</v-list-item-title>
                      <v-list-item-subtitle>Date</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider inset></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ clockStartIcon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        formatTime(starttime)
                      }}</v-list-item-title>
                      <v-list-item-subtitle>Start</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <!--
                      <v-btn v-if="canMove" icon>
                        <v-icon @click="openEditor('timeeditor')">{{
                          pencilIcon
                        }}</v-icon>
                      </v-btn>
                      -->
                    </v-list-item-action>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon> {{ clockEndIcon }} </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        formatTime(endtime)
                      }}</v-list-item-title>
                      <v-list-item-subtitle>End</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider inset></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon> {{ tennisIcon }} </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        sessioninfo.court_name
                      }}</v-list-item-title>
                      <v-list-item-subtitle>Court</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn v-if="canMove" icon>
                        <v-icon @click="openEditor('courteditor')">{{
                          pencilIcon
                        }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider inset></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ closeCircleIcon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        sessioninfo.bumpable ? "Yes" : "No"
                      }}</v-list-item-title>
                      <v-list-item-subtitle>Bumpable</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action> </v-list-item-action>
                  </v-list-item>

                  <v-divider inset></v-divider>

                  <v-list-item
                    v-for="player in sessioninfo.players"
                    :key="player.id"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ accountIcon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title
                        >{{ player.firstname }}
                        {{ player.lastname }}</v-list-item-title
                      >
                      <v-list-item-subtitle>{{
                        player.player_type_desc
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider inset></v-divider>

                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>{{ noteIcon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        sessioninfo.notes
                      }}</v-list-item-title>
                      <v-list-item-subtitle>Note</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn v-if="canChangeNote" icon>
                        <v-icon @click="openEditor('noteeditor')">{{
                          pencilIcon
                        }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions class="mx-2">
                <v-btn
                  v-show="canRemove"
                  color="warning"
                  text
                  outlined
                  @click="canceldialog = true"
                  >Remove Session</v-btn
                >
                <div class="flex-grow-1"></div>
                <v-btn v-show="canEnd" large @click="enddialog = true"
                  >End session</v-btn
                >
                <v-btn
                  v-if="canRebook"
                  large
                  outlined
                  color="primary"
                  text
                  :loading="loading"
                  @click="bookagain"
                  >Rebook</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
          <valueeditor
            :visible.sync="showeditor"
            :session="sessioninfo"
            :type="editortype"
          ></valueeditor>
        </v-row>
      </v-col>
      <v-dialog v-model="canceldialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Remove Session</v-card-title>

          <v-card-text>
            <div>
              Are you sure you wish to
              <span class="red--text font-weight-bold">REMOVE</span> this
              session from club schedule?
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn text @click="canceldialog = false">No</v-btn>

            <div class="flex-grow-1"></div>

            <v-btn
              color="warning"
              text
              :loading="loading"
              @click="removeSession"
              >Yes, REMOVE</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="enddialog" max-width="290">
        <v-card>
          <v-card-title class="headline">End session?</v-card-title>

          <v-card-text>Are you sure you wish to end this session</v-card-text>

          <v-card-actions>
            <v-btn color="primary" text @click="enddialog = false">No</v-btn>

            <div class="flex-grow-1"></div>

            <v-btn color="warning" text :loading="loading" @click="endSession"
              >End now</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import apihandler from "./../services/db";
import valueeditor from "./session/ValueEditor";
import processAxiosError from "../utils/AxiosErrorHandler";

import { BOOKING_TYPE_MATCH } from "../constants/constants";
import { notification } from "@/components/mixins/NotificationMixin";

import {
  mdiChevronLeft,
  mdiInformation,
  mdiCalendarRange,
  mdiClockStart,
  mdiPencil,
  mdiClockEnd,
  mdiTennis,
  mdiCloseCircle,
  mdiNote,
  mdiAccount,
} from "@mdi/js";

export default {
  name: "BookingDetails",
  components: {
    valueeditor: valueeditor,
  },
  filters: {},
  mixins: [notification],
  props: ["id"],
  data: function () {
    return {
      chevronLeftIcon: mdiChevronLeft,
      informationIcon: mdiInformation,
      calendarRangeIcon: mdiCalendarRange,
      clockStartIcon: mdiClockStart,
      clockEndIcon: mdiClockEnd,
      pencilIcon: mdiPencil,
      tennisIcon: mdiTennis,
      closeCircleIcon: mdiCloseCircle,
      noteIcon: mdiNote,
      accountIcon: mdiAccount,
      loading: false,
      error: null,
      sessioninfo: null,
      canceldialog: false,
      enddialog: false,
      showTimeEditor: false,
      showCourtEditor: false,
      showeditor: false,
      editortype: null,
      bookingPermissions: new Set(),
    };
  },
  computed: {
    clubtz: function () {
      return this.$store.state.clubtz;
    },
    starttime: function () {
      return this.$dayjs
        .tz(this.sessioninfo.date.concat(" ", this.sessioninfo.start))
        .format();
    },
    endtime: function () {
      return this.$dayjs
        .tz(this.sessioninfo.date.concat(" ", this.sessioninfo.end))
        .format();
    },
    canEnd: function () {
      return Object.prototype.hasOwnProperty.call(
        this.sessioninfo,
        "permissions"
      )
        ? Array.isArray(this.sessioninfo.permissions)
          ? this.sessioninfo.permissions.includes("end")
          : false
        : false;
    },
    canRemove: function () {
      return Object.prototype.hasOwnProperty.call(
        this.sessioninfo,
        "permissions"
      )
        ? Array.isArray(this.sessioninfo.permissions)
          ? this.sessioninfo.permissions.includes("cancel")
          : false
        : false;
    },
    canMove: function () {
      return Object.prototype.hasOwnProperty.call(
        this.sessioninfo,
        "permissions"
      )
        ? Array.isArray(this.sessioninfo.permissions)
          ? this.sessioninfo.permissions.includes("move")
          : false
        : false;
    },
    canChangeNote: function () {
      return Object.prototype.hasOwnProperty.call(
        this.sessioninfo,
        "permissions"
      )
        ? Array.isArray(this.sessioninfo.permissions)
          ? this.sessioninfo.permissions.includes("change_note")
          : false
        : false;
    },
    canRebook: function () {
      return (
        this.sessioninfo.utc_req_time > this.sessioninfo.utc_end &&
        this.sessioninfo.type === BOOKING_TYPE_MATCH
      );
    },
    playerIds: function () {
      return Object.prototype.hasOwnProperty.call(this.sessioninfo, "players")
        ? this.sessioninfo.players.map((p) => p.person_id)
        : [];
    },
  },
  watch: {
    //needed to get new data when route changes
    $route: "fetchData",
  },
  created() {
    //fetch data here
    this.fetchData();
  },
  destroyed() {},
  methods: {
    formatTime(timestring) {
      if (!timestring) return "N/A";
      return this.$dayjs(timestring).tz().format("h:mm a");
    },
    formatDate(datestring) {
      if (!datestring) return "N/A";
      return this.$dayjs(datestring).tz().format("MMM Do, YYYY");
    },
    bookagain() {
      this.$router.replace({
        name: "MatchBooking",
        query: { pls: this.playerIds.toString() },
      });
    },
    openEditor(val) {
      this.editortype = val;
      this.showeditor = true;
    },

    removeSession: function () {
      this.error = null;
      this.loading = true;

      var params = {
        id: this.sessioninfo.id,
        hash: this.sessioninfo.etag,
      };

      apihandler
        .removeSession(params)
        .then(() => {
          this.$router.push({ name: "calendar" });
        })
        .catch((e) => {
          const err = processAxiosError(e);
          this.showNotification(err, "error");
        })
        .finally(() => {
          this.loading = false;
          this.canceldialog = false;
        });
    },
    endSession: function () {
      this.error = null;
      this.loading = true;

      var params = {
        id: this.sessioninfo.id,
        hash: this.sessioninfo.etag,
      };

      apihandler
        .endSession(params)
        .then(() => {
          this.$router.push({ name: "calendar" });
        })
        .catch((e) => {
          const err = processAxiosError(e);
          this.showNotification(err, "error");
        })
        .finally(() => {
          this.loading = false;
          this.enddialog = false;
        });
    },

    fetchData: function () {
      this.error = this.sessioninfo = null;
      this.bookingPermissions.clear();
      this.loading = true;

      apihandler
        .getBookingDetails(this.id)
        .then((val) => {
          this.sessioninfo = val.data;
        })
        .catch((e) => {
          const err = processAxiosError(e);

          this.error = err;
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
