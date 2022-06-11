<template>
  <v-snackbar
    v-model="visible"
    elevation="24"
    app
    outlined
    :color="color"
    timeout="-1"
  >
    <div v-if="message">
      {{ message }}
      <span v-if="typeof counter === 'number'">
        Retery in {{ 10 - (counter % 10) }} sec
      </span>
    </div>
    <span v-else>Error</span>

    <template #action="{ attrs }" v-if="showRetryButton">
      <v-btn
        text
        v-bind="attrs"
        @click="$emit('retry:action')"
        :disabled="loading"
      >
        Retry
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    message: {
      required: true,
      default: "Error",
    },
    show: {
      required: true,
      type: Boolean,
    },
    color: {
      required: false,
      default: "info",
      type: String,
    },
    showRetryButton: {
      default: true,
      type: Boolean,
    },
    counter: {
      type: Number,
    },
  },
  data: function () {
    return {};
  },
  methods: {},
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit("update:show", value);
      },
    },
    loading: function () {
      return this.$store.state.loading;
    },
  },
};
</script>
