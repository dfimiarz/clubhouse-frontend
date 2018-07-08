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
    REGISTER_MEMBER({commit},newMemberInfo){
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        axios.post('http://localhost:3000/members',newMemberInfo)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {


                if( error.response ){
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    commit('setError', error.response.data,  { root: true })

                }
                else{
                    console.log('Error: ', error.message);
                    commit('setError', "Connection failed",  { root: true })
                }
                
            })
            .finally(() => {
                commit('setLoading',false,  { root: true });
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