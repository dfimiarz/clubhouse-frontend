
import auth from "../../firebase";
import api from "../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";

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
    setUserInit({commit},value){
        commit("SET_USER_INIT",value);
    },
    async login( _ , payload) {
        
        const usercredentials = await auth.signInWithEmailAndPassword(payload.login, payload.password);

        return usercredentials.user.email;
    },
    async logout() {
        await auth.signOut();
    },
    setGeoAuth({ commit },value) {
        commit('SET_GEOAUTH', value);
        commit('SET_GEO_INIT', true );
    },
    setGeoInit({commit},value){
        commit("SET_GEO_INIT",value);
    },
    resetAuth({dispatch}){
        dispatch("resetGeoAuthState");
        dispatch("resetUserAuthState");
    },
    resetGeoAuthState({commit}){
        commit('SET_GEOAUTH', null);
        commit('SET_GEO_INIT', null);
    },
    resetUserAuthState({commit}){
        commit('SET_USER',null);
        commit('SET_USER_INIT', null);
    },
    setUpUserAuth({commit}){

        return new Promise((resolve,reject) => {
            let unsubAuthListenerFun = auth.onAuthStateChanged((user) => {
      
              //Check if user is set
              if( user ){
                commit('SET_USER',user.email);
              }
              else {
                commit('SET_USER',null);
              }

              //Set user user init state to true
              commit('SET_USER_INIT', true );

              //Done checking, unsub auth observer
              unsubAuthListenerFun();
              resolve(true)
            },() => {

              //Handle error
              commit('SET_USER',null);
              commit('SET_USER_INIT', false );
              reject();
            })
        });
    },
    async setUpGeoAuth({commit}){

        try{
            const result = await api.checkGeoAuth();
        
            commit('SET_GEOAUTH', result.data.geoauth);
            commit('SET_GEO_INIT', true);

            return true;
        }
        catch (err) {
            commit('SET_GEOAUTH', null);
            commit('SET_GEO_INIT', null);

            throw new Error(processAxiosError(err));
        }
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
        if( !!state.userInitialized && !!state.geoInitialized){
            return true;
        }
        else {
            return false;
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