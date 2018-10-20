<template>
    <v-container fluid fill-height>
        <v-layout justify-center align-baseline="">
            <v-flex xs12>
                Member Manager
               <router-view></router-view>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: "MemberManager",
  data: function() {
    return {
    };
  },
  methods: {

  },
  computed: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
