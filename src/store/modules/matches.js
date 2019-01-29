import db from '../../firebase'
import { isFunction } from 'util';

let unsubscribe = null

const state = {

    matches: [
        /*
        { text: '4 players, bumpable', durMin: 120, startMin: 0, id:1, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 300, id:2, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:3, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:4, court: 2 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:4, court: 7 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:4, court: 6 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:4, court: 4 }
        */
    ]
}

const mutations = {
    ADD_MATCH(state,match){
        state.matches.push(match)
    },
    REMOVE_MATCHES(state){
        state.matches.lenght = 0
    }
}

const actions = {
    watchCourts({commit}){

        var date = new Date("2019-01-24 00:00:00")
        unsubscribe = db.collection("/matches").where("date","==",date)
        .onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                if (change.type === "added") {
                    console.log("Match added: ", change.doc.data(),change.doc.id);
                    let data = change.doc.data()
                    
                    let match = { 
                            text: '4 players, bumpable', 
                            durMin: data.duration, 
                            startMin: data.start, 
                            id: change.doc.id, 
                            court: data.court 
                        }                    
                    commit('ADD_MATCH', match)
                   
                }
                if (change.type === "modified") {
                    console.log("Match changed: ", change.doc.data());
                }
                if (change.type === "removed") {
                    console.log("Match removed: ", change.doc.data());
                }
            })
        })
    },
    stopWatching({commit}){

        commit('REMOVE_MATCHES')

        if( isFunction(unsubscribe) ){
            console.log("Stopping listeners")
            unsubscribe()
        }
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