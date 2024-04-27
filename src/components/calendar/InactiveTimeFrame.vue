<template>
  <base-item :start="start" :end="end" :calendar-start="calendarStart">
    <v-row
      no-gutters
      justify="center"
      align="center"
      class="fill-heigth empty-time-frame"
    >
      <v-col cols="12" class="text-body-1 text-center">CLOSED</v-col>
    </v-row>
  </base-item>
</template>

<script>
import BaseItem from "./BaseItem.vue";

export default {
  components: { BaseItem },
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
};
</script>

<style scoped lang="scss">
@import "~vuetify/src/styles/styles.sass";
.empty-time-frame {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 20px,
    #{map-get($grey, "base")} 20px,
    #{map-get($grey, "base")} 40px
  );
  border: 1px dotted white;
  border-radius: 5px;
  overflow: hidden;
}
</style>
>
