<template>
    <v-container fluid="">
        <v-row>
            <v-col cols="12">
                <div class="headline text-xs-center">
                    Guest Management
                </div>
                <div>
                    <span>Registration</span><span>Activation</span>
                </div>
            </v-col>
            <v-col cols="12">
                <router-view></router-view>
            </v-col>
        </v-row>
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
