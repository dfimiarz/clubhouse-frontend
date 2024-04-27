<template>
  <calendar-item
    :id="booking.id"
    v-slot="{ height }"
    :start="booking.start_min"
    :end="booking.end_min"
    :calendar-start="calendarStart"
    show-details
  >
    <v-row no-gutters class="fill-height brown darken-1 white--text">
      <v-col cols="12">
        <div
          :class="[
            'mx-1',
            height < item_type_lbl_height
              ? 'text-caption'
              : 'text-body-1 text-lg-subtitle-1',
          ]"
        >
          {{ booking.booking_type_desc | capitalize }} -
          {{ formatName(organizer) }}
        </div>
      </v-col>
    </v-row>
  </calendar-item>
</template>

<script>
import CalendarItem from "./CalendarItem.vue";
import { itemmixin } from "./ItemMixin";

export default {
  components: { CalendarItem },
  filters: {
    capitalize: function (val) {
      if (!val) return "EVENT";

      const str_val = val.toString();

      return str_val.toUpperCase();
    },
  },
  mixins: [itemmixin],
  props: {
    booking: {
      type: Object,
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
    organizer: function () {
      return this.booking.players === null ? null : this.booking.players[0];
    },
  },
  methods: {},
};
</script>

<style></style>
