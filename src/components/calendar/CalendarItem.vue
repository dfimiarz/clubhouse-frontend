<template>
  <div
    class="sessioncell"
    :style="{ top: +vpos + 'px', height: height + 'px' }"
    @click="showBookingDetails"
  >
    <div class="session_container fill-height d-flex flex-wrap">
      <slot :height="height">
        <v-row class="fill-height" no-gutters>
          <v-col cols="12"> Item </v-col>
        </v-row>
      </slot>
    </div>
  </div>
</template>

<script>
const MIN_SESSION_HEIGHT = 26;

export default {
  props: {
    date: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: false,
    },
    showDetails: {
      type: Boolean,
      default: false,
    },
    calendarStart: {
      type: Number,
      required: true,
    },
  },
  name: "CalendarItem",
  data: function () {
    return {};
  },
  methods: {
    showBookingDetails: function () {
      if (this.showDetails) {
        this.$router.push({
          name: "BookingDetails",
          params: { id: this.id },
        });
      }
    },
  },
  computed: {
    height: function () {
      const _height = (this.cellHeight1H / 60) * this.duration;
      return _height <= MIN_SESSION_HEIGHT ? MIN_SESSION_HEIGHT : _height;
    },
    vpos: function () {
      return (this.cellHeight1H / 60) * (this.startMin - this.calendarStart);
    },
    cellHeight1H: function () {
      return this.$store.getters["calCellHeight1H"];
    },
    duration: function () {
      return this.endMin - this.startMin;
    },
    startMin: function () {
      let s_dt = new Date(this.date.concat("T", this.start));
      return s_dt.getHours() * 60 + s_dt.getMinutes();
    },
    endMin: function () {
      let e_dt = new Date(this.date.concat("T", this.end));
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
}

.session_container {
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid black;
  box-shadow: 1px 2px black;
  color: black;
}
</style>
