<template>
  <v-row dense>
    <v-col cols="12">
      <div class="text-caption text-right">Pass: {{ basePriceFormatted }}</div>
      <div class="text-caption text-right">
        Processing Fee: {{ feeFormatted }}
      </div>
    </v-col>
    <v-col cols="12">
      <div class="py-2 text-h6 text-right">
        <span>Total:&nbsp;</span>
        <span class="warning--text">{{ totalFormatted }}</span>
      </div>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  basePrice: {
    type: Number,
    required: true,
  },
  baseFee: {
    type: [Number, null],
    default: null,
  },
  /**
   * @type {("FA" | "PA")}
   */
  feeType: {
    type: String,
    validator(value) {
      return ["FA", "PA"].includes(value);
    },
    default: "FA",
  },
});

const feeFormatted = computed(() => {
  return "$" + (fee.value / 100).toFixed(2);
});

const basePriceFormatted = computed(() => {
  return "$" + (props.basePrice / 100).toFixed(2);
});

/**
 * @returns {number} Fee in cents
 */
const fee = computed(() => {
  switch (props.feeType) {
    case "FA":
      //base fee is in cents
      return props.baseFee;
    case "PA":
      //baseFee is in basis points
      return Math.round((props.basePrice * props.baseFee) / 10000);
    default:
      return 0;
  }
});

const total = computed(() => {
  return (props.basePrice + fee.value) / 100;
});

const totalFormatted = computed(() => {
  return "$" + total.value.toFixed(2);
});
</script>

<style scoped></style>
