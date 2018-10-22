<template>
    <v-container>
        <v-layout justify-center align-start="" row="" wrap="">
          <v-flex xs12 sm10 md8 lg6 xl4>
            <div class="subheading">
               Add a member
            </div>
             
              <v-form>
                  <div v-if="error" class="errcontainer">
                  <span>Error: {{ error }}</span>
                  </div>
                  <v-text-field
                      v-model="newMember.firstname"
                      label="First Name"
                      required>
                  </v-text-field>
                  <v-text-field
                      v-model="newMember.lastname"
                      label="Last Name"
                      required>
                  </v-text-field>
                  <v-text-field
                      v-model="newMember.email"
                      label="E-mail"
                      required>
                  </v-text-field>
                  <v-text-field
                      v-model="newMember.phone"
                      label="Phone"
                      required
                      mask="phone"
                  >
                  </v-text-field>
                  <v-select
                  :items="genderItems"
                  label="Gender"
                  v-model="newMember.gender"
                  ></v-select>
                  <v-select
                  :items="ages"
                  label="Age"
                  v-model="newMember.age"
                  ></v-select>
                  <v-text-field
                      v-model="newMember.pin"
                      label="PIN"
                      maxlength="6"
                      required
                      autocomplete="off">
                  </v-text-field>
                  <v-btn :disabled="loading" @click.prevent="addNewMember">
                      Add Member
                  </v-btn>
              </v-form>
              
          </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: "RegisterMember",
  created: () => {
    console.log("Created")
  },
  data: function() {
    return {
      newMember: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        pin: ""
      },
      ages: [
        { value: "18", text: "18 +" },
        { value: "17", text: "17" },
        { value: "16", text: "16" },
        { value: "15", text: "15" },
        { value: "14", text: "14" },
        { value: "13", text: "13" },
        { value: "12", text: "12" },
        { value: "11", text: "11" },
        { value: "10", text: "10" },
        { value: "9", text: "9" },
        { value: "8", text: "8" },
        { value: "7", text: "7" }
      ],
      genderItems: [
        { value: "M", text: "Male" },
        { value: "F", text: "Female" },
        { value: "O", text: "Other" }
      ]
    };
  },
  methods: {
    addNewMember: function() {
      console.log(this.newMember);
      this.$store.dispatch("memberstore/REGISTER_MEMBER", this.newMember);
    }
  },
  computed: {
    error: function() {
      return this.$store.getters.error;
    },
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
