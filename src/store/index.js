import Vue from 'vue'
import Vuex from 'vuex'
import usermodule from './modules/user'


Vue.use(Vuex)

export const store = new Vuex.Store(
    {
        modules:{
            userstore: usermodule
        },
        state: {            
            loading: false,
            error: null
       
        },
        mutations: {
           
            setLoading(state,value){
                state.loading = value
            },
            setError(state,value){
                state.error = value
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