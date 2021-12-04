<template>
  <div>
    <v-card-text>
      <v-row
        no-gutters
        justify="center"
        align="center"
        
      >
        <v-col cols="12" v-if="loaded">
          <v-alert dense type="error" outlined v-show="errMessage" v-text="errMessage"></v-alert>
          <div v-if="hasGuests">
            <v-row no-gutters>
              <v-col>
                <span class="mr-2">Last Updated: {{ updated }}</span>
                <v-chip label small @click="getCurrentActivations">
                  Reload
                </v-chip>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12">
                <v-list subheader >
                  <v-subheader>Active guests</v-subheader>
                  <v-list-item-group
                    v-model="selguest"
                  >
                    <v-list-item
                      v-for="(activation, i) in guest_activations"
                      :key="i"
                      :disabled="activation.has_played"
                    >
                      <template v-slot:default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="activation.guest"></v-list-item-title>
                          <v-list-item-subtitle>Host: {{ activation.member }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action v-if="! activation.has_played">
                          <v-checkbox
                            :input-value="active"
                          ></v-checkbox>
                        </v-list-item-action>
                      </template>

                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </div>
          <div v-else class="text-center py-10">No active guests found</div>
        </v-col>
        <v-col cols="12" v-else>
          <v-row no-gutters justify="center">
            <v-col cols="12" class="text-center py-10">Loading ...</v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text :disabled="! guest_selected || loading" @click="deactivateGuests">Deactivate</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import dbservice from "./../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";

export default {
  props: ["loading"],
  name: "GuestActivation",
  data: function () {
    return {
      guest_activations: null,
      loaded: false,
      updated: "N/A",
      selguest: undefined,
      errMessage: undefined
    };
  },
  beforeRouteLeave(to,from,next){
      this.setLoading(false);
      next();
  },
  methods: {
    setLoading(val) {
      this.$emit("update:loading", val);
    },
    deactivateGuests(){
      //Get needed info from the selguets array
      const ga_data = (({ id, etag }) => ({ id, etag }))(this.guest_activations[this.selguest])
      this.errMessage = undefined;
      this.setLoading(true);


      this.deactivateAndReload(ga_data)
      .then((res) => {

        this.guest_activations = res.data;
        this.loaded = true;
        this.updated = this.$dayjs(this.date).tz().format("h:mm a");
        this.$emit("show:message", 'Guest records updated', "success");
      })
      .catch((err) => {
        const error = processAxiosError(err);

        if( Object.prototype.hasOwnProperty.call(error,"type")){
          
          switch (error.type) {
            case "PATCH_GUEST_ACTIVATION":
              this.$emit("show:message", "Unable to complete request.", "error");
              break;
            case "LOAD_GUEST_ACTIVATION":
              this.$emit("show:message", "Unable to load guest activations.", "error");
              break;
            default:
              this.$emit("show:message", "Error", "error");
              break;
          }
          
          this.errMessage = error.message;
        }

      })
      .finally(() => {
        this.setLoading(false);
      });
    },
    async deactivateAndReload(data){
      
        await dbservice.deactivateGuest(data);

        this.loaded = false;
        //Reset local guest activation data
        this.selguest = undefined;
        this.guest_activations = null;

        return await dbservice.getCurrentGuestActivations()
    },
    getCurrentActivations: function () {
      this.setLoading(true);
      this.errMessage = undefined;
      this.loaded = false;
      this.selguest = undefined;
      this.guest_activations = null;
      

      dbservice
        .getCurrentGuestActivations()
        .then((res) => {
          this.guest_activations = res.data;
          this.loaded = true;
          this.updated = this.$dayjs(this.date).tz().format("h:mm a");
        })
        .catch((err) => {
          const error = processAxiosError(err);
          this.$emit("show:message", `${error}`, "error");
        })
        .finally(() => {
          this.setLoading(false);
        });
    },
  },
  computed: {
    clubtz: function () {
      return this.$store.state.clubtz;
    },
    hasGuests: function () {
      return (
        Array.isArray(this.guest_activations) &&
        this.guest_activations.length != 0
      );
    },
    guest_selected: function () {
      return typeof this.selguest === 'undefined' ? false: true;
    }
  },
  created: function () {
    this.getCurrentActivations();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
