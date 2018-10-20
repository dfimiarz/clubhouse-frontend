<template>
    <v-container fluid fill-height>
        <v-layout justify-center align-baseline="">
            <v-flex xs12 sm6 md4>
                <div class="registermember">
                    New Member registration
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
                            v-model="lname"
                            label="Last Name"
                            required>
                        </v-text-field>
                         <v-text-field
                            v-model="email"
                            label="E-mail"
                            required>
                        </v-text-field>
                         <v-text-field
                            v-model="phone"
                            label="Phone"
                            required>
                        </v-text-field>
                        <v-select
                        :items="genderItems"
                        label="Gender"
                        ></v-select>
                        
                        <div>
                            <label for="age"> Age:</label> 
                            <select id="age" v-model.number="newMember.age">
                                <option v-bind:value="a.val" :key="a.val" v-for="a in ages">{{ a.lbl }}</option>
                            </select>
                        </div>
                        <div>
                            <label for="pin">Access PIN:</label> 
                            <input type="text" id="pin" v-model="newMember.pin" autocomplete="off" maxlength="5" size="5">
                        </div>
                        <button @click.prevent="addNewMember" :disabled="loading">Sign up</button>
                    </v-form>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: "RegisterMember",
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
        { val: "18", lbl: "18 +" },
        { val: "17", lbl: "17" },
        { val: "16", lbl: "16" },
        { val: "15", lbl: "15" },
        { val: "14", lbl: "14" },
        { val: "13", lbl: "13" },
        { val: "12", lbl: "12" },
        { val: "11", lbl: "11" },
        { val: "10", lbl: "10" },
        { val: "9", lbl: "9" },
        { val: "8", lbl: "8" },
        { val: "7", lbl: "7" }
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
