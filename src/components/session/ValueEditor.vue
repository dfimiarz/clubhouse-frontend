<template>
  <v-dialog
    v-model="show"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="500"
    persistent=""
  >
    <component
      :is="selectedType"
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
  props: ["session", "visible", "type"],
  data() {
    return {
      selectedType: null,
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
  watch: {
    show(value) {
      if (value) this.selectedType = this.type;
      else this.selectedType = null;
    },
  },
  mounted: function () {},
  methods: {},
};
</script>
<style scoped></style>
