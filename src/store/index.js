import Vue from 'vue'
import Vuex from 'vuex'
import usermodule from './modules/user'
import membermodule from './modules/member'
import matchmodule from './modules/matches'


Vue.use(Vuex)

export const store = new Vuex.Store(
    {
        modules:{
            userstore: usermodule,
            memberstore: membermodule,
            matchstore: matchmodule
        },
        state: {            
            loading: false,
            error: null,
            db: null
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
            }
        }
    }
)