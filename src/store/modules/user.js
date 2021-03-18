import auth from '../../firebase'

const state = {
    user: null,
    geoauth: null
}

const mutations = {
    SET_USER(state, user) { 
        state.user = user;
    },
    SET_GEOAUTH(state, val){
        state.geoauth = val;
    }
}

const actions = {
    setUser({ commit }, payload) {
        commit('SET_USER', payload)
    },
    async login( _ , payload) {
        //onAuthStateChanged observer should be setup to handle change in user signin. See main.js
        await auth.signInWithEmailAndPassword(payload.login, payload.password);
    },
    async logout() {
        
        await auth.signOut();
    
    },
    setGeoAuth({ commit },value) {

        commit('SET_GEOAUTH', value);
    
    }

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
    user(state) {
        return state.user;
    },
    isAuthenticated(state){
        return state.geoauth === true || state.user !== null
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}