export const notification = {
  methods: {
    /**
     *
     * @param {String} text Message to display
     * @param {String} type Type of notification to use
     */
    showNotification(text, type = null) {
      this.$store.dispatch("notificationstore/addNotification", {
        text: text,
        type: type,
      });
    },
  },
};
