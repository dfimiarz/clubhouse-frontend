import Axios from "axios";
/*import db from '../../firebase'*/

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
    ADD_COURT(state, court){
        state.courts.push(court)
    },
    ADD_COURT_INFO( state, info){
        state.courtstatus.push(info)
    },
    CLEAR_COURT_STATUS( state ){
        state.courtstatus.splice(0)
    },
    CLEAR_COURTS( state ){
        state.courts.splice(0)
    }
}

const actions = {
    
    loadCourtStatus({commit}){
        commit('CLEAR_COURT_STATUS')
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        Axios.get(process.env.VUE_APP_FUNCTION_ENDPOINT + '/getCourtStatus')
        .then(
            courtstatus => {
                commit('setLoading',false, { root: true })
                courtstatus.data.forEach(function(c) {
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
    loadCourts({commit}){
        commit('CLEAR_COURTS')
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })

        Axios.get(process.env.VUE_APP_FUNCTION_ENDPOINT + '/getCourts')
        .then(
            courtinfo => {
                commit('setLoading',false, { root: true })
                courtinfo.data.forEach(function(c) {
                    commit('ADD_COURT',c)
                });
            }  
        )
        .catch(
            error => {
                commit('setLoading',false, { root: true })
                commit('setError', error.message, { root: true })
            }
        )

        /*
        return db.collection('/courts').get()
        .then((snap) => {
            snap.forEach( doc => {
                const data = doc.data()
                const id = doc.id
                commit('ADD_COURT',{ id: id, lbl: data.lbl, msg: data.msg, state: data.state, statelbl: data.statelbl })
            })
        })
        */
    }
    /*
    ,
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
    */
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