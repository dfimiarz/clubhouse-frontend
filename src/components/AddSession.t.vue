<template>
<v-container fluid="" fill-height="">
    <v-layout row wrap justify-center="" align-content-space-between="">
      <v-flex xs12>
        <v-container grid-list-lg fill-height="">
          <v-layout row="" wrap align-content-space-around="" justify-center="">
            <v-flex
              v-for="card in cards"
              xs12 md6 lg5
              :key="card.title"
            >
                <v-card raised="" to="test" height="">
                  <v-card-title primary-title>
                    <v-container fluid="">
                      <v-layout wrap="">
                        <v-flex xs12>
                          <div class="main-title text-xs-center">
                            {{ card.title }}
                          </div>
                        </v-flex>
                        <v-flex xs12>
                          <div class="main-text text-xs-center">
                            {{ card.text }}
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-title>
                </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  components: {},
  name: "AddSession",
  data() {
    return {
      message: "Add a session",
      cards: [
        { title: 'Singles', text: '1 - 3 players' ,src: './Matches.jpg', flexxs: 12, flexsm: 6 },
        { title: 'Doubles', text: '4 players', src: './Booking700x325.jpg', flexxs: 12, flexsm: 6 },
        { title: 'Lesson', text: 'Tennis Lesson',  src: './Manage.jpg', flexxs: 12, flexsm: 6 },
        { title: 'Other', text: 'Tournament, Maintenance, etc', src: './Manage.jpg', flexxs: 12, flexsm: 6 }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.main-title{
  font-size: 3.5vmax;
}

.main-text{
  font-size: 2vmax;
}
</style>
