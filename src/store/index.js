import Vue from 'vue'
import Vuex from 'vuex'
import usermodule from './modules/user'
import membermodule from './modules/member'
import bookingsmodule from './modules/bookings'
import courtmodule from './modules/courts'
import utils from './../services/utils'


Vue.use(Vuex)

const store = new Vuex.Store(
    {
        modules: {
            userstore: usermodule,
            memberstore: membermodule,
            bookingsstore: bookingsmodule,
            courtstore: courtmodule
        },
        state: {
            settings: {
                displaymode: {
                    val: null,
                    default: "DESKTOP"
                }
            },
            dataloaded: false,
            displaymodes: ['DESKTOP','TV'],
            connected: null,
            clubtz: "America/New_York",
            loading: false,
            error: null,
            defaultCellHeight1H: 120,
            cellHeightsForMode: {
                'DESKTOP': 120,
                'TV': 200
            },
            opentime: "00:00",
            closetime: "23:00",
            repeaterTypes: [
                { id: 1000, label: "Non-repeater" },
                { id: 2000, label: "First Repeater" },
                { id: 3000, label: "Second Repeater" }
            ],
            bookingRules: [
                { id: 100, bumpable: false, maxduration: 45 * 60000 },
                { id: 10, bumpable: false, maxduration: 45 * 60000 },
                { id: 1, bumpable: true, maxduration: 45 * 60000 },
                { id: 200, bumpable: false, maxduration: 60 * 60000 },
                { id: 110, bumpable: false, maxduration: 30 * 60000 },
                { id: 20, bumpable: false, maxduration: 30 * 60000 },
                { id: 101, bumpable: true, maxduration: 30 * 60000 },
                { id: 11, bumpable: true, maxduration: 30 * 60000 },
                { id: 2, bumpable: true, maxduration: 30 * 60000 },
                { id: 300, bumpable: false, maxduration: 60 * 60000 },
                { id: 210, bumpable: false, maxduration: 60 * 60000 },
                { id: 120, bumpable: false, maxduration: 30 * 60000 },
                { id: 201, bumpable: true, maxduration: 30 * 60000 },
                { id: 30, bumpable: false, maxduration: 30 * 60000 },
                { id: 111, bumpable: true, maxduration: 30 * 60000 },
                { id: 21, bumpable: true, maxduration: 30 * 60000 },
                { id: 102, bumpable: true, maxduration: 30 * 60000 },
                { id: 12, bumpable: true, maxduration: 30 * 60000 },
                { id: 3, bumpable: true, maxduration: 30 * 60000 },
                { id: 400, bumpable: false, maxduration: 90 * 60000 },
                { id: 310, bumpable: false, maxduration: 45 * 60000 },
                { id: 220, bumpable: false, maxduration: 45 * 60000 },
                { id: 301, bumpable: true, maxduration: 45 * 60000 },
                { id: 130, bumpable: false, maxduration: 45 * 60000 },
                { id: 211, bumpable: true, maxduration: 45 * 60000 },
                { id: 40, bumpable: false, maxduration: 45 * 60000 },
                { id: 121, bumpable: true, maxduration: 45 * 60000 },
                { id: 202, bumpable: true, maxduration: 45 * 60000 },
                { id: 31, bumpable: true, maxduration: 45 * 60000 },
                { id: 112, bumpable: true, maxduration: 45 * 60000 },
                { id: 22, bumpable: true, maxduration: 45 * 60000 },
                { id: 103, bumpable: true, maxduration: 45 * 60000 },
                { id: 13, bumpable: true, maxduration: 45 * 60000 },
                { id: 4, bumpable: true, maxduration: 45 * 60000 }
            ]

        },
        mutations: {

            SET_LOADING(state, value) {
                state.loading = value
            },
            SET_ERROR(state, value) {
                state.error = value
            },
            SET_CONNECTED(state,val){
                state.connected = val;
            },
            SET_SETTING(state,{ name, val}){

                if( Object.prototype.hasOwnProperty.call(state.settings,name) ){
                    state.settings[name]['val'] = val
                }
            },
            SET_DATA_LOADED( state, val ){
                state.dataloaded = val;
            }
        },
        actions: {
            
            loadAppResources({ dispatch, getters }) {

                //Load app resources only when user is authenticated
                if( getters['userstore/isAuthenticated'] === true ){
                    return Promise.all([dispatch('memberstore/loadEligiblePersons'), dispatch('courtstore/loadCourts')])
                }
                else {
                    return Promise.resolve(true);
                }
            },
            clearAppResources({ commit,dispatch }){
                dispatch('memberstore/clearEligiblePersons');
                dispatch('courtstore/clearCourts');
                commit('SET_DATA_LOADED',false);
            },
            loadPersistantSettings({commit,state}){
                
                const settingNames = Object.keys(state.settings)

                settingNames.forEach( name => {

                    const storedValue = window.localStorage ? window.localStorage.getItem(name) : null

                    if( storedValue === null){
                        commit('SET_SETTING',{name: name, val: state.settings[name]["default"]});
                    }
                    else{
                        commit('SET_SETTING',{name: name, val: storedValue });
                    }
                });

            },
            setSetting({ commit }, { name, value }){
                
                if( window.localStorage ){
                    window.localStorage.setItem(name,value);
                }

                commit('SET_SETTING', { name: name, val: value } );
            },
            setLoading({commit},val){
                commit('SET_LOADING',val);
            },
            setError({commit},val){
                commit("SET_ERROR",val)
            },
            clearError({ commit }) {
                commit('SET_ERROR',null)
            },
            setDataLoaded({commit},val) {
                console.log("setting DL to",val)
                commit('SET_DATA_LOADED',val)
            }
        },
        getters: {
            error(state) {
                return state.error
            },
            loading(state) {
                return state.loading
            },
            startHour(state) {
                return Math.floor(state.startTimeMin / 60)
            },
            endHour(state) {
                return Math.ceil(state.endTimeMin / 60)
            },
            openMin(state) {
                var openmin = utils.timeToMinutes(state.opentime)
                //If opentime is not set, use 0 (00:00)
                return isNaN(openmin) ? 0 : openmin
            },
            closeMin(state) {
                var closemin = utils.timeToMinutes(state.closetime)
                //If closetime is not set, use 1439 (23:59)
                return isNaN(closemin) ? 1439 : closemin
            },
            calCellHeight1H(state) {
                return Object.prototype.hasOwnProperty.call(state.cellHeightsForMode,state.settings["displaymode"]["val"]) ? state.cellHeightsForMode[state.settings["displaymode"]["val"]] : state.defaultCellHeight1H;
            },
            repeaterTypes(state) {
                return state.repeaterTypes
            },
            getRepeaterType(state) {
                return (id) => {
                    return state.repeaterTypes.find((rtype) => {
                        return rtype.id == id
                    })
                }
            },
            getBookingRule(state) {
                return (id) => {
                    return state.bookingRules.find((rule) => {
                        return rule.id == id
                    })
                }
            },
            getSetting(state){
                return (name) => {
                    return Object.prototype.hasOwnProperty.call(state.settings,name) ? state.settings[name]["val"] : null;
                }
            },
            appActive(state,getters){
                return getters['userstore/isInitialized'] && state.dataloaded;
            }
            
        }
    }
)

export default store