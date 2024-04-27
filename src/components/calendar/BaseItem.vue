<template>
  <div
    class="sessioncell"
    :style="{ top: +vpos + 'px', height: height + 'px' }"
  >
    <div class="fill-height d-flex flex-wrap">
      <slot :height="height"> BaseItem </slot>
    </div>
  </div>
</template>

<script>
const MIN_SESSION_HEIGHT = 26;

export default {
  name: "BaseItem",
  props: {
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
    calendarStart: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {};
  },
  computed: {
    height: function () {
      const _height = (this.cellHeight1H / 60) * this.duration;
      return _height <= MIN_SESSION_HEIGHT ? MIN_SESSION_HEIGHT : _height;
    },
    vpos: function () {
      return (this.cellHeight1H / 60) * (this.start - this.calendarStart * 60);
    },
    cellHeight1H: function () {
      return this.$store.getters["calCellHeight1H"];
    },
    duration: function () {
      return this.end - this.start;
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
</style>
