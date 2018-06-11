import axios from 'axios'

const state = {
    
    regerrors: {
        firstname: null,
        lastname: null,
        email: null,
        phone: null,
        gender: null,
        username: null,
        password: null,
        pin: null,
        rank: null
    }

}

const mutations = {
    
}

const actions = {
    REGISTER_MEMBER({commit},memberPayload){
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        console.log("will try adding a user" + memberPayload)
        axios.post('http://localhost:3000/members',memberPayload)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response.data);
            });
    }
}

const getters = {
   
}

export default {
    namespaced: true, 
    state,
    mutations,
    actions,
    getters
}