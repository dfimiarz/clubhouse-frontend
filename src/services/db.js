import axios from 'axios'


function newMatch(matchdata){

    console.log(matchdata)

    return axios.post(process.env.VUE_APP_BACKEND + '/matches',matchdata)

}

function getSessionDetails( id ){

    return axios.get(process.env.VUE_APP_BACKEND + '/matches/' + id)
    
}



export default  {
    newMatch: newMatch,
    getSessionDetails: getSessionDetails
}