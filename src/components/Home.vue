
<template>
<v-container fluid>
  <v-row justify="center" align="start" no-gutters="" >
    <v-col cols="12" sm="10" lg="8">
        <v-container fluid>
          <v-row justify="center" align="center" no-gutters="">
            <v-col cols="12">
              
                <div class="main-title text-center">
                  Knickerbocker Tennis
                </div>
              
            </v-col>
          </v-row>
          <v-row justify="center" align="center" no-gutters="">
            <v-col
              v-for="card in cards"
              :key="card.title"
              v-bind="{ cols: card.xs, sm: card.sm, md: card.md }"
              class="pa-2"
            >
              <v-card :to="{name: card.dest}" raised="" >
                <v-img
                  :src="require(`@/assets/${card.img}`)"
                  :lazy-src="require(`@/assets/${card.img_small}`)"
                  min-height="100"
                  max-height="325"
                  aspect-ratio="1.5"
                >

                  <v-row justify="center" align="end" no-gutters="" style="height: 100%;" >
                    <v-col cols="12">
                      <div class='tile-text-container'>
                        <h3 class="tile-title">{{ card.title }}</h3>
                        <div>{{ card.text }}</div>
                      </div>
                    </v-col>
                  </v-row>
                  
                </v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
    </v-col>
  </v-row>
</v-container>
</template>

<script>


export default {
  name: 'Home',
  data: () => {
    return {
      cards: [
        { title: 'Daily Schedule', text: 'View full schedule' ,img: 'players.jpg', img_small: 'players_small.jpg', xs: 12, sm: 12, md: 6, dest: "calendar" },
        { title: 'Book court', text: 'Regular court booking', img: 'tennisracquet.jpg', img_small: 'tennisracquet_small.jpg', xs: 12, sm: 12, md: 6, dest: "AdminBooking" },
        { title: 'Matches', text: 'Show current games', img: 'clubhouse.jpg', xs: 6, img_small: 'clubhouse_small.jpg', sm: 6 ,md: 3 },
        { title: 'Guests', text: 'Guest registration', img: 'clubhouse.jpg', xs: 6, img_small: 'clubhouse_small.jpg', sm: 6,md: 3 },
        { title: 'Manage', text: 'Administrative features',  img: 'clubhouse.jpg', img_small: 'clubhouse_small.jpg', xs: 6, sm: 6,md: 3 },
        { title: 'Reports', text: 'Reports',  img: 'clubhouse.jpg', img_small: 'clubhouse_small.jpg', xs: 6, sm: 6,md: 3 }
        
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
