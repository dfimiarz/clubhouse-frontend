import Axios from "axios";

/*

Expected court format

label:"#1",
id:1,
state:1,
statelbl:"OPEN",
status:{label:"Available",caption:"Free for 1 hour"},
startat: fakeStartTimeMs,
endat: fakeStartTimeMs + 1 * 3600 * 1000, 
serverTime: now_ms,
bookable: true,
msg:[]

*/

const state = {
    courts: [],
    courtstatus: []
}

const mutations = {
    ADD_COURT_INFO(state, court){
        state.courts.push(court)
    },
    REMOVE_ALL_COURTS(state){
        state.courts.length = 0
    },
    UPDATE_COURT_INFO(state, newcourt){
        const index = state.courts.findIndex((oldcourt) => oldcourt.id == newcourt.id )
        console.log( newcourt.startat + "" + newcourt.endat )
        state.courts[index].startat = newcourt.startat
        state.courts[index].endat = newcourt.endat
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
    },
    updateCourtInfo({commit}){
        Axios.get(process.env.VUE_APP_FUNCTION_ENDPOINT + '/getCourts')
        .then(
            courts => {
                courts.data.forEach(function(c) {
                    commit('UPDATE_COURT_INFO',c)
                });
            }  
        )
        .catch(
            error => {
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
    },
    getCourtStatus: state => {
        return state.courtstatus
    }
}

export default {
    namespaced: true, 
    state,
    mutations,
    actions,
    getters
}