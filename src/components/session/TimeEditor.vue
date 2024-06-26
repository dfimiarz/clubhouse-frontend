<template>
  <v-card tile="" height="100%">
    <v-toolbar flat>
      <v-btn icon dark @click="close">
        <v-icon> {{ closeIcon }}</v-icon>
      </v-btn>
      <v-toolbar-title>Edit Session Time</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items> </v-toolbar-items>
    </v-toolbar>
    <v-card-text>
      <v-row v-if="error" class="my-2" no-gutters>
        <v-col cols="12">
          <v-alert type="error" outlined> {{ error }} </v-alert>
        </v-col>
      </v-row>
      <v-row class="my-2" no-gutters>
        <v-col cols="12">
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
                readonly
                required=""
                :disabled="!canMove"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-model="s_time"
              :min="opentime"
              :allowed-minutes="allowedminutes"
            >
              <v-spacer></v-spacer>
              <v-btn text="" color="primary" @click="stimedialog = false"
                >Cancel</v-btn
              >
              <v-btn
                text=""
                color="primary"
                @click="$refs.stdialog.save(s_time)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
        <v-col cols="12">
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
                readonly
                required=""
                :disabled="!canMove"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-model="e_time"
              :max="closetime"
              :allowed-minutes="allowedminutes"
            >
              <v-spacer></v-spacer>
              <v-btn text="" color="primary" @click="etimedialog = false"
                >Cancel</v-btn
              >
              <v-btn
                text=""
                color="primary"
                @click="$refs.etdialog.save(e_time)"
                >OK</v-btn
              >
            </v-time-picker>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text :loading="loading" @click="changeTime">
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
//import moment from 'moment-timezone'
import apihandler from "./../../services/db";
import { editor } from "./EditorMixin";
import processAxiosError from "../../utils/AxiosErrorHandler";

import { mdiClose, mdiClockStart, mdiClockEnd } from "@mdi/js";

export default {
  mixins: [editor],
  props: {
    session: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      closeIcon: mdiClose,
      clockStartIcon: mdiClockStart,
      clockEndIcon: mdiClockEnd,
      stimedialog: false,
      s_time: null,
      etimedialog: false,
      e_time: null,
    };
  },
  computed: {
    opentime() {
      return this.$store.state.opentime;
    },
    closetime() {
      return this.$store.state.closetime;
    },
    canMove: function () {
      return Object.prototype.hasOwnProperty.call(this.session, "permissions")
        ? Array.isArray(this.session.permissions)
          ? this.session.permissions.includes("move")
          : false
        : false;
    },
  },
  mounted: function () {
    this.s_time = this.$dayjs(this.session.date.concat("T", this.session.start))
      .tz()
      .format("HH:mm");
    this.e_time = this.$dayjs(this.session.date.concat("T", this.session.end))
      .tz()
      .format("HH:mm");
  },
  methods: {
    allowedminutes: (m) => m % 5 === 0,

    changeTime: function () {
      this.error = null;
      this.loading = true;

      var params = {
        id: this.session.id,
        hash: this.session.etag,
        start: this.s_time,
        end: this.e_time,
      };

      apihandler
        .changeTime(params)
        .then(() => {
          this.$router.push({ name: "calendar" });
        })
        .catch((e) => {
          this.error = processAxiosError(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped></style>
