<template>
<v-container fluid fill-height>
  <v-layout justify-start="" align-center>
    <v-flex xs12 xl10>
      <v-form>
       
       <v-layout>
          <v-autocomplete
          
          :items="members"
          v-model="player"
          @input="addPlayer"
          label="Click to select"
          :disabled="! canAddPlayer()"
          >
          </v-autocomplete>
      </v-layout>
        
      <div v-if="! playersAdded()" class="title my-3 red--text">No players selected</div>
      <v-container fluid fill-height grid-list-md v-else>
      <v-layout wrap="" row justify-start="" align-center="">
        <v-flex 
           v-for="(p, index) in players"
          :key=p
          xs12 sm6
        >
        <v-card 
          raised=""
         
          >
            <v-card-title primary-title>
              
                <v-layout wrap="" row justify-center="" align-baseline="">
                  <v-flex xs12>
                    <div class="title">Player # {{ index + 1}}: {{ p }}</div>
                  </v-flex>
                  <v-flex xs12>
                    <div class="caption">Played today for: 0 min. Repeater: No</div>
                  </v-flex>
                </v-layout>
            
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn small v-if="canAddPlayer()">Add Guest*</v-btn>
              <v-spacer></v-spacer>
              <v-btn @click="removePlayer(p)" small>Remove</v-btn>
            </v-card-actions>
        </v-card>
        </v-flex>
      </v-layout>
      </v-container>
        
      <v-select
        :items="courts"
        label="Court"
      ></v-select>
        <v-select
        v-model="startTime"
        :items="startOptions"
        label="Start Time:"
      ></v-select>

      <v-text-field
          label="Player #1 PIN"
          type="password"
          class="shrink"
        ></v-text-field>
      <div class="my-2" v-if="playersAdded()">
        <div class="headline">Maximum time: {{maxGameTime}} min. Bumpable</div>
      </div>
      <v-btn :disabled="! playersAdded()">
          Start Match
      </v-btn>
    </v-form>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  name: "RegularMatchBooking",
  data: function() {
    return {
      members: [
        'Todd Snyder','Laurent Mars','Jun Tsuchiya','Ardis Burfield','Boris Alter','Domitila Mcentee','Clemmie Merrihew','Luis Kersh','Jackelyn Howells','Jeannine Mersch','Teresia Bowdoin','Cicely Koval','Contessa Reda','Sheree Mosier','Roxana Torrance','Mohammad Buse','Amberly Pates','Tim Tassin','Roderick Schurman','Federico Demayo','Alysha Cybulski','Jamison Pattillo','Tanna Aye','Rose Pedretti','Josephina Helmuth','Linnea Kisling','Celestina Ard','Tisha Hooker','Donya Granata','Ashli Hoagland','Jeramy Zarrella','Mercedez Cavalier','Providencia Sommers','Lesley Sandt','Ileen Laufer','Dirk Munk','Tamatha Clerk','Shirely Bun','Enid Jasmin','Stephany Siegal','Fawn Tibbs','Erna Sloat','Desmond Hirano','Pennie Marro','Dawne Bridgers','Tammi Quam','Lorenzo Sievers','Emery Casaus','Lynne Gregg','Tiffanie Rappaport','Gearldine Reineck','Lin Royals','Tennille Fenner','Yael Hillenbrand','Emmaline Pafford','Drew Haigh','Kasha Banning','Daine Knoll','Caridad Proffitt','Chun Brockwell','Sherri Nunez','Otelia Schmitmeyer','Oswaldo Montiel','Thu Love','Regina Drapeau','Agnus Hooker','Carmelia Beus','Virgina Biggers','Mac Talarico','Dollie Franzone','Kayleigh Buckler','Racheal Billman','Marlon Amante','Lissa Wison','Alina Joseph','Dia Rozell','Nelson Lessman','Camellia Casner','Carri Moncayo','Gayla Cordeiro','Solomon Kunst','Maryann Coghill','Rebekah Dorado','Tameka Urich','Valencia Buckholz','Jessie Wheeless','Marybelle Mckinley','Joanna Deremer','Tandy Barrows','Brooke Guill','Dania Wilker','Floy Gariepy','Almeta Bella','Drucilla Malson','Eladia Delaughter','Columbus Ruggiero','Gavin Schacherer','Carson Dora','Christin Hackett','Kaila Ghoston','Annamarie Dettman','Catrice Teran','Bobby Remaley','Clement Pruitt','Celsa Zartman','Moises Cephas','Kelly Fridley','Deena Magdaleno','Jan Alers','Elina Huskey','Grant Vannest','Nga Stemen','Reginald Pendley','Juliann Runkle','Hoa Samons','Kathryn Alfrey','Coretta Stahly','Fredericka Mortimer','Tommye Rotondo','Katy Carron','Fumiko Ericsson','Joellen Cosby','Leticia Turck','Terrell Bouska','Camie Grieco','Lasandra Mccusker','Shu Mccaffery','Alec Aberle','Malena Nesler','Elba Kimbler','Elena Snedeker','Ahmad Wiedemann','Wendell Froehlich','Shane Maddock','Cheryll Vasques','Mistie Rhinehart','Laurine Bonifacio','Susanna Stehlik','Dwayne Stout','Suzann Leffler','Yolande Mcelyea','Joann Stuckey','Ricky Rasnick','Arnulfo Favreau','Leisha Collison','Shalon Callender','Pat Bourassa','Jeanie Penny','Melinda Tan','Dexter Davidson','Bunny Stockman','Roland Lindeman','Lien Acy'
      ],
      courts: ['# 1','# 2','# 3','# 4','# 5'],
      startOptions: ["Now","5 min"],
      startTime: "Now",
      isGuest: false,
      player: null,
      players: []
    }
  },
  methods:{
    addPlayer: function (){
      if( this.players.length < 4 && this.player != null ){
        this.players.push(this.player)
        this.player = null
        this.isGuest = false
      }
    },
    removePlayer: function (player){
      this.players.splice(this.players.indexOf(player), 1)
    },
    isPlayerChosen: function (){
      return this.player != null
    },
    playersAdded: function() {
      return this.players.length > 0
    },
    canAddPlayer: function(){
      return this.players.length < 4
    }
  },
  computed: {
    maxGameTime: function(){
      return this.players.length * 30
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
