<template>
  <div class="registermember">
    New Member registration
    <form>
        <div v-if="error" class="errcontainer">
           <span>Error: {{ error }}</span>
        </div>
        <div>
            <label for="firstname"> First Name:</label> 
            <input type="text" id="firstname" v-model="newMember.firstname" autocomplete="given-name">
        </div>
        <div>
            <label for="lastname"> Last Name:</label> 
            <input type="text" id="lastname" v-model="newMember.lastname" autocomplete="family-name">
        </div>
        <div>
            <label for="email"> Email:</label> 
            <input type="text" id="email" v-model="newMember.email" autocomplete="email">
        </div>
        <div>
            <label for="phone"> Phone:</label> 
            <input type="text" id="phone" v-model="newMember.phone">
        </div>
        <div>
            <label for="gender"> Gender:</label> 
            <select id="gender" v-model="newMember.gender">
                <option value="F">F</option>
                <option value="M">M</option>
            </select>
        </div>
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
        <div>
            <label for="rank"> Tenis rank:</label> 
            <select id="rank" v-model="newMember.rank">
                <option value="0">Beginer</option>
                <option value="1">Intermediate</option>
                <option value="2">Pro</option>
            </select>
        </div>
        <button @click.prevent="addNewMember" :disabled="loading">Sign up</button>
    </form>
  </div>
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
            pin: "",
            rank: ""
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
          return this.$store.getters.error
      },
      loading: function(){
          return this.$store.getters.loading
      }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.errcontainer{
    margin: 10px 0px 10px 0px;
    border: 1px solid;
    color: red;
    font-weight: bold;
    box-sizing: border-box;
}
</style>
