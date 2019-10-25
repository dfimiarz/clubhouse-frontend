
<template>
<v-container fluid fill-height="">
  <v-layout justify-center="" align-start="" wrap="" row>
    <v-flex sm12 md10 lg8>
        <v-container fluid="" grid-list-lg fill-height="">
          <v-layout row wrap justify-center="" align-center="">
            <v-flex xs12>
              
                <div class="main-title text-center">
                  Knickerbocker Tennis
                </div>
              
            </v-flex>
            <v-flex
              v-for="card in cards"
              v-bind="{ [`xs${card.flexxs}`]: true,
                        [`sm${card.flexsm}`]: true,
                        [`md${card.flexmd}`]: true }"
              :key="card.title"
            >
              <v-card :to="{name: card.dest}" raised="" >
                <v-img
                  :src="require(`@/assets/${card.img}`)"
                  :lazy-src="require(`@/assets/${card.img_small}`)"
                  min-height="100"
                  max-height="325"
                  aspect-ratio="2.15"
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
  data: () => {
    return {
      cards: [
        { title: 'Schedule', text: 'View full schedule' ,img: 'players.jpg', img_small: 'players_small.jpg', flexxs: 12, flexsm: 12, flexmd: 6, dest: "calendar" },
        { title: 'Book court', text: 'Regular court booking', img: 'tennisracquet.jpg', img_small: 'tennisracquet_small.jpg', flexxs: 12, flexsm: 12, flexmd: 6, dest: "AdminBooking" },
        { title: 'Who is playing', text: 'Current games', img: 'clubhouse.jpg', flexxs: 12, img_small: 'clubhouse_small.jpg', flexsm: 12,flexmd: 6 },
        { title: 'Club Admin', text: 'Administrative features',  img: 'clubhouse.jpg', img_small: 'clubhouse_small.jpg', flexxs: 12, flexsm: 12,flexmd: 6 },
        
      ]
      
    }
  },
  methods: {
    cardClicked: () => {
      //console.log("CardClicked")
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
  font-size: calc(10px + 1.5vmax);
  
}

.main-title{
  font-size: calc(12px + 3.5vmax);
}

.main-text{
  font-size: 1vmax;
}
</style>
