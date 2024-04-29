<template>
  <base-item
    v-slot="{ height }"
    :start="start"
    :end="end"
    :calendar-start="calendarStart">
    <v-row
      no-gutters
      justify="center"
      align="center"
      class="fill-heigth session_container"
      @click="showBookingDetails">
      <v-col cols="12" class="fill-height">
        <slot :height="height">
          <v-row class="fill-height" no-gutters>
            <v-col cols="12">Calendar Item</v-col>
          </v-row>
        </slot>
      </v-col>
    </v-row>
  </base-item>
</template>

<script>
import BaseItem from "./BaseItem.vue";

export default {
  name: "CalendarItem",
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
    id: {
      type: Number,
      required: false,
      default: null,
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
  data: function () {
    return {};
  },
  methods: {
    showBookingDetails: function () {
      if (this.showDetails) {
        this.$router.push({
          name: "BookingDetails",
          params: { id: this.id.toString() },
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.session_container {
  overflow: hidden;
  border-radius: 3px;
  border: 1px solid black;
  box-shadow: 1px 2px black;
  color: black;
}
</style>
