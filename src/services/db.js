import axios from 'axios'


function newMatch(matchdata){

    console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/matches',matchdata)

}

function getSessionDetails( id ){

    return axios.get(process.env.VUE_APP_BACKEND + '/matches/' + id)
    
}

function endSession(params){

    return axios.delete( process.env.VUE_APP_BACKEND + `/matches/${params.id}`,
                            {
                            params: {
                                hash: params.hash
                              }
                        })      
}



export default  {
    newMatch: newMatch,
    getSessionDetails: getSessionDetails,
    endSession: endSession
}