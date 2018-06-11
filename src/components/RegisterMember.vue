<template>
  <div class="registermember">
    New Member registration
    <div>
        <label for="firstname"> First Name:</label> 
        <input type="text" id="firstname" v-model="firstname">
    </div>
    <div>
        <label for="lastname"> Last Name:</label> 
        <input type="text" id="lastname" v-model="lastname">
    </div>
    <div>
        <label for="email"> Email:</label> 
        <input type="text" id="email" v-model="email">
    </div>
    <div>
        <label for="phone"> Phone:</label> 
        <input type="text" id="phone" v-model="phone">
    </div>
    <div>
        <label for="gender"> Gender:</label> 
        <select id="gender" v-model="gender">
            <option value="F">F</option>
            <option value="M">M</option>
        </select>
    </div>
    <div>
        <label for="username"> Username:</label> 
        <input type="text" id="username" v-model="username">
    </div>
    <div>
        <label for="password"> Password:</label> 
        <input type="password" id="password" v-model="password">
    </div>
     <div>
        <label for="pin"> PIN:</label> 
        <input type="text" id="pin" v-model="pin">
    </div>
    <div>
        <label for="rank"> Tenis rank:</label> 
        <select id="rank" v-model="rank">
            <option value="0">Beginer</option>
            <option value="1">Intermediate</option>
            <option value="2">Pro</option>
        </select>
    </div>
    <button @click="addNewMember">Sign up</button>
  </div>
</template>

<script>
export default {
  name: 'RegisterMember',
  data: function (){
      return {
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          gender: '',
          username: '',
          password: '',
          pin: '',
          rank: ''
      }
  },
  methods: {
      addNewMember: function(){
          let member = {
              firstname: this.firstname,
              lastname: this.lastname,
              email: this.email,
              phone: this.phone,
              gender: this.gender,
              username: this.username,
              password: this.password,
              pin: this.pin,
              rank: this.rank
          }

          this.$store.dispatch('memberstore/REGISTER_MEMBER',member)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
