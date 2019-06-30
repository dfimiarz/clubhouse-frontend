import db from '../../firebase'
import { isFunction } from 'util';

let unsubscribe = null

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
    watchCourts({commit},date){
        commit('REMOVE_MATCHES')

        if( isFunction(unsubscribe)){
            unsubscribe()
        }

        const timemil = date.getTime()
        let tomorrow_dt = new Date(timemil + 86400000)

        unsubscribe = db.collection("/matches").where("start_dt",">=",date).where("start_dt","<=",tomorrow_dt)
        .onSnapshot({includeMetadataChanges: true },
            function(snapshot) {
            snapshot.docChanges({includeMetadataChanges: true })
                .forEach(function(change) {

                    //console.log("test" + change.doc.metadata.hasPendingWrites)

                    if (change.type === "added") {
                        
                        let data = change.doc.data()
                        
                        let match = {
                            id: change.doc.id,
                            court: data.court,
                            bumpable: data.bumpable,
                            // date: data.date,
                            // startMin: data.start,
                            // endMin: data.end,
                            start_dt: data.start_dt.toDate(),
                            end_dt: data.end_dt.toDate(),
                            // durationMin: data.duration,
                            note: data.note,
                            players: data.players
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