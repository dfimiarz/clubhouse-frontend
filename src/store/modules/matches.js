const state = {

    loadedMatches: [
        { text: '4 players, bumpable', durMin: 120, startMin: 60, id:1, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 300, id:2, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:3, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 480, id:4, court: 2 }
    ]
}

const mutations = {
}

const actions = {
    //addNewUser({commit,state,rootState},userPayload){
        // commit('clearError', null, { root: true })
        // commit('setLoading', true, { root: true })
        // rootState.auth.createUserWithEmailAndPassword(userPayload.email,userPayload.password)
        // .then(
        // user => {
        //     commit('setLoading',false, { root: true })
        //     const newUser = {
        //         id: user.uid,
        //         email: user.email,
        //         role: [],
        //         managedDepts: []
        //     }
        //     commit('SET_USER', newUser)
        // }  
        // )
        // .catch(
        //     error => {
        //         commit('setLoading',false, { root: true })
        //         commit('setError', error.message, { root: true })
        //     }
        // )
    //}
}

const getters = {
    loadedMatches( state ){
        return state.loadedMatches;
    },
    matchesForCourt( state ){
        return (courtid) => {
            return state.loadedMatches.filter( (match) => {
                return match.court == courtid
            })
        }
    },
    loadedMatch( state ){
        return (matchID) => {
            return state.loadedMatches.find((match) => {
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