const state = {
    user: null
}

const mutations = {
    SET_USER(state,userPayload){
        state.user = userPayload
    }
}

const actions = {
    //signUserIn({commit,state,rootState},userPayload){
        // commit('clearError', null, { root: true })
        // commit('setLoading', true, { root: true })
        // rootState.auth.signInWithEmailAndPassword(userPayload.email,userPayload.password)
        // .then(
        //     user => {
        //         commit('setLoading',false, { root: true })
        //         const newUser = {
        //             id: user.uid,
        //             email: user.email,
        //             role: [],
        //             managedDepts: []
        //         }
        //         commit('SET_USER', newUser)
        //     }
        // )
        // .catch(
        //     error => {
        //         commit('setLoading',false,  { root: true })
        //         commit('setError', error.message,  { root: true })
        //     }
        // )
    //},
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
    user ( state ) {
        return state.user;
    }
}

export default {
    namespaced: true, 
    state,
    mutations,
    actions,
    getters
}