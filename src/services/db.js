import axios from 'axios'


function newMatch(matchdata){

    console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/matches',matchdata)

}

function getSessionDetails( id ){

    return axios.get(process.env.VUE_APP_BACKEND + '/matches/' + id)
    
}

function endSession(params){

    var url = new URL(process.env.VUE_APP_BACKEND + '/matches/' + params.id)
    url.searchParams.set("hash",params.hash)

    return axios.delete( url )
}



export default  {
    newMatch: newMatch,
    getSessionDetails: getSessionDetails,
    endSession: endSession
}