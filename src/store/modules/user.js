
import auth from '../../firebase'

const state = {
    user: null,
    geoauth: null,
    userInitialized: null,
    geoInitialized: null
}

const mutations = {
    SET_USER(state, user) { 
        state.user = user;
    },
    SET_GEOAUTH(state, val){
        state.geoauth = val;
    },
    SET_USER_INIT(state,val){
        state.userInitialized = val;
    },
    SET_GEO_INIT(state,val){
        state.geoInitialized = val;
    }
}

const actions = {
    setUser({ commit }, user ) {
        commit('SET_USER',user);
        commit('SET_USER_INIT', true );
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
        commit('SET_GEO_INIT', true );
    },
    resetGeoAuthState({commit}){
        commit('SET_GEOAUTH', null);
        commit('SET_GEO_INIT', null);
    },
    resetUserAuthState({commit}){
        commit('SET_USER',null);
        commit('SET_USER_INIT', null);
    }
   
}

const getters = {
    user(state) {
        return state.user;
    },
    isAuthenticated(state){
        return state.geoauth === true || !!state.user
    },
    isInitialized(state){
        return state.userInitialized === true && state.geoInitialized === true;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}