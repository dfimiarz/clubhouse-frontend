export const itemmixin = {
    data(){
        return {
            'item_type_lbl_height' : 32,
            'item_text_container_height': 52
        }
    },
    methods: {
        formatName: function (player) {
            const lastname =
              player.lastname == null || typeof player.lastname !== "string"
                ? "N/A"
                : player.lastname.length <= 1
                ? player.lastname
                : player.lastname.substr(0, 1) + ".";
      
            const firstname =
              player.firstname == null || typeof player.firstname !== "string"
                ? "N/A"
                : player.firstname.length > 7
                ? player.firstname.substr(0, 5) + ".."
                : player.firstname;
      
            return firstname + " " + lastname;
           }
    },
    computed: {
      
    }
}