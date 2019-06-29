import Vue from 'vue'
import Vuex from 'vuex'
import usermodule from './modules/user'
import membermodule from './modules/member'
import matchmodule from './modules/matches'
import courtmodule from './modules/courts'

//import Axios from "axios";

//import db from '../firebase'


Vue.use(Vuex)

export const store = new Vuex.Store(
    {
        modules:{
            userstore: usermodule,
            memberstore: membermodule,
            matchstore: matchmodule,
            courtstore: courtmodule
        },
        state: {            
            loading: false,
            error: null,
            db: null,
            cellHeight1H: 120,
            startTimeMin: 8 * 60, 
            endTimeMin: 22 * 60,
            repeaterTypes: [
                { id : 0 , label : "Non-repeater"},
                { id : 1 , label : "First Repeater"},
                { id : 2 , label : "Second Repeater"}
            ],
            bookingRules:[
                { id: 100, bumpable: false, maxduration: 30 * 60000},
                { id: 10, bumpable: false, maxduration: 15 * 60000},
                { id: 1, bumpable: true, maxduration: 15 * 60000},
                { id: 200, bumpable: false, maxduration: 60 * 60000},
                { id: 110, bumpable: false, maxduration: 30 * 60000},
                { id: 20, bumpable: false, maxduration: 30 * 60000},
                { id: 101, bumpable: true, maxduration: 30 * 60000},
                { id: 11, bumpable: true, maxduration: 30  * 60000},
                { id: 2, bumpable: true, maxduration: 30 * 60000},
                { id: 300, bumpable: false, maxduration: 60 * 60000}, 
                { id: 210, bumpable: false, maxduration: 60 * 60000},
                { id: 120, bumpable: false, maxduration: 30 * 60000},
                { id: 201, bumpable: true, maxduration: 30 * 60000},
                { id: 30, bumpable: false, maxduration: 30 * 60000},
                { id: 111, bumpable: true, maxduration: 30 * 60000},
                { id: 21, bumpable: true, maxduration: 30 * 60000},
                { id: 102, bumpable: true, maxduration: 30 * 60000},
                { id: 12, bumpable: true, maxduration: 30 * 60000},
                { id: 3, bumpable: true, maxduration: 30 * 60000},
                { id: 400, bumpable: false, maxduration: 90 * 60000},
                { id: 310, bumpable: false, maxduration: 60 * 60000},
                { id: 220, bumpable: false, maxduration: 60 * 60000},
                { id: 301, bumpable: true, maxduration: 60 * 60000},
                { id: 130, bumpable: false, maxduration: 60 * 60000},
                { id: 211, bumpable: true, maxduration: 60 * 60000},
                { id: 40, bumpable: false, maxduration: 60 * 60000},
                { id: 121, bumpable: true, maxduration: 60 * 60000},
                { id: 202, bumpable: true, maxduration: 60 * 60000},
                { id: 31, bumpable: true, maxduration: 60 * 60000},
                { id: 112, bumpable: true, maxduration: 60 * 60000},
                { id: 22, bumpable: true, maxduration: 60 * 60000},
                { id: 103, bumpable: true, maxduration: 60 * 60000},
                { id: 13, bumpable: true, maxduration: 60 * 60000},
                { id: 4, bumpable: true, maxduration: 60 * 60000}
            ]

        },
        mutations: {
           
            setLoading(state,value){
                state.loading = value
            },
            setError(state,value){
                state.error = value
            },
            clearError( state ){
                state.error = null
            }
        },
        actions: {
            clearError({commit}){
                commit('clearError')
            },
            loadAppInfo({ dispatch }){
                Promise.all([dispatch('memberstore/loadMembers'),dispatch('courtstore/loadCourts')])
                .then( () =>{
                    console.log("Info loaded")
                })
                .catch( (err) =>{
                    console.log(err)
                })
                
            }
        },
        getters: {
            error (state) {
                return state.error
            },
            loading (state) {
                return state.loading
            },
            startHour( state ){
                return Math.trunc(state.startTimeMin/60)
            },
            endHour( state ){
                return Math.trunc(state.endTimeMin/60)
            },
            calCellHeight1H(state){
                return state.cellHeight1H;
            },
            repeaterTypes(state){
                return state.repeaterTypes
            },
            getRepeaterType(state){
                return (id) => {
                    return state.repeaterTypes.find((rtype) => {
                        return rtype.id == id
                    })
                }
            },
            getBookingRule(state){
                return (id) => {
                    return state.bookingRules.find((rule) => {
                        return rule.id == id
                    })
                }
            }
        }
    }
)