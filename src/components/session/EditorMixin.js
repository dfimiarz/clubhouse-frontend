export const editor = {
  data() {
    return {
      loading: false,
      error: null,
    };
  },
  methods: {
    close() {
      this.$emit("update:show");
    },
  },
};
