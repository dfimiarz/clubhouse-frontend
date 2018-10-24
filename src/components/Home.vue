
<template>
<v-container fluid fill-height="" >
  <v-layout justify-center align-content-space-between="" wrap="">
    <v-flex  md12 lg8 x6>
      <v-card raised="" >
        <v-card-title primary-title>
          <v-container fluid="">
            <v-layout wrap="">
              <v-flex xs12>
                <div class="main-title text-xs-center">
                  Knickerbocker Tennis
                </div>
              </v-flex>
              <v-flex xs12>
                <div class="main-text text-xs-center">
                  Please choose one of the options below...
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex md12 lg8 x6>
        <v-container fluid="" grid-list-lg >
          <v-layout row wrap>
            <v-flex
              v-for="card in cards"
              v-bind="{ [`xs${card.flexxs}`]: true,
                        [`sm${card.flexsm}`]: true }"
              :key="card.title"
            >
              <v-card :to="{name: 'NewBooking'}" raised="" >
                <v-img
                  :src="card.src"
                  height="250px"  
                >
                  
                  <v-container fill-height fluid>
                    <v-layout justify-center="" align-end="" row>
                      <v-flex xs12>
                        <div class='tile-text-container'>
                          <h3 class="tile-title">{{ card.title }}</h3>
                          <div>{{ card.text }}</div>
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-img>
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
  name: 'Home',
  data() {
    return {
      cards: [
        { title: 'Matches', text: 'View today\'s match schedule' ,src: './Matches.jpg', flexxs: 12, flexsm: 6 },
        { title: 'Booking', text: 'Reserve a court', src: './Booking700x325.jpg', flexxs: 12, flexsm: 6 },
        { title: 'Club Admin', text: 'Administrative features',  src: './Manage.jpg', flexxs: 12, flexsm: 6 },
        { title: 'Club Info', text: 'Clud information', src: './Manage.jpg', flexxs: 12, flexsm: 6 }
      ]
      
    }
  },
  methods: {
    cardClicked: () => {
      console.log("CardClicked")
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.tile-text-container{
  background-color: rgba(76 , 76, 76, 0.9);
  padding: 5px;
  
}

.tile-title  {
  text-shadow: 3px 3px #000000;
  font-size: 2.5vmax;
  
}

.main-title{
  font-size: 4vmax;
}

.main-text{
  font-size: 1vmax;
}
</style>
