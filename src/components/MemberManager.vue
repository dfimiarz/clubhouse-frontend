<template>
    <v-container fluid="">
        <v-layout justify-center="" align-baseline="" wrap="" fill-height="">
            <v-flex xs12>
                <div class="headline text-xs-center">
                    Member Management
                </div>
            </v-flex>
            <v-flex xs12>
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
         items: [
          { title: 'Manage members', icon: 'dashboard' },
          { title: 'New member', icon: 'person' },
          { title: 'Member statistics', icon: 'settings' }
        ],
        right: true
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
