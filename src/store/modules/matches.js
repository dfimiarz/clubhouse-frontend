// import db from '../../firebase'
// import { isFunction } from 'util';
// import utils from '../../services/utils'
import Axios from "axios";

// let unsubscribe = null

const state = {

    matches: [
      
    ]
}

const mutations = {
    ADD_MATCH(state,match){
        state.matches.push(match)
    },
    REMOVE_MATCHES(state){
        state.matches.splice(0)
    }
}

const actions = {
    // watchCourts({commit},date){
    //     commit('REMOVE_MATCHES')

    //     if( isFunction(unsubscribe)){
    //         unsubscribe()
    //     }

    //     /** 
    //      * Each session must not be longer then 24 
    //      * This way to get all sessions falling with today we can get those
    //      * with end_date > DATET00:00 && DATET00:00 + 48 hours.
    //      */ 
        

    //     const datestr = utils.dateToYear(date) 
        
    //     unsubscribe = db.collection("/matches").where("date","==",datestr)
    //     .onSnapshot({includeMetadataChanges: true },
    //         function(snapshot) {
    //         snapshot.docChanges({includeMetadataChanges: true })
    //             .forEach(function(change) {

    //                 //console.log("test" + change.doc.metadata.hasPendingWrites)

    //                 if (change.type === "added") {
                        
    //                     let data = change.doc.data()
                        
    //                     let match = {
    //                         id: change.doc.id,
    //                         date: data.date,
    //                         court: data.court,
    //                         bumpable: data.bumpable,
    //                         startmin: data.startmin,
    //                         endmin: data.endmin,
    //                         note: data.note,
    //                         players: data.players
    //                     }

                                        
    //                     commit('ADD_MATCH', match)
                        
    //                 }
    //                 if (change.type === "modified") {
    //                     console.log("Match changed: ", change.doc.data());
    //                 }
    //                 if (change.type === "removed") {
    //                     console.log("Match removed: ", change.doc.data());
    //                 }
    //         })
    //     })
    // },
    // stopWatching({commit}){

    //     commit('REMOVE_MATCHES')

    //     if( isFunction(unsubscribe) ){
    //         console.log("Stopping listeners")
    //         unsubscribe()
    //     }
    // },
    loadMatches({commit}){
        commit('REMOVE_MATCHES')
        Axios.get(process.env.VUE_APP_FUNCTION_ENDPOINT + '/matches')
            .then(function (response) {
                const matches = response.data
                matches.forEach((match) => {
                    commit('ADD_MATCH',JSON.parse(match))
                })
            })
            .catch(function (error) {


                if( error.response ){
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    commit('setError', error.response.data,  { root: true })

                }
                else{
                    console.log('Error: ', error.message);
                    commit('setError', "Connection failed",  { root: true })
                }
                
            })
            .finally(() => {
                
                commit('setLoading',false,  { root: true })
            });
    }

}

const getters = {
    loadedMatches( state ){
        return state.matches;
    },
    matchesForCourt( state ){
        return (courtid) => {
            return state.matches.filter( (match) => {
                return match.court == courtid
            })
        }
    },
    loadedMatch( state ){
        return (matchID) => {
            return state.match.find((match) => {
                return match.id == matchID
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