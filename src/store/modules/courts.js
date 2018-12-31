import Axios from "axios";

/*

Expected court format

label:"#1",
id:1,
state:1,
statelbl:"OPEN",
status:{label:"Available",caption:"Free for 1 hour"},
freefor: 1 * 3600 * 1000,
freein:0,
bookable: true,
msg:[]

*/

const state = {
    courts: []
}

const mutations = {
    ADD_COURT_INFO(state, court){
        state.courts.push(court)
    },
    REMOVE_ALL_COURTS(state){
        state.courts.length = 0
    }
}

const actions = {
    loadCourtInfo({commit,/*state,rootState*/}){
        commit('REMOVE_ALL_COURTS')
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        Axios.get(process.env.VUE_APP_FUNCTION_ENDPOINT + '/getCourts')
        .then(
            courts => {
                commit('setLoading',false, { root: true })
                courts.data.forEach(function(c) {
                    commit('ADD_COURT_INFO',c)
                });
            }  
        )
        .catch(
            error => {
                commit('setLoading',false, { root: true })
                commit('setError', error.message, { root: true })
            }
        )
    }
}

const getters = {
    getCourts: state => {
        return state.courts
    },
    getCourtInfo: state => {
        return courtid => {
            return state.courts.find( court => court.id == courtid)
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