<template>
  <div
    class="timeindicator"
    :style="{ top: +vpos + 'px', 'border-top-width': +thickness + 'px' }"
  ></div>
</template>

<script>
export default {
  props: {
    currtime: {
      required: true,
      type: Number,
    },
    openMin: {
      required: true,
      type: Number,
    },
    closeMin: {
      required: true,
      type: Number,
    },
  },
  name: "TimeIndicator",
  data: function () {
    return {
      thickness: 2,
    };
  },
  methods: {},
  computed: {
    cellHeight1H: function () {
      return this.$store.getters["calCellHeight1H"];
    },
    /**
     * Compute vertical position taking into account the start and end time
     */
    vpos: function () {
      var adj_currmin =
        this.currmin <= this.startMin
          ? this.startMin
          : this.currmin >= this.endMin
          ? this.endMin - this.thickness
          : this.currmin;

      return (
        this.thickness +
        ((adj_currmin - this.startMin) * this.cellHeight1H) / 60
      );
    },
    // openMin: function () {
    //   return this.$store.getters["openMin"];
    // },
    // closeMin: function () {
    //   return this.$store.getters["closeMin"];
    // },
    currmin: function () {
      return (
        this.$dayjs(this.currtime).tz().hour() * 60 +
        this.$dayjs(this.currtime).tz().minute()
      );
    },
    startMin: function () {
      return Math.floor(this.openMin / 60) * 60;
    },
    endMin: function () {
      return Math.ceil(this.closeMin / 60) * 60;
    },
  },
  created: function () {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.timeindicator {
  position: absolute;
  width: 100%;
  border-top-color: yellowgreen;
  border-top-style: dashed;
  height: 0px;
}
</style>
