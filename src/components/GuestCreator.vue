<template>
    <v-container fluid="">
      <div class="caption py-2">This form is to be completed by <span class="font-weight-bold info--text">club members</span> registering a guest visitor. Only <span class="font-weight-bold info--text">single</span> registration is required. Once in the system, a guest can be activated for a particular day through the <span class="font-weight-bold">"ACTIVATE"</span> tab.</div>
      <v-form>
          <v-row no-gutters="">
            <v-col cols="12">
              <div v-if="error" class="errcontainer">
              <span>Error: {{ error }}</span>
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters="" class="pt-4">
            <v-col cols="12" class="body-1">Member Host</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-text-field
                v-model="guest.hostemail"
                label="Host's email"
                required
                mask="email"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters="" class="pt-4">
            <v-col cols="12" class="title">Guest information</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-text-field
                  v-model="guest.firstname"
                  label="First name"
                  required>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-text-field
                  v-model="guest.lastname"
                  label="Last Name"
                  required>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-text-field
                  v-model="guest.email"
                  label="E-mail"
                  required>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-text-field
                  v-model="guest.phone"
                  label="Phone"
                  required
                  mask="phone"
              >
              </v-text-field>
            </v-col>
          </v-row>
          
          <!--<v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-select
              :items="genderItems"
              label="Gender"
              v-model="guest.gender"
              >
              </v-select>
            </v-col>
          </v-row> -->
          <!-- <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-select
              :items="ages"
              label="Age"
              v-model="guest.age"
              >
              </v-select>  
            </v-col>
          </v-row> -->
          <v-row no-gutters="">
            <v-col cols="12" lg="8">
              <v-checkbox
              v-model="guest.family"
              label="Guest is a family member"
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row no-gutters="" class="pt-4">
            <v-col cols="12"  class="title">Terms and Conditions</v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters="">
            <v-col cols="12">
              <v-checkbox
                v-model="agree">
                <template v-slot:label>
                  <div class="caption">
                    I have read, understood, and agree to all club <v-chip color="primary" x-small @click.stop.prevent="showRules">rules</v-chip> pertaining to guests visitors
                  </div>
                </template>
              ></v-checkbox>
            </v-col>
          </v-row>
          
          <v-row no-gutters="">
            <v-col cols="12" class="text-right">
              <v-btn :disabled="loading" @click="addNewMember">
                  Add Guest
              </v-btn>
            </v-col>
          </v-row>
          
      </v-form>
    </v-container>
</template>

<script>
export default {
  name: "RegisterMember",
  created: () => {
    //console.log("Created")
  },
  data: function() {
    return {
      error: null,
      guest: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        family: false,
        hostemail: null
      },
      agree: false,
      ages: [
        { value: 18, text: "18 +" },
        { value: 17, text: "17" },
        { value: 16, text: "16" },
        { value: 15, text: "15" },
        { value: 14, text: "14" },
        { value: 13, text: "13" },
        { value: 13, text: "12" },
        { value: 11, text: "11" },
        { value: 10, text: "10" },
        { value: 9, text: "9" },
        { value: 8, text: "8" },
        { value: 7, text: "7" }
      ],
      genderItems: [
        { value: "M", text: "Male" },
        { value: "F", text: "Female" },
        { value: "U", text: "Rather Not Say"}
      ]
    };
  },
  methods: {
    addNewMember: function() {
      //console.log(this.guest);
      this.$store.dispatch("memberstore/REGISTER_MEMBER", this.guest);
    },
    showRules: function(){
      alert("Will show rules");
    }
  },
  computed: {
    loading: function() {
      return this.$store.getters.loading;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.errcontainer {
  margin: 10px 0px 10px 0px;
  border: 1px solid;
  color: red;
  font-weight: bold;
  box-sizing: border-box;
}
</style>
