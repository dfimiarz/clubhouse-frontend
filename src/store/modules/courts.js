import Axios from "axios";
import dbservice from "../../services/db"

const state = {
    courts: [],
    courtstatus: []
}

const mutations = {
    ADD_COURT(state, court) {
        state.courts.push(court)
    },
    ADD_COURT_INFO(state, info) {
        state.courtstatus.push(info)
    },
    CLEAR_COURT_STATUS(state) {
        state.courtstatus.splice(0)
    },
    CLEAR_COURTS(state) {
        state.courts.splice(0)
    }
}

const actions = {

    loadCourtStatus({ commit }) {
        commit('CLEAR_COURT_STATUS')
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        Axios.get(process.env.VUE_APP_BACKEND + '/getCourtStatus')
            .then(
                courtstatus => {
                    commit('setLoading', false, { root: true })
                    courtstatus.data.forEach(function (c) {
                        commit('ADD_COURT_INFO', c)
                    });
                }
            )
            .catch(
                error => {
                    commit('setLoading', false, { root: true })
                    commit('setError', error.message, { root: true })
                }
            )
    },
    async loadCourts({ commit }) {

        let courtdata = await dbservice.getCourts()

        commit('CLEAR_COURTS')
        courtdata.data.forEach(function (c) {
            commit('ADD_COURT', c)
        });

    },
    clearCourts({commit}){
        commit('CLEAR_COURTS')
    }

}

const getters = {
    getCourts: state => {
        return state.courts
    },
    getCourtInfo: state => {
        return courtid => {
            return state.courts.find(court => court.id == courtid)
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