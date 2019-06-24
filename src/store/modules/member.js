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
      ]

}

const mutations = {
    ADD_MEMBER(state, member ){
        state.members.push(member)
    }
}

const actions = {
    REGISTER_MEMBER({commit},newMemberInfo){
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        axios.post('http://localhost:3000/members',newMemberInfo)
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {

                console.log("Error", error)
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
    },
    loadMembers({commit}){
        
        
        axios.get(process.env.VUE_APP_FUNCTION_ENDPOINT + '/members')
            .then(function (response) {
                const members = response.data
                members.forEach((member) => {
                    const t_member = Object.assign(member,{ name: member.firstname + " " + member.lastname })
                    commit('ADD_MEMBER',t_member)
                })
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
                
                commit('setLoading',false,  { root: true })
            });
        
       /*
        return db.collection('/members').get()
        .then((snap) => {
            snap.forEach( doc => {
                const data = doc.data()
                const id = doc.id
                commit('ADD_MEMBER',{ id: id, name: data.firstname + " " + data.lastname, role: data.role })
            })
        })
        */
    }
}

const getters = {
   clubMembers: state => {
       return state.members
   },
   getMemberById: (state) => (id) => {
       return state.members.find( member => member.id === id )
   }
}

export default {
    namespaced: true, 
    state,
    mutations,
    actions,
    getters
}