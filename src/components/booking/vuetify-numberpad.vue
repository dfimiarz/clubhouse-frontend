<template>
    <v-card>
        <v-card-text class="px-0 py-0">
             <v-container>
                <v-row >
                    <v-col cols="12">
                        <div class="text-right display-1">{{ duration }} min.</div>
                    </v-col>
                </v-row>
                <v-row  justify="center">
                    <v-col class="text-center"><v-btn @click="increment(1)">1</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="increment(2)">2</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="increment(3)">3</v-btn></v-col>
                </v-row>
                <v-row  justify="center">
                    <v-col class="text-center"><v-btn @click="increment(4)">4</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="increment(5)">5</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="increment(6)">6</v-btn></v-col>
                </v-row>
                <v-row  justify="center">
                    <v-col class="text-center"><v-btn @click="increment(7)">7</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="increment(8)">8</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="increment(9)">9</v-btn></v-col>
                </v-row>
                <v-row  justify="center">
                    <v-col class="text-center"><v-btn color="warning" @click="clear">C</v-btn></v-col>
                    <v-col class="text-center"><v-btn @click="removeDigit"> &#x27A1; </v-btn> </v-col>
                    <v-col class="text-center"><v-btn @click="increment(0)">0</v-btn></v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <slot name="actions"></slot>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
    name: 'v-number-pad',
    props: ['value','maxval'],
    data(){
        return {

        }
    },
    computed: {
        duration: {
            get: function(){
                return this.value
            },
            set: function(newVal){
                this.$emit('input',newVal)
            }
        }
    },
    methods:{
        increment: function(val){
            this.duration = this.value * 10 + val
        },
        clear: function(){
            this.duration = 0
        },
        removeDigit(){
            this.duration = Math.floor(this.value / 10)
        }
    },
    created: function(){
        
    },
    mounted: function(){
        
    }
}

</script>

