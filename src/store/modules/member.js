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
    },
    members: [
        {name: 'Todd Snyder', id: 1, role: 'member'},
        {name: 'Laurent Mars', id: 2, role: 'member'},
        {name: 'Jun Tsuchiya', id: 3, role: 'member'},
        {name: 'Ardis Burfield', id: 4, role: 'member'},
        {name: 'Boris Alter', id: 5, role: 'member'},
        {name: 'Daniel Fmith (Guest)', id: 6, role: 'guest'},
        {name: 'Erick Tester (Guest)', id: 7, role: 'guest'}
      ]

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
   clubMembers: state => {
       return state.members
   },
   getMemberById: (state) => (id) => {
       return state.members.find( member => member.id == id )
   }
}

export default {
    namespaced: true, 
    state,
    mutations,
    actions,
    getters
}