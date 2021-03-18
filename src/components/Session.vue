<template>
  <div
    class="sessioncell"
    :style="{ top: +vpos + 'px', height: height + 'px' }"
    @click="sessionClicked"
  >
    <v-row :class="sessionStyle()" align="start" no-gutters>
      <v-col
        cols="12"
        :class="
          shortSesssion === true
            ? { 'align-center': true }
            : { 'align-content-start': true, 'flex-wrap': true }
        "
        class="d-flex fill-height"
      >
        <v-chip
          v-for="(player, index) in players"
          :key="index"
          v-bind="playerChipSize"
          label
          :class="shortSesssion === true ? { 'mx-1': true } : { 'ma-1': true }"
        >
          <v-icon v-if="player.type === 2000" small color="#B58872" left
            >mdi-circle-half-full</v-icon
          >
          <v-icon v-if="player.type === 3000" small color="#B58872" left
            >mdi-circle</v-icon
          >
          {{ formatPlayerName(player) }}
        </v-chip>
      </v-col>
    </v-row>
  </div>
</template>

<script>
const BOOKING_TYPES = {
  match: 1000,
  lesson: 5000,
  tournament: 6000,
  maintenance: 7000,
  event: 8000,
};

const MIN_SESSION_HEIGHT = 26;
const PLAYER_CHIP_SIZE = 24;

export default {
  props: {
    session: {
      type: Object,
      required: true,
    },
  },
  name: "session",
  data: function () {
    return {};
  },
  methods: {
    getHeight: function () {
      return (this.cellHeight1H / 60) * this.duration;
    },
    getVpos: function () {
      return (this.cellHeight1H / 60) * (this.startMin - this.openMin);
    },

    /**
     * @returns { string } Player name formated
     */
    formatPlayerName: function (player) {
      const lastname =
        player.lastname == null || typeof player.lastname !== "string"
          ? "N/A"
          : player.lastname.length <= 1
          ? player.lastname
          : player.lastname.substr(0, 1) + ".";

      const firstname =
        player.firstname == null || typeof player.firstname !== "string"
          ? "N/A"
          : player.firstname.length > 7
          ? player.firstname.substr(0, 5) + ".."
          : player.firstname;

      return firstname + " " + lastname;
    },
    sessionClicked: function () {
      this.$router.push({
        name: "BookingDetails",
        params: { id: this.session.id },
      });
    },
    sessionStyle: function () {
      let styles = ["session_container", "fill-height"];
      styles.push(
        this.height >= this.cellHeight1H / 4 ? "text-body-2" : "caption"
      );

      styles.push(
        this.session.type === BOOKING_TYPES.match
          ? this.session.bumpable == 1
            ? "match_bumpable"
            : "match_not_bumpable"
          : "club_event"
      );
      return styles;
    },
  },
  computed: {
    height: function () {
      const _height = (this.cellHeight1H / 60) * this.duration;
      return _height <= MIN_SESSION_HEIGHT ? MIN_SESSION_HEIGHT : _height;
    },
    shortSesssion: function () {
      return this.height <= PLAYER_CHIP_SIZE + 8 ? true : false;
    },
    playerChipSize: function () {
      return this.height <= PLAYER_CHIP_SIZE + 8
        ? { "x-small": true }
        : { small: true };
    },
    showSessionTyoe: function () {
      return this.height > 2 * MIN_SESSION_HEIGHT;
    },
    vpos: function () {
      return (this.cellHeight1H / 60) * (this.startMin - this.calStartMin);
    },
    cellHeight1H: function () {
      return this.$store.getters["calCellHeight1H"];
    },
    openMin: function () {
      return this.$store.getters["openMin"];
    },
    closeMin: function () {
      return this.$store.getters["closeMin"];
    },
    calStartMin: function () {
      return Math.floor(this.openMin / 60) * 60;
    },
    calEndMin: function () {
      return Math.ceil(this.closeMin / 60) * 60;
    },
    players: function () {
      return this.session.players === null ? [] : this.session.players;
    },
    duration: function () {
      return this.endMin - this.startMin;
    },
    startMin: function () {
      let s_dt = new Date(this.session.date.concat("T", this.session.start));
      return s_dt.getHours() * 60 + s_dt.getMinutes();
    },
    endMin: function () {
      let e_dt = new Date(this.session.date.concat("T", this.session.end));
      return e_dt.getHours() * 60 + e_dt.getMinutes();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sessioncell {
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  padding: 1px 2px;
}

.session_container {
  overflow: hidden;
  border-radius: 3px;
  box-shadow: 2px 2px black;
  color: black;
}

.small_container {
  font-size: x-small;
}

.default_booking {
  background-color: white;
}

.match_bumpable {
  background-color: #7273b5;
}

.match_not_bumpable {
  background-color: #a9cce8;
}

.club_event {
  background-color: #ebaa71;
}
</style>
