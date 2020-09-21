// import db from '../../firebase'
// import { isFunction } from 'util';
// import utils from '../../services/utils'
import Axios from "axios";

const state = {

    bookings: [
      
    ]
}

const mutations = {
    ADD_BOOKING(state,match){
        state.bookings.push(match)
    },
    REMOVE_BOOKINGS(state){
        state.bookings.splice(0)
    }
}

const actions = {
    clearBookings({commit}){
        console.log("Clearing");
        commit('REMOVE_BOOKINGS')
    },
    loadBookings({commit},date){
        commit('REMOVE_BOOKINGS')
        //console.log("fetching for" + date)
        Axios.get(process.env.VUE_APP_BACKEND + '/bookings',{
                params: {
                    date: date
                }
            })
            .then(function (response) {
                const bookings = response.data
                bookings.forEach((match) => {
                    commit('ADD_BOOKING',JSON.parse(match))
                })
            })
            .catch(function (error) {


                if( error.response ){
                    //console.log(error.response.data);
                    //console.log(error.response.status);
                    //console.log(error.response.headers);
                    commit('setError', error.response.data,  { root: true })

                }
                else{
                    //console.log('Error: ', error.message);
                    commit('setError', "Connection failed",  { root: true })
                }
                
            })
            .finally(() => {
                
                commit('setLoading',false,  { root: true })
            });
    }

}

const getters = {
    loadedBookings( state ){
        return state.bookings;
    },
    bookingsForCourt( state ){
        return (courtid) => {
            return state.bookings.filter( (booking) => {
                return booking.court == courtid
            })
        }
    }
}

export default {
    namespaced: true, 
    state,
    mutations,
    actions,
    getters
}