
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"
import auth from "../../firebase";
import api from "../../services/db";
import processAxiosError from "../../utils/AxiosErrorHandler";
import fbErrHandler from "@/utils/FirebaseErrorHandler";

const state = {
    user: null,
    role: null,
    geoauth: null,
    authinit: false
}

const mutations = {
    SET_USER(state, user) { 
        state.user = user;
    },
    SET_GEOAUTH(state, val){
        state.geoauth = val;
    },
    SET_AUTH_INIT(state,val){
        state.authinit = val;
    },
    SET_ROLE(state,val){
        state.role = val;
    }
}

const actions = {
    setUser({ commit }, user ) {
        commit('SET_USER',user);
    },
    setAuthInit({commit},value){
        commit("SET_AUTH_INIT",value);
    },
    async login({ commit }, payload) {

        let errors = []
        let username = null;
        let geoauth = null;
        let role = null;

        try {
            const usercredentials = await signInWithEmailAndPassword(auth, payload.login, payload.password);
            username = usercredentials.user.email;
        }
        catch (err) {
            errors.push(fbErrHandler(err));
        }

        try {
            ({ role, geoauth } = await api.getUserProfile());
        } catch (err) {
            errors.push(err.message);
        }

        const error_count = errors.length;

        if( error_count === 0) {
            commit("SET_USER", username);
            commit("SET_ROLE",role);
            commit('SET_GEOAUTH', geoauth);
            return true;
        } else {
            throw new Error(errors[0]);
        }

    },
    async logout({commit}) {
        await auth.signOut();
        commit("SET_USER",null);
        commit("SET_ROLE",null);
    },
    setGeoAuth({ commit },value) {
        commit('SET_GEOAUTH', value);
    },
    resetAuth({dispatch}){
        dispatch("resetGeoAuthState");
        dispatch("resetUserAuthState");
    },
    resetGeoAuthState({commit}){
        commit('SET_GEOAUTH', null);
    },
    resetUserAuthState({commit}){
        commit("SET_USER",null);
        commit("SET_ROLE",null)
    },
    setUserRole({commit},val){
        commit('SET_ROLE',val);
    },
    async setupAuth({dispatch}){
        
        try{

            await dispatch("setUpUserAuth");
            await dispatch("getUserProfile");
            dispatch('setAuthInit',true);
        }
        catch(err){
            dispatch('setAuthInit',false);
            throw new Error(`${err.message}`);
        }

    },
    setUpUserAuth({commit}){

        return new Promise((resolve,reject) => {
            let unsubAuthListenerFun = onAuthStateChanged(auth,(user) => {

                //Check if user is set
                if( user ){
                    commit('SET_USER',user.email);
                }
                else {
                    commit('SET_USER',null);
                }

                //Done checking, unsub auth observer
                unsubAuthListenerFun();
                resolve(true);
            },() => {
                //Handle error
                commit('SET_USER',null);
                reject("Unable to auth user");
            })
        });
    },
    async setUpGeoAuth({commit}){

        try{
            const result = await api.checkGeoAuth();
        
            commit('SET_GEOAUTH', result.data.geoauth);
            return true;

        }
        catch (err) {
            commit('SET_GEOAUTH', false);
            throw new Error(processAxiosError(err));
        }
    },
    async getUserRole({commit}){
        try{
            const result = await api.getUserRole();
        
            commit('SET_ROLE', result.role);

            return true;
        }
        catch (err) {
            commit('SET_ROLE', null);

            throw new Error(processAxiosError(err));
        }
    },
    async getUserProfile({commit}){

        try{

            const { role, geoauth } = await api.getUserProfile();

            commit("SET_ROLE",role);
            commit('SET_GEOAUTH', geoauth);
            
            return true;
        }
        catch(err) {
            commit('SET_ROLE',null);
            commit('SET_GEOAUTH', false);

            throw new Error("Error while loading user profile.")
        }
    }
   
}

const getters = {
    user(state) {
        return state.user;
    },
    isAuthenticated(state){
        return state.authinit && (state.geoauth === true || !!state.user);
    },
    isInitialized(state){
        return state.authinit;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}