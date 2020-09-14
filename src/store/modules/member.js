import axios from 'axios'
import dbservice from '../../services/db'

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
    ],
    guests: [

    ],
    eligible_persons: [

    ],
    active_persons: [

    ]

}

const mutations = {
    ADD_MEMBER(state, member) {
        state.members.push(member)
    },
    ADD_GUEST(state, guest) {
        state.members.push(guest)
    },
    ADD_ELIGIBLE_PERSON(state, person) {
        state.eligible_persons.push(person)
    },
    CLEAR_ELIGIBLE_PERSONS(state){
        state.eligible_persons.splice(0);
    }
}

const actions = {
    REGISTER_MEMBER({ commit }, newMemberInfo) {
        commit('clearError', null, { root: true })
        commit('setLoading', true, { root: true })
        axios.post(process.env.VUE_APP_BACKEND + '/members', newMemberInfo)
            .then(function () {

            })
            .catch(function (error) {

                // console.log("Error", error)
                if (error.response) {
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    commit('setError', error.response.data, { root: true })

                }
                else {
                    //console.log('Error: ', error.message);
                    commit('setError', "Connection failed", { root: true })
                }

            })
            .finally(() => {
                commit('setLoading', false, { root: true });
            });
    },
    async loadEligiblePersons({ commit }) {

        let eligiblePeronsData = await dbservice.getEligiblePersons()
        commit('CLEAR_ELIGIBLE_PERSONS');
        eligiblePeronsData.data.forEach((person) => {
            commit('ADD_ELIGIBLE_PERSON', person)
        })

    },
    async loadMembers({ commit }) {

        try {
            let membersdata = await dbservice.getMembers()
            membersdata.data.forEach((member) => {
                commit('ADD_MEMBER', member)
            })

        }
        finally {
            /* Continue regardless of errro */
        }

    },
    async loadGuests({ commit }) {

        try {
            let guestdata = await dbservice.getGuests()
            guestdata.data.forEach((guest) => {
                commit('ADD_GUEST', guest)
            })

        }
        finally {
            /* Continue regardless of errro */
        }

    }
}

const getters = {
    clubMembers: state => {
        return state.members
    },
    getMemberById: (state) => (id) => {
        return state.members.find(member => member.id === id)
    },
    getEligiblePersons() {
        return state.eligible_persons.map((person) => {
            const appendix = person.type_id === 2 ? ' [G]' : ''
            const nameformatted = `${person.firstname} ${person.lastname}${appendix}`
            return { ...person, "name": nameformatted }
        })
    },
    getActiveMembers() {
        return state.eligible_persons.filter((person) => person.type_id === 1).map((member) => {
            return { ...member, "name": `${member.firstname} ${member.lastname}` }
        })
    },
    getActiveGuests() {
        return state.eligible_persons.filter((person) => person.type_id === 2).map((guest) => {
            return { ...guest, "name": `${guest.firstname} ${guest.lastname}` }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}