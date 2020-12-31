
<template>
<v-container>
  <v-row justify="center" align="start" no-gutters="" >
    <v-col cols="12" md="10" lg="8">
        <v-container fluid>
          <v-row justify="center" align="center" no-gutters="">
            <v-col cols="12">
              
                <div class="text-center text-h3 text-md-h2 text-xl-h1 py-5">
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

                  <v-row justify="center" align="end" no-gutters="" class="fill-height" >
                    <v-col cols="12">
                      <div class='tile-text-container'>
                        <h3 class="text-h6 text-xl-h4">{{ card.title }}</h3>
                        <div class="body-2">{{ card.text }}</div>
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
        { title: 'Daily Schedule', text: 'View full schedule' ,img: 'players.jpg', img_small: 'players_small.jpg', xs: 12, sm: 6, md: 6, dest: "calendar" },
        { title: 'Book court', text: 'Regular court booking', img: 'tennisracquet.jpg', img_small: 'tennisracquet_small.jpg', xs: 12, sm: 6, md: 6, dest: "MatchBooking" },
        { title: 'Matches', text: 'Show current games', img: 'curr_matches.jpg', img_small: 'curr_matches_small.jpg', xs: 12, sm: 6,md: 3 },
        { title: 'Guests', text: 'Guest management', img: 'guests_btn_bg.jpg', img_small: 'clubhouse_small.jpg', xs: 12, sm: 6,md: 3, dest: "guestregistration" },
        { title: 'Manage', text: 'Club management',  img: 'manager.jpg', img_small: 'manager_small.jpg', xs: 12, sm: 6,md: 3, dest: "EventBooking" },
        { title: 'Reports', text: 'Reports',  img: 'reports.jpg', img_small: 'reports_small.jpg', xs: 12, sm: 6,md: 3 }
        
      ]
      
    }
  },
  methods: {

  },
  computed: {

    tileTitleClass: function(){
      return this.$vuetify.breakpoint.mdAndDown ? { 'headline' : true } : { 'display-1' : true }
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

/* .tile-title  {
  text-shadow: 3px 3px #000000;  
} */

</style>
