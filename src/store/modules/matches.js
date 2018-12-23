const state = {

    loadedMatches: [
        { text: '4 players, bumpable', durMin: 120, startMin: 60, id:1, court: 1 },
        { text: '4 players, bumpable', durMin: 120, startMin: 360, id:2, court: 1 }
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
    loadedMatch( state ){
        return (matchID) => {
            return state.loadedMatches.find((match) => {
                return match.id = matchID
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