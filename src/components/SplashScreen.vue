<template>
    <v-content>
        <v-container fluid="" style="height: 100vh;" class="pa-0">
        
        <v-row no-gutters="" align="center" justify="center" class="fill-height">
            <v-img :src="require('@/assets/knicksbg.jpg')" aspect-ratio="1.875" height="100%" gradient="to top right, rgba(128,128,128,.33), rgba(200,200,200,.7)">
            <v-row no-gutters="" align="center" justify="center" class="fill-height">
                <div class="pa-3" style="border-radius: 10px;border: 5px solid white;background-color: green;">
                <div class="title">Knickerbocker Field Club</div>
                <div>
                    <v-progress-linear v-if="loading"
                    indeterminate
                    color="white"
                    ></v-progress-linear>
                </div>
                <div class="caption text-center" v-if="error">
                    Error: {{ error }}
                </div>
                </div>
            </v-row>
            </v-img>
        </v-row>
        </v-container>
    </v-content>
</template>

<script>
export default {
    props: {
        error : {
            type: String
        },
        loading: {
            type: Boolean,
            required: true
        }
    },
    name: "splashscreen",
    data: function(){
        return {

        }
    }
}
</script>

<style lang="stylus" scoped>

</style>