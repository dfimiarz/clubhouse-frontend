<template>
  <v-dialog
    v-model="show"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="500"
    persistent=""
  >
    <component
      :is="type"
      :session="session"
      @update:show="show = false"
    ></component>
  </v-dialog>
</template>

<script>
import timeeditor from "./TimeEditor";
import courteditor from "./CourtEditor";

export default {
  components: {
    timeeditor: timeeditor,
    courteditor: courteditor,
  },
  props: {
    session: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: null,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      },
    },
  },
};
</script>
<style scoped></style>
