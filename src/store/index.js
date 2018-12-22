import Vue from 'vue'
import Vuex from 'vuex'
import usermodule from './modules/user'
import membermodule from './modules/member'
import matchmodule from './modules/matches'
import courtmodule from './modules/courts'


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
            cellHeight1H: 60
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
            }
        },
        getters: {
            error (state) {
                return state.error
            },
            loading (state) {
                return state.loading
            },
            calCellHeight1H(state){
                return state.cellHeight1H;
            }
        }
    }
)