<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col cols="12" md="6" lg="4" xl="3">
        <v-card>
          <v-card-title>System Settings</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="formvalid">
              <v-row no-gutters>
                <v-col cols="12" lg="8">
                  <v-select
                    v-model="settings.displayMode"
                    label="Schedule Display Mode"
                    :items="displaymodes"
                  >
                  </v-select>
                </v-col>
                <v-col cols="12"> </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn large @click="resetSettings">Reset</v-btn>
            <v-spacer></v-spacer>
            <v-btn large :disabled="!settingsChanged" @click="saveSettings"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SettingsPage",
  data: function () {
    return {
      formvalid: true,
      settings: {
        displayMode: null,
      },
    };
  },
  computed: {
    displayMode: {
      set: function (val) {
        this.$store.dispatch("setSetting", { value: val, name: "displaymode" });
      },
      get: function () {
        return this.$store.getters["getSetting"]("displaymode");
      },
    },
    displaymodes: function () {
      return this.$store.state.displaymodes;
    },
    settingsChanged() {
      return this.settings.displayMode !== this.displayMode;
    },
  },
  created() {
    this.settings.displayMode = this.displayMode;
  },
  methods: {
    saveSettings() {
      this.displayMode = this.settings.displayMode;
    },
    resetSettings() {
      this.settings.displayMode = this.displayMode;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
